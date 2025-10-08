"""
Advanced XSS Detection

Reflected XSS detection using marker tokens.
Identifies parameters, detects encoding contexts, and provides
remediation suggestions.
"""

import asyncio
import logging
import hashlib
import time
from typing import List, Dict, Any, Optional, Set
import urllib.parse
import re
from ..base import BaseCheck, Finding
from ..utils import extract_forms, extract_parameters

logger = logging.getLogger(__name__)

class XSSCheck(BaseCheck):
    """Cross-Site Scripting (XSS) vulnerability checker"""
    
    def __init__(self):
        super().__init__()
        self.name = "XSS Detection"
        self.description = "Reflected XSS detection using markers"
        
        # Generate unique marker for this scan session
        timestamp = str(int(time.time()))
        self.unique_marker = f"XSSTEST{hashlib.md5(timestamp.encode()).hexdigest()[:8]}"
        
        # XSS payloads for different contexts and bypass techniques
        self.xss_payloads = {
            'basic': [
                f'<script>alert("{self.unique_marker}")</script>',
                f'<img src=x onerror=alert("{self.unique_marker}")>',
                f'<svg onload=alert("{self.unique_marker}")>',
                f'"><script>alert("{self.unique_marker}")</script>',
                f"'><script>alert('{self.unique_marker}')</script>",
            ],
            'attribute_escape': [
                f'" onmouseover="alert(\'{self.unique_marker}\')"',
                f"' onmouseover='alert(\"{self.unique_marker}\")'",
                f'"><img src=x onerror=alert("{self.unique_marker}")>',
                f"'><img src=x onerror=alert('{self.unique_marker}')>",
            ],
            'javascript_context': [
                f'";alert("{self.unique_marker}");//',
                f"';alert('{self.unique_marker}');//",
                f'</script><script>alert("{self.unique_marker}")</script>',
                f'-alert("{self.unique_marker}")-',
            ],
            'filter_bypass': [
                f'<ScRiPt>alert("{self.unique_marker}")</ScRiPt>',
                f'<img src="x" onerror="alert(&quot;{self.unique_marker}&quot;)">',
                f'<svg/onload=alert("{self.unique_marker}")>',
                f'<iframe src="javascript:alert(\'{self.unique_marker}\')">',
                f'<body onload=alert("{self.unique_marker}")>',
                f'<details open ontoggle=alert("{self.unique_marker}")>',
            ],
            'encoding_bypass': [
                f'%3Cscript%3Ealert("{self.unique_marker}")%3C/script%3E',
                f'&lt;script&gt;alert("{self.unique_marker}")&lt;/script&gt;',
                f'\\u003cscript\\u003ealert("{self.unique_marker}")\\u003c/script\\u003e',
            ]
        }
        
        # Test markers for reflection detection
        self.context_markers = {
            'html': f'<!--{self.unique_marker}-->',
            'attribute': f'data-xss="{self.unique_marker}"',
            'javascript': f'/*{self.unique_marker}*/',
            'css': f'/*{self.unique_marker}*/',
            'url': f'#{self.unique_marker}'
        }
    
    async def check(self, url: str, session, **kwargs) -> List[Finding]:
        """
        XSS detection using markers
        
        Detects reflection without executing malicious code.
        Context-aware analysis for severity assessment.
        """
        findings = []
        
        try:
            # Get the original page for baseline analysis
            async with session.get(url, allow_redirects=True) as response:
                if response.status != 200:
                    return findings
                    
                original_content = await response.text()
            
            # 1. Test URL parameters
            url_findings = await self._test_url_parameters(session, url)
            findings.extend(url_findings)
            
            # 2. Test form inputs
            form_findings = await self._test_forms(session, url, original_content)
            findings.extend(form_findings)
            
        except Exception as e:
            logger.error(f"XSS check failed for {url}: {e}")
        
        return findings
    
    async def _test_url_parameters(self, session, url: str) -> List[Finding]:
        """URL parameter testing for XSS with multiple payload types"""
        findings = []
        parsed_url = urllib.parse.urlparse(url)
        
        if not parsed_url.query:
            return findings
        
        params = dict(urllib.parse.parse_qsl(parsed_url.query))
        if not params:
            return findings
        
        for param_name, param_value in params.items():
            # Test with different payload categories
            for category, payloads in self.xss_payloads.items():
                for payload in payloads[:2]:  # Limit payloads per category
                    try:
                        test_params = params.copy()
                        test_params[param_name] = payload
                        
                        test_url = self._build_test_url(url, test_params)
                        
                        async with session.get(test_url) as response:
                            content = await response.text()
                            
                            # Check for XSS reflection
                            if self._detect_xss_reflection(content, payload):
                                context = self._analyze_xss_context(content, payload)
                                
                                findings.append(Finding(
                                    title=f"Reflected XSS Vulnerability ({category.replace('_', ' ').title()})",
                                    description=f"XSS vulnerability in parameter '{param_name}' - {category} payload reflected",
                                    severity=self._get_xss_severity(context, category),
                                    confidence="high" if category == "basic" else "medium",
                                    url=test_url,
                                    method="GET",
                                    parameter=param_name,
                                    payload=payload,
                                    evidence=f"Payload reflected in {context} context: {self.unique_marker}",
                                    remediation=self._get_xss_remediation(context),
                                    references=["https://owasp.org/www-community/attacks/xss/"],
                                    cwe_id="CWE-79",
                                    owasp_category="A03:2021 – Injection"
                                ))
                                break  # Found XSS, move to next parameter
                    
                    except Exception as e:
                        logger.debug(f"XSS test error for {param_name}: {e}")
                        continue
                
                # If we found XSS with this category, don't test other categories for this param
                if any(f.parameter == param_name for f in findings):
                    break
        
        return findings
    
    async def _test_forms(self, session, url: str, original_content: str) -> List[Finding]:
        """
        Test form inputs for XSS using markers
        
        Passive analysis.
        """
        findings = []
        forms = extract_forms(original_content, url)
        
        for form in forms:
            if not form['inputs']:
                continue
            
            for input_field in form['inputs']:
                if input_field['type'].lower() in ['submit', 'button', 'hidden']:
                    continue
                
                field_name = input_field['name']
                for category, payloads in self.xss_payloads.items():
                    for payload in payloads[:2]:
                        try:
                            form_data = {}
                            for inp in form['inputs']:
                                if inp['name'] == field_name:
                                    form_data[inp['name']] = payload
                                else:
                                    form_data[inp['name']] = inp.get('value', 'test')
                            
                            method = form.get('method', 'GET').upper()
                            action_url = form.get('action', url)
                            
                            if method == 'POST':
                                async with session.post(action_url, data=form_data) as response:
                                    content = await response.text()
                            else:
                                async with session.get(action_url, params=form_data) as response:
                                    content = await response.text()
                            
                            context = self._analyze_xss_context(content, payload)
                            if self._detect_xss_reflection(content, payload):
                                findings.append(Finding(
                                    title=f"XSS in Form ({category.replace('_', ' ').title()})",
                                    description=f"XSS vulnerability in form field '{field_name}' - {context} context",
                                    severity=self._get_xss_severity(context, category),
                                    confidence="high",
                                    url=action_url,
                                    method=method,
                                    parameter=field_name,
                                    payload=payload,
                                    evidence=f"Reflected in {context}: {self.unique_marker}",
                                    remediation=self._get_xss_remediation(context),
                                    references=["https://owasp.org/www-community/attacks/xss/"],
                                    cwe_id="CWE-79",
                                    owasp_category="A03:2021 – Injection"
                                ))
                                break
                        except Exception as e:
                            logger.debug(f"Form XSS test error: {e}")
        
        return findings
    
    def _detect_xss_reflection(self, content: str, payload: str) -> bool:
        """Detect if payload is reflected in content"""
        return self.unique_marker in content
    
    def _analyze_xss_context(self, content: str, payload: str) -> str:
        """Analyze the context where the marker is reflected"""
        marker_pos = content.find(self.unique_marker)
        if marker_pos == -1:
            return "unknown"
        
        # Extract surrounding context
        start = max(0, marker_pos - 200)
        end = min(len(content), marker_pos + len(self.unique_marker) + 200)
        surrounding_context = content[start:end].lower()
        
        # Analyze different reflection contexts
        if re.search(r'<script[^>]*>.*?' + re.escape(self.unique_marker), content, re.IGNORECASE | re.DOTALL):
            return 'script_tag'
        elif re.search(r'<[^>]+\s+[^=]*=\s*["\']?[^"\']*' + re.escape(self.unique_marker), content, re.IGNORECASE):
            return 'html_attribute'
        elif any(js_context in surrounding_context for js_context in ['javascript:', 'onclick=', 'onload=', 'onerror=']):
            return 'javascript'
        elif '<style' in surrounding_context or 'style=' in surrounding_context:
            return 'css'
        elif re.search(r'>[^<]*' + re.escape(self.unique_marker) + r'[^<]*<', content):
            if any(encoded in surrounding_context for encoded in ['&lt;', '&gt;', '&quot;', '&#']):
                return 'html_content_encoded'
            else:
                return 'html_content'
        elif any(url_context in surrounding_context for url_context in ['href=', 'src=', 'action=']):
            return 'url'
        elif '<!--' in surrounding_context and '-->' in surrounding_context:
            return 'html_comment'
        else:
            return 'text_content'
    
    def _get_xss_severity(self, context: str, category: str) -> str:
        """Determine XSS severity based on context and payload type"""
        if context in ["javascript", "event_handler"]:
            return "high"
        elif context == "attribute" and category in ["basic", "attribute_escape"]:
            return "high"
        elif category == "filter_bypass":
            return "high"
        else:
            return "medium"
    
    def _get_xss_remediation(self, context: str) -> str:
        """Get context-specific XSS remediation advice"""
        remediation_map = {
            "html": "Encode HTML entities (&lt; &gt; &amp; &quot; &#x27;) before outputting user data",
            "attribute": "Use attribute encoding and validate attribute values",
            "javascript": "Use JSON encoding and avoid direct string concatenation in JavaScript",
            "event_handler": "Avoid dynamic event handler generation, use addEventListener instead",
            "css": "Use CSS encoding and validate CSS values",
            "unknown": "Implement proper output encoding based on context"
        }
        return remediation_map.get(context, remediation_map["unknown"])
    
    def _build_test_url(self, url: str, params: dict) -> str:
        """Build test URL with modified parameters"""
        parsed_url = urllib.parse.urlparse(url)
        return urllib.parse.urlunparse((
            parsed_url.scheme,
            parsed_url.netloc,
            parsed_url.path,
            parsed_url.params,
            urllib.parse.urlencode(params),
            parsed_url.fragment
        ))