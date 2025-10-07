import asyncio
import logging
from typing import List, Dict, Any, Optional
import urllib.parse
from ..utils import extract_forms, extract_parameters, generate_payloads, calculate_severity

logger = logging.getLogger(__name__)

class OpenRedirectCheck:
    """Open Redirect vulnerability checker"""
    
    def __init__(self):
        self.description = "Detects open redirect vulnerabilities"
        self.default_severity = "medium"
        self.payloads = generate_payloads('open_redirect')
        
        # Common parameter names that might be vulnerable to open redirect
        self.redirect_param_patterns = [
            'redirect', 'url', 'uri', 'link', 'goto', 'target', 'destination',
            'next', 'continue', 'return', 'returnurl', 'return_url', 'redirect_url',
            'callback', 'success_url', 'failure_url', 'cancel_url', 'back',
            'forward', 'location', 'site', 'domain', 'host', 'referer'
        ]
    
    async def check(self, session, url: str) -> List[Dict[str, Any]]:
        """Check for open redirect vulnerabilities"""
        findings = []
        
        try:
            # Get the original page
            async with session.get(url, allow_redirects=False) as response:
                original_status = response.status
                original_headers = response.headers
                original_content = await response.text()
            
            # Test URL parameters
            param_findings = await self._test_url_parameters(session, url, original_status, original_headers)
            findings.extend(param_findings)
            
            # Test forms
            form_findings = await self._test_forms(session, url, original_content)
            findings.extend(form_findings)
                
        except Exception as e:
            logger.error(f"Open redirect check failed for {url}: {e}")
        
        return findings
    
    async def _test_url_parameters(self, session, url: str, original_status: int, original_headers: Dict[str, str]) -> List[Dict[str, Any]]:
        """Test URL parameters for open redirect vulnerabilities"""
        findings = []
        params = extract_parameters(url)
        
        if not params:
            return findings
        
        for param_name, param_value in params.items():
            # Check if parameter name suggests it might be used for redirection
            if self._is_redirect_parameter(param_name):
                redirect_finding = await self._test_parameter_redirect(
                    session, url, param_name, param_value, original_status, original_headers
                )
                if redirect_finding:
                    findings.append(redirect_finding)
        
        return findings
    
    async def _test_forms(self, session, url: str, original_content: str) -> List[Dict[str, Any]]:
        """Test form inputs for open redirect vulnerabilities"""
        findings = []
        forms = extract_forms(original_content, url)
        
        for form in forms:
            if not form['inputs']:
                continue
            
            for input_field in form['inputs']:
                if input_field['type'] in ['submit', 'button', 'hidden']:
                    continue
                
                # Check if input field name suggests it might be used for redirection
                if self._is_redirect_parameter(input_field['name']):
                    redirect_finding = await self._test_form_field_redirect(session, form, input_field)
                    if redirect_finding:
                        findings.append(redirect_finding)
        
        return findings
    
    def _is_redirect_parameter(self, param_name: str) -> bool:
        """Check if parameter name suggests it might be used for redirection"""
        if not param_name:
            return False
        
        param_lower = param_name.lower()
        return any(pattern in param_lower for pattern in self.redirect_param_patterns)
    
    async def _test_parameter_redirect(self, session, url: str, param_name: str, param_value: str,
                                     original_status: int, original_headers: Dict[str, str]) -> Optional[Dict[str, Any]]:
        """Test a specific parameter for open redirect vulnerability"""
        try:
            for payload in self.payloads[:5]:  # Limit payloads
                # Create modified parameters
                params = extract_parameters(url)
                params[param_name] = payload
                
                # Build test URL
                parsed_url = urllib.parse.urlparse(url)
                test_url = urllib.parse.urlunparse((
                    parsed_url.scheme,
                    parsed_url.netloc,
                    parsed_url.path,
                    parsed_url.params,
                    urllib.parse.urlencode(params),
                    parsed_url.fragment
                ))
                
                # Test the payload (don't follow redirects)
                async with session.get(test_url, allow_redirects=False) as response:
                    redirect_result = self._analyze_redirect_response(
                        response, payload, original_status, original_headers
                    )
                    
                    if redirect_result:
                        return {
                            'type': 'open_redirect',
                            'severity': calculate_severity('open_redirect'),
                            'title': 'Open Redirect Vulnerability',
                            'description': f'Open redirect vulnerability detected in parameter "{param_name}"',
                            'url': test_url,
                            'parameter': param_name,
                            'payload': payload,
                            'evidence': redirect_result['evidence'],
                            'redirect_location': redirect_result.get('location', ''),
                            'recommendation': 'Implement URL validation and use a whitelist of allowed redirect destinations'
                        }
        
        except Exception as e:
            logger.debug(f"Error testing open redirect for parameter {param_name}: {e}")
        
        return None
    
    async def _test_form_field_redirect(self, session, form: Dict[str, Any], input_field: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Test a form field for open redirect vulnerability"""
        try:
            for payload in self.payloads[:3]:  # Limit payloads for forms
                # Prepare form data
                form_data = {}
                for inp in form['inputs']:
                    if inp['name']:
                        if inp['name'] == input_field['name']:
                            form_data[inp['name']] = payload
                        else:
                            form_data[inp['name']] = inp['value'] or 'test'
                
                # Send form request (don't follow redirects)
                if form['method'].lower() == 'post':
                    async with session.post(form['action'], data=form_data, allow_redirects=False) as response:
                        pass
                else:
                    async with session.get(form['action'], params=form_data, allow_redirects=False) as response:
                        pass
                
                # Analyze response for redirect
                redirect_result = self._analyze_redirect_response(response, payload)
                
                if redirect_result:
                    return {
                        'type': 'open_redirect',
                        'severity': calculate_severity('open_redirect'),
                        'title': 'Open Redirect in Form',
                        'description': f'Open redirect vulnerability detected in form field "{input_field["name"]}"',
                        'url': form['action'],
                        'form_method': form['method'],
                        'parameter': input_field['name'],
                        'payload': payload,
                        'evidence': redirect_result['evidence'],
                        'redirect_location': redirect_result.get('location', ''),
                        'recommendation': 'Validate redirect URLs and use relative paths or whitelisted domains'
                    }
        
        except Exception as e:
            logger.debug(f"Error testing open redirect for form field {input_field['name']}: {e}")
        
        return None
    
    def _analyze_redirect_response(self, response, payload: str, original_status: int = None, 
                                 original_headers: Dict[str, str] = None) -> Optional[Dict[str, str]]:
        """Analyze response for open redirect indicators"""
        
        # Check for HTTP redirect status codes
        if response.status in [301, 302, 303, 307, 308]:
            location = response.headers.get('Location', '')
            
            if location:
                # Check if the location matches our payload
                if self._is_external_redirect(location, payload):
                    return {
                        'evidence': f'HTTP {response.status} redirect to external URL: {location}',
                        'location': location
                    }
                
                # Check for common redirect bypass techniques
                if self._check_redirect_bypass(location, payload):
                    return {
                        'evidence': f'Redirect bypass detected: {location}',
                        'location': location
                    }
        
        # Check for JavaScript-based redirects in response content
        try:
            content = response.text if hasattr(response, 'text') else ''
            if content:
                js_redirect = self._check_javascript_redirect(content, payload)
                if js_redirect:
                    return {
                        'evidence': f'JavaScript redirect detected: {js_redirect}',
                        'location': js_redirect
                    }
        except:
            pass
        
        # Check for meta refresh redirects
        try:
            content = response.text if hasattr(response, 'text') else ''
            if content:
                meta_redirect = self._check_meta_refresh_redirect(content, payload)
                if meta_redirect:
                    return {
                        'evidence': f'Meta refresh redirect detected: {meta_redirect}',
                        'location': meta_redirect
                    }
        except:
            pass
        
        return None
    
    def _is_external_redirect(self, location: str, payload: str) -> bool:
        """Check if redirect location is external and matches payload"""
        try:
            # Parse the location URL
            parsed_location = urllib.parse.urlparse(location)
            parsed_payload = urllib.parse.urlparse(payload)
            
            # Check if it's an absolute URL to external domain
            if parsed_location.netloc and parsed_payload.netloc:
                return parsed_location.netloc.lower() == parsed_payload.netloc.lower()
            
            # Check for protocol-relative URLs (//example.com)
            if location.startswith('//') and payload.startswith('//'):
                return location.lower() == payload.lower()
            
            # Check for exact match
            return location.lower() == payload.lower()
            
        except Exception:
            return False
    
    def _check_redirect_bypass(self, location: str, payload: str) -> bool:
        """Check for common redirect bypass techniques"""
        bypass_patterns = [
            '//evil.com',
            '///evil.com',
            '////evil.com',
            'http:evil.com',
            'https:evil.com',
            'javascript:',
            'data:text/html'
        ]
        
        location_lower = location.lower()
        payload_lower = payload.lower()
        
        for pattern in bypass_patterns:
            if pattern in payload_lower and pattern in location_lower:
                return True
        
        return False
    
    def _check_javascript_redirect(self, content: str, payload: str) -> Optional[str]:
        """Check for JavaScript-based redirects"""
        import re
        
        # Common JavaScript redirect patterns
        js_patterns = [
            r'window\.location\s*=\s*["\']([^"\']+)["\']',
            r'window\.location\.href\s*=\s*["\']([^"\']+)["\']',
            r'document\.location\s*=\s*["\']([^"\']+)["\']',
            r'location\.href\s*=\s*["\']([^"\']+)["\']',
            r'location\.replace\s*\(\s*["\']([^"\']+)["\']\s*\)',
            r'window\.open\s*\(\s*["\']([^"\']+)["\']\s*\)'
        ]
        
        for pattern in js_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            for match in matches:
                if payload.lower() in match.lower():
                    return match
        
        return None
    
    def _check_meta_refresh_redirect(self, content: str, payload: str) -> Optional[str]:
        """Check for meta refresh redirects"""
        import re
        
        # Meta refresh pattern
        meta_pattern = r'<meta[^>]+http-equiv\s*=\s*["\']refresh["\'][^>]+content\s*=\s*["\'][^"\']*url\s*=\s*([^"\'>\s]+)["\'][^>]*>'
        
        matches = re.findall(meta_pattern, content, re.IGNORECASE)
        for match in matches:
            if payload.lower() in match.lower():
                return match
        
        return None