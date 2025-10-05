"""
Advanced CSRF Detection

Detection for forms and API endpoints that change state.
Checks for CSRF tokens, SameSite cookie policies, and Origin/Referer validation.
"""

import asyncio
import logging
import hashlib
from typing import List, Dict, Any, Optional, Set
import re
import urllib.parse
import httpx
from ..base import BaseCheck, Finding
from ..utils import extract_forms

logger = logging.getLogger(__name__)

class CSRFCheck(BaseCheck):
    """Advanced Cross-Site Request Forgery (CSRF) vulnerability checker"""
    
    def __init__(self):
        super().__init__()
        self.name = "CSRF Protection"
        self.description = "Detection of missing CSRF protection in state-changing operations"
        
        # Common CSRF token field names and patterns
        self.csrf_token_patterns = [
            r'csrf[_-]?token',
            r'_token',
            r'authenticity[_-]?token', 
            r'__requestverificationtoken',
            r'csrfmiddlewaretoken',
            r'_csrf',
            r'csrf_token',
            r'xsrf[_-]?token',
            r'anti[_-]?forgery[_-]?token',
            r'state',  # OAuth state params
            r'nonce',
            r'token'
        ]
        
        # State-changing HTTP methods that should have CSRF protection
        self.state_changing_methods = {'POST', 'PUT', 'DELETE', 'PATCH', 'TRACE', 'CONNECT'}
        
        # Session cookie indicators
        self.session_cookie_indicators = [
            'session', 'jsession', 'phpsess', 'asp.net_session', 
            'connect.sid', 'laravel_session', 'django_session',
            'PHPSESSID', 'JSESSIONID', 'ASP.NET_SessionId'
        ]
    
    async def check(self, url: str, session, **kwargs) -> List[Finding]:
        """
        CSRF protection analysis
        
        Analyzes existing forms and endpoints, uses OPTIONS, HEAD for testing.
        Detects protection mechanisms.
        """
        findings = []
        
        try:
            # Get the page content and headers
            response = await session.get(url, follow_redirects=True)
            if response.status_code not in [200, 302, 301]:
                return findings
                
            content = response.text
            headers = response.headers
            
            # 1. Analyze forms for CSRF protection
            form_findings = await self._analyze_forms_csrf_protection(url, content, headers)
            findings.extend(form_findings)
            
            # 2. Check API endpoints for CSRF protection
            api_findings = await self._check_api_endpoints_csrf(session, url, headers)
            findings.extend(api_findings)
            
            # 3. Analyze cookie security for CSRF protection
            cookie_findings = self._analyze_cookie_csrf_protection(url, headers)
            findings.extend(cookie_findings)
            
            # 4. Check for Origin/Referer validation
            header_findings = self._check_origin_referer_protection(url, headers)
            findings.extend(header_findings)
                
        except Exception as e:
            logger.error(f"CSRF check failed for {url}: {e}")
        
        return findings
    
    async def _analyze_forms_csrf_protection(self, url: str, content: str, headers: dict) -> List[Finding]:
        """
        Analyze forms for CSRF protection mechanisms
        
        Passive analysis only.
        """
        findings = []
        
        try:
            forms = extract_forms(content, url)
        except Exception as e:
            logger.debug(f"Error extracting forms: {e}")
            return findings
        
        for form in forms:
            method = form.get('method', 'GET').upper()
            
            # Only check state-changing methods
            if method not in self.state_changing_methods:
                continue
            
            action_url = form.get('action', url)
            form_inputs = form.get('inputs', [])
            
            # Check for CSRF token in form
            has_csrf_token = self._has_csrf_token_in_form(form_inputs)
            
            if not has_csrf_token:
                # Check for alternative CSRF protections
                has_samesite_protection = self._has_samesite_cookie_protection(headers)
                has_custom_header_protection = self._requires_custom_headers(headers)
                
                if not (has_samesite_protection or has_custom_header_protection):
                    findings.append(Finding(
                        title="Missing CSRF Protection in Form",
                        description=f"Form using {method} method lacks CSRF protection mechanisms",
                        severity="medium",
                        confidence="high",
                        url=action_url,
                        evidence=f"Form method: {method}, Action: {action_url}, No CSRF token found in {len(form_inputs)} form fields",
                        remediation="Implement CSRF tokens, use SameSite cookie attributes, or require custom headers for state-changing operations",
                        references=self._get_csrf_references(),
                        request_info=f"curl -X {method} '{action_url}' -d 'field=value'",
                        proof_id=f"csrf-form-{hashlib.md5(action_url.encode()).hexdigest()[:8]}"
                    ))
            else:
                # Form has CSRF token - check if it's in a hidden field (good practice)
                csrf_token_field = self._get_csrf_token_field(form_inputs)
                if csrf_token_field and csrf_token_field.get('type', '').lower() != 'hidden':
                    findings.append(Finding(
                        title="CSRF Token in Visible Field",
                        description="CSRF token is present but not in a hidden field",
                        severity="low",
                        confidence="medium",
                        url=action_url,
                        evidence=f"CSRF token field '{csrf_token_field.get('name')}' has type '{csrf_token_field.get('type', 'text')}'",
                        remediation="Use hidden input fields for CSRF tokens to prevent accidental exposure",
                        references=self._get_csrf_references(),
                        request_info=f"View source of form at {action_url}",
                        proof_id=f"csrf-visible-{hashlib.md5(action_url.encode()).hexdigest()[:8]}"
                    ))
        
        return findings
    
    def _has_csrf_token_in_form(self, form_inputs: List[Dict[str, Any]]) -> bool:
        """Check if form inputs contain a CSRF token field"""
        for input_field in form_inputs:
            field_name = input_field.get('name', '').lower()
            for pattern in self.csrf_token_patterns:
                if re.search(pattern, field_name, re.IGNORECASE):
                    return True
        return False
    
    def _get_csrf_token_field(self, form_inputs: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """Get the CSRF token field from form inputs"""
        for input_field in form_inputs:
            field_name = input_field.get('name', '').lower()
            for pattern in self.csrf_token_patterns:
                if re.search(pattern, field_name, re.IGNORECASE):
                    return input_field
        return None
    
    def _has_samesite_cookie_protection(self, headers: dict) -> bool:
        """Check for SameSite cookie protection"""
        for key, value in headers.items():
            if key.lower() == 'set-cookie':
                cookie_lower = str(value).lower()
                # Check for session cookies with SameSite protection
                if any(indicator in cookie_lower for indicator in self.session_cookie_indicators):
                    if 'samesite=lax' in cookie_lower or 'samesite=strict' in cookie_lower:
                        return True
        return False
    
    def _requires_custom_headers(self, headers: dict) -> bool:
        """Check if custom headers are required"""
        custom_headers = ['X-Requested-With', 'X-CSRF-Token']
        for key in custom_headers:
            if key in headers:
                return True
        return False
    
    async def _check_api_endpoints_csrf(self, session, url: str, headers: dict) -> List[Finding]:
        """
        Check API endpoints for CSRF protection
        
        Uses OPTIONS method only.
        """
        findings = []
        
        try:
            async with session.options(url) as response:
                allowed_methods = response.headers.get('Allow', '')
                access_control_methods = response.headers.get('Access-Control-Allow-Methods', '')
                
                state_changing_allowed = any(
                    method in allowed_methods or method in access_control_methods
                    for method in self.state_changing_methods
                )
                
                if state_changing_allowed:
                    # Check if CORS allows credentials with wildcard origin
                    access_control_origin = response.headers.get('Access-Control-Allow-Origin', '')
                    access_control_credentials = response.headers.get('Access-Control-Allow-Credentials', '').lower()
                    
                    if access_control_origin == '*' and access_control_credentials == 'true':
                        findings.append(Finding(
                            title="API Endpoint Vulnerable to CSRF via CORS",
                            description="API endpoint allows state-changing methods with dangerous CORS configuration",
                            severity="high",
                            confidence="high",
                            url=url,
                            evidence=f"Allowed methods: {allowed_methods or access_control_methods}, CORS: Origin=*, Credentials=true",
                            remediation="Either remove Access-Control-Allow-Credentials or specify explicit allowed origins instead of wildcard",
                            references=self._get_csrf_references(),
                            request_info=f"curl -X OPTIONS '{url}' -H 'Origin: https://evil.example.com'",
                            proof_id=f"csrf-api-cors-{hashlib.md5(url.encode()).hexdigest()[:8]}"
                        ))
                    
                    # Check if custom headers are required for state-changing operations
                    elif not self._requires_custom_headers(response.headers):
                        findings.append(Finding(
                            title="API Endpoint Missing CSRF Protection",
                            description="API endpoint allows state-changing methods without requiring custom headers",
                            severity="medium",
                            confidence="medium",
                            url=url,
                            evidence=f"Allowed methods: {allowed_methods or access_control_methods}, No custom header requirements detected",
                            remediation="Require custom headers (e.g., X-Requested-With) for state-changing API operations",
                            references=self._get_csrf_references(),
                            request_info=f"curl -X POST '{url}' -d 'data=value'",
                            proof_id=f"csrf-api-headers-{hashlib.md5(url.encode()).hexdigest()[:8]}"
                        ))
        
        except Exception as e:
            logger.debug(f"API CSRF check failed for {url}: {e}")
        
        return findings
    
    def _analyze_cookie_csrf_protection(self, url: str, headers: dict) -> List[Finding]:
        """
        Analyze cookies for CSRF protection attributes
        
        Passive analysis.
        """
        findings = []
        
        session_cookies_without_samesite = []
        
        for key, value in headers.items():
            if key.lower() == 'set-cookie':
                cookie_str = str(value).lower()
                cookie_name = str(value).split('=')[0] if '=' in str(value) else 'unknown'
                
                # Check if this is a session cookie
                is_session_cookie = any(
                    indicator in cookie_str 
                    for indicator in self.session_cookie_indicators
                )
                
                if is_session_cookie:
                    # Check for SameSite attribute
                    if 'samesite' not in cookie_str:
                        session_cookies_without_samesite.append(cookie_name)
                    elif 'samesite=none' in cookie_str:
                        # SameSite=None without Secure is problematic
                        if 'secure' not in cookie_str:
                            findings.append(Finding(
                                title="Insecure SameSite=None Cookie",
                                description=f"Session cookie '{cookie_name}' uses SameSite=None without Secure flag",
                                severity="medium",
                                confidence="high",
                                url=url,
                                evidence=f"Set-Cookie: {str(value)[:200]}...",
                                remediation="Add Secure flag to cookies with SameSite=None or use SameSite=Lax/Strict",
                                references=self._get_csrf_references(),
                                request_info=f"curl -I '{url}'",
                                proof_id=f"csrf-samesite-none-{hashlib.md5(cookie_name.encode()).hexdigest()[:8]}"
                            ))
        
        if session_cookies_without_samesite:
            findings.append(Finding(
                title="Session Cookies Missing SameSite Protection",
                description="Session cookies lack SameSite attribute for CSRF protection",
                severity="medium",
                confidence="high",
                url=url,
                evidence=f"Session cookies without SameSite: {', '.join(session_cookies_without_samesite)}",
                remediation="Add SameSite=Strict or SameSite=Lax attribute to session cookies",
                references=self._get_owasp_references()
            ))
        
        return findings