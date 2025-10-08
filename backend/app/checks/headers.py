"""
Security Headers Check

Checks for missing/misconfigured security headers, TLS certificates,
CORS misconfigurations, and cookie security attributes.
"""

import re
import ssl
import socket
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from urllib.parse import urlparse
import httpx
from ..base import BaseCheck, Finding

logger = logging.getLogger(__name__)

class SecurityHeadersCheck(BaseCheck):
    """Security headers, TLS, CORS, and cookie security check"""
    
    def __init__(self):
        super().__init__()
        self.name = "Security Headers & TLS"
        self.description = "Security headers, TLS certificate, CORS, and cookie security analysis"
        
        # Define security headers with their validation rules
        self.security_headers = {
            'X-Frame-Options': {
                'required': True,
                'safe_values': ['DENY', 'SAMEORIGIN'],
                'severity': 'medium',
                'description': 'Prevents clickjacking attacks by controlling frame embedding'
            },
            'X-Content-Type-Options': {
                'required': True,
                'safe_values': ['nosniff'],
                'severity': 'medium', 
                'description': 'Prevents MIME type sniffing attacks'
            },
            'Strict-Transport-Security': {
                'required': True,
                'pattern': r'max-age=\d+',
                'severity': 'high',
                'description': 'Enforces HTTPS connections and prevents downgrade attacks'
            },
            'Content-Security-Policy': {
                'required': True,
                'severity': 'high',
                'description': 'Prevents XSS and data injection attacks through content restrictions'
            },
            'Referrer-Policy': {
                'required': False,
                'safe_values': ['strict-origin-when-cross-origin', 'strict-origin', 'no-referrer'],
                'severity': 'low',
                'description': 'Controls referrer information leakage'
            },
            'Permissions-Policy': {
                'required': False,
                'severity': 'low',
                'description': 'Controls browser feature access'
            }
        }
    
    async def check(self, url: str, session, **kwargs) -> List[Finding]:
        """
        Security headers, TLS, CORS, and cookie analysis
        
        Passive analysis of response headers.
        TLS certificate validation uses read-only operations.
        CORS testing uses safe requests.
        """
        findings = []
        
        try:
            # Primary request for header analysis
            response = await session.get(url, follow_redirects=True)
            headers = response.headers
            
            # 1. Security Headers Analysis
            header_findings = await self._check_security_headers(url, headers)
            findings.extend(header_findings)
            
            # 2. TLS Certificate Analysis
            if url.startswith('https://'):
                tls_findings = await self._check_tls_certificate(url)
                findings.extend(tls_findings)
            
            # 3. CORS Misconfiguration Analysis
            cors_findings = await self._check_cors_configuration(url, session)
            findings.extend(cors_findings)
            
            # 4. Cookie Security Analysis
            cookie_findings = self._check_cookie_security(url, headers)
            findings.extend(cookie_findings)
            
            # 5. Information Disclosure Analysis
            info_findings = self._check_information_disclosure(url, headers)
            findings.extend(info_findings)
            
        except Exception as e:
            logger.error(f"Security headers check failed for {url}: {e}")
        
        return findings
    
    async def _check_security_headers(self, url: str, headers: dict) -> List[Finding]:
        """Check security headers for missing or misconfigured values"""
        findings = []
        
        for header_name, config in self.security_headers.items():
            header_value = headers.get(header_name, '')
            
            if not header_value and config['required']:
                # Missing required header
                findings.append(Finding(
                    title=f"Missing Security Header: {header_name}",
                    description=f"The {header_name} security header is missing. {config['description']}",
                    severity=config['severity'],
                    confidence="high",
                    url=url,
                    evidence=f"Response headers do not include {header_name}",
                    remediation=f"Add the {header_name} header to your server configuration",
                    references=[
                        "OWASP Security Headers Project",
                        "WSTG-CONF-12: Test HTTP Strict Transport Security",
                        "WSTG-CLNT-03: Test for HTML Injection"
                    ],
                    request_info=f"curl -I '{url}'",
                    proof_id=f"missing-{header_name.lower()}"
                ))
            elif header_value:
                # Validate header value if present
                validation_result = self._validate_header_value(header_name, header_value, config)
                if validation_result:
                    findings.append(Finding(
                        title=f"Weak Security Header: {header_name}",
                        description=validation_result['description'],
                        severity="medium",
                        confidence="high", 
                        url=url,
                        evidence=f"{header_name}: {header_value[:500]}",
                        remediation=validation_result['remediation'],
                        references=[
                            "OWASP Security Headers Project",
                            "Mozilla Observatory Security Headers"
                        ],
                        request_info=f"curl -I '{url}'",
                        proof_id=f"weak-{header_name.lower()}"
                    ))
        
        return findings
    
    def _validate_header_value(self, header_name: str, value: str, config: dict) -> Optional[dict]:
        """Validate security header value against expected patterns"""
        if 'safe_values' in config:
            # Check if value matches any safe values
            safe_values = [v.lower() for v in config['safe_values']]
            if value.lower() not in safe_values:
                return {
                    'description': f"The {header_name} header value may not provide adequate protection",
                    'remediation': f"Set {header_name} to one of: {', '.join(config['safe_values'])}"
                }
        
        if 'pattern' in config:
            # Check if value matches expected pattern
            if not re.search(config['pattern'], value, re.IGNORECASE):
                return {
                    'description': f"The {header_name} header does not match the expected format",
                    'remediation': f"Ensure {header_name} follows the correct format (e.g., max-age=31536000)"
                }
        
        # Special validation for CSP
        if header_name == 'Content-Security-Policy':
            if "'unsafe-inline'" in value or "'unsafe-eval'" in value:
                return {
                    'description': "Content Security Policy contains unsafe directives",
                    'remediation': "Remove 'unsafe-inline' and 'unsafe-eval' from CSP and use nonces or hashes instead"
                }
        
        return None
    
    async def _check_tls_certificate(self, url: str) -> List[Finding]:
        """
        Check TLS certificate security
        
        Read-only certificate inspection.
        """
        findings = []
        
        try:
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            
            hostname = urlparse(url).hostname
            with socket.create_connection((hostname, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    # Check for weak protocols/ciphers
                    if ssock.version() in ['TLSv1', 'TLSv1.1']:
                        findings.append(Finding(
                            title="Weak TLS Configuration",
                            description="Supports weak TLS versions - vulnerable to downgrade attacks",
                            severity="high",
                            confidence="high",
                            url=url,
                            evidence=f"Negotiated {ssock.version()}",
                            remediation="Disable TLSv1/TLSv1.1 and weak ciphers",
                            references=["OWASP TLS Cheat Sheet"],
                            request_info=f"openssl s_client -connect {hostname}:443",
                            proof_id=f"tls-weak-{hostname}"
                        ))
                    
                    # Check certificate expiry
                    cert = ssock.getpeercert()
                    not_after = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
                    if datetime.now() > not_after - timedelta(days=30):
                        findings.append(Finding(
                            title="Expiring TLS Certificate",
                            description="Certificate expires soon",
                            severity="medium",
                            confidence="high",
                            url=url,
                            evidence=f"Expires: {not_after}",
                            remediation="Renew certificate before expiry",
                            proof_id=f"tls-expiry-{hostname}"
                        ))
        except Exception as e:
            logger.debug(f"TLS check error: {e}")
        
        return findings
    
    async def _check_cors_configuration(self, url: str, session) -> List[Finding]:
        """Check CORS configuration"""
        findings = []
        
        try:
            # Preflight request
            preflight_headers = {
                'Origin': 'https://evil.example.com',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
            
            async with session.options(url, headers=preflight_headers) as response:
                cors_headers = response.headers
                
                # Check for wildcard CORS with credentials
                access_control_origin = cors_headers.get('Access-Control-Allow-Origin', '')
                access_control_credentials = cors_headers.get('Access-Control-Allow-Credentials', '').lower()
                
                if access_control_origin == '*' and access_control_credentials == 'true':
                    findings.append(Finding(
                        title="Dangerous CORS Configuration",
                        description="CORS allows any origin (*) with credentials enabled",
                        severity="high",
                        confidence="high",
                        url=url,
                        evidence=f"Access-Control-Allow-Origin: {access_control_origin}, Access-Control-Allow-Credentials: {access_control_credentials}",
                        remediation="Either remove Access-Control-Allow-Credentials or specify explicit allowed origins instead of wildcard",
                        references=[
                            "WSTG-CLNT-07: Test Cross-Origin Resource Sharing",
                            "OWASP CORS Security Cheat Sheet",
                            "PortSwigger CORS vulnerabilities"
                        ],
                        request_info=f"curl -X OPTIONS '{url}' -H 'Origin: https://evil.example.com'",
                        proof_id=f"cors-wildcard-creds-{urlparse(url).hostname}"
                    ))
                
                # Check for overly permissive CORS
                elif access_control_origin == '*':
                    findings.append(Finding(
                        title="Permissive CORS Configuration",
                        description="CORS allows requests from any origin",
                        severity="medium",
                        confidence="high",
                        url=url,
                        evidence=f"Access-Control-Allow-Origin: {access_control_origin}",
                        remediation="Specify explicit allowed origins instead of using wildcard (*)",
                        references=[
                            "WSTG-CLNT-07: Test Cross-Origin Resource Sharing",
                            "OWASP CORS Security Cheat Sheet"
                        ],
                        request_info=f"curl -X OPTIONS '{url}' -H 'Origin: https://evil.example.com'",
                        proof_id=f"cors-wildcard-{urlparse(url).hostname}"
                    ))
        except Exception as e:
            logger.debug(f"CORS check failed for {url}: {e}")
        
        return findings
    
    def _check_cookie_security(self, url: str, headers: dict) -> List[Finding]:
        """
        Check cookie security attributes
        
        Passive cookie attribute inspection.
        """
        findings = []
        
        # Extract all Set-Cookie headers
        set_cookie_headers = []
        for key, value in headers.items():
            if key.lower() == 'set-cookie':
                if isinstance(value, list):
                    set_cookie_headers.extend(value)
                else:
                    set_cookie_headers.append(value)
        
        for cookie_header in set_cookie_headers:
            cookie_name = cookie_header.split('=')[0].strip() if '=' in cookie_header else 'unknown'
            cookie_lower = cookie_header.lower()
            
            # Sanitize evidence
            evidence = cookie_header[:1000] + "..." if len(cookie_header) > 1000 else cookie_header
            
            # Check for missing Secure flag on HTTPS
            if url.startswith('https://') and 'secure' not in cookie_lower:
                findings.append(Finding(
                    title="Cookie Missing Secure Flag",
                    description=f'Cookie "{cookie_name}" transmitted over HTTPS without Secure flag',
                    severity="medium",
                    confidence="high",
                    url=url,
                    evidence=f"Set-Cookie: {evidence}",
                    remediation="Add the Secure flag to cookies transmitted over HTTPS to prevent interception over unencrypted connections",
                    references=[
                        "WSTG-SESS-02: Test for Cookies Attributes",
                        "OWASP Session Management Cheat Sheet"
                    ],
                    request_info=f"curl -I '{url}'",
                    proof_id=f"cookie-secure-{cookie_name}"
                ))
            
            # Check for missing HttpOnly flag
            if 'httponly' not in cookie_lower:
                findings.append(Finding(
                    title="Cookie Missing HttpOnly Flag",
                    description=f'Cookie "{cookie_name}" accessible via JavaScript due to missing HttpOnly flag',
                    severity="medium",
                    confidence="high",
                    url=url,
                    evidence=f"Set-Cookie: {evidence}",
                    remediation="Add the HttpOnly flag to prevent XSS attacks from accessing cookies via JavaScript",
                    references=[
                        "WSTG-SESS-02: Test for Cookies Attributes",
                        "OWASP XSS Prevention Cheat Sheet"
                    ],
                    request_info=f"curl -I '{url}'",
                    proof_id=f"cookie-httponly-{cookie_name}"
                ))
            
            # Check for missing SameSite attribute
            if 'samesite' not in cookie_lower:
                findings.append(Finding(
                    title="Cookie Missing SameSite Attribute",
                    description=f'Cookie "{cookie_name}" lacks SameSite protection against CSRF attacks',
                    severity="low",
                    confidence="high",
                    url=url,
                    evidence=f"Set-Cookie: {evidence}",
                    remediation="Add SameSite=Strict or SameSite=Lax attribute to prevent CSRF attacks",
                    references=[
                        "WSTG-SESS-02: Test for Cookies Attributes",
                        "OWASP Cross-Site Request Forgery Prevention Cheat Sheet"
                    ],
                    request_info=f"curl -I '{url}'",
                    proof_id=f"cookie-samesite-{cookie_name}"
                ))
        
        return findings
    
    def _check_information_disclosure(self, url: str, headers: dict) -> List[Finding]:
        """
        Check for information disclosure in headers
        
        Passive header inspection.
        """
        findings = []
        
        # Headers that may disclose sensitive information
        disclosure_headers = {
            'Server': 'web server software and version',
            'X-Powered-By': 'application framework or technology',
            'X-AspNet-Version': 'ASP.NET framework version',
            'X-AspNetMvc-Version': 'ASP.NET MVC version',
            'X-Generator': 'content management system or generator',
            'X-Drupal-Cache': 'Drupal CMS usage',
            'X-Varnish': 'Varnish cache server usage'
        }
        
        disclosed_info = []
        for header_name, description in disclosure_headers.items():
            if header_name in headers:
                header_value = headers[header_name][:500]  # Limit evidence length
                disclosed_info.append(f"{header_name}: {header_value}")
        
        if disclosed_info:
            findings.append(Finding(
                title="Information Disclosure in HTTP Headers",
                description="Server response headers reveal technology stack information that could aid attackers",
                severity="low",
                confidence="high",
                url=url,
                evidence="; ".join(disclosed_info),
                remediation="Remove or obfuscate server information headers to reduce information disclosure",
                references=[
                    "WSTG-INFO-08: Fingerprint Web Application Framework",
                    "OWASP Information Exposure Prevention"
                ],
                request_info=f"curl -I '{url}'",
                proof_id=f"info-disclosure-{urlparse(url).hostname}"
            ))
        
        return findings