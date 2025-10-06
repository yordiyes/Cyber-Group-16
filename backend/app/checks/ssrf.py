import asyncio
import logging
from typing import List, Dict, Any, Optional
import urllib.parse
from ..utils import extract_forms, extract_parameters, generate_payloads, calculate_severity

logger = logging.getLogger(__name__)

class SSRFCheck:
    """Server-Side Request Forgery (SSRF) vulnerability checker"""
    
    def __init__(self):
        self.description = "Detects Server-Side Request Forgery vulnerabilities"
        self.default_severity = "high"
        self.payloads = generate_payloads('ssrf')
        
        # Common parameter names that might be vulnerable to SSRF
        self.url_param_patterns = [
            'url', 'uri', 'link', 'src', 'source', 'target', 'destination', 'redirect',
            'callback', 'webhook', 'endpoint', 'api', 'feed', 'rss', 'xml', 'json',
            'file', 'path', 'location', 'site', 'domain', 'host', 'server'
        ]
    
    async def check(self, session, url: str) -> List[Dict[str, Any]]:
        """Check for SSRF vulnerabilities"""
        findings = []
        
        try:
            # Get the original page
            async with session.get(url) as response:
                if response.status != 200:
                    return findings
                
                original_content = await response.text()
            
            # Test URL parameters
            param_findings = await self._test_url_parameters(session, url, original_content)
            findings.extend(param_findings)
            
            # Test forms
            form_findings = await self._test_forms(session, url, original_content)
            findings.extend(form_findings)
                
        except Exception as e:
            logger.error(f"SSRF check failed for {url}: {e}")
        
        return findings
    
    async def _test_url_parameters(self, session, url: str, original_content: str) -> List[Dict[str, Any]]:
        """Test URL parameters for SSRF vulnerabilities"""
        findings = []
        params = extract_parameters(url)
        
        if not params:
            return findings
        
        for param_name, param_value in params.items():
            # Check if parameter name suggests it might accept URLs
            if self._is_url_parameter(param_name):
                ssrf_finding = await self._test_parameter_ssrf(session, url, param_name, param_value, original_content)
                if ssrf_finding:
                    findings.append(ssrf_finding)
        
        return findings
    
    async def _test_forms(self, session, url: str, original_content: str) -> List[Dict[str, Any]]:
        """Test form inputs for SSRF vulnerabilities"""
        findings = []
        forms = extract_forms(original_content, url)
        
        for form in forms:
            if not form['inputs']:
                continue
            
            for input_field in form['inputs']:
                if input_field['type'] in ['submit', 'button', 'hidden']:
                    continue
                
                # Check if input field name suggests it might accept URLs
                if self._is_url_parameter(input_field['name']):
                    ssrf_finding = await self._test_form_field_ssrf(session, form, input_field, original_content)
                    if ssrf_finding:
                        findings.append(ssrf_finding)
        
        return findings
    
    def _is_url_parameter(self, param_name: str) -> bool:
        """Check if parameter name suggests it might accept URLs"""
        if not param_name:
            return False
        
        param_lower = param_name.lower()
        return any(pattern in param_lower for pattern in self.url_param_patterns)
    
    async def _test_parameter_ssrf(self, session, url: str, param_name: str, param_value: str, original_content: str) -> Optional[Dict[str, Any]]:
        """Test a specific parameter for SSRF vulnerability"""
        try:
            for payload in self.payloads[:5]:  # Limit payloads to prevent excessive requests
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
                
                # Test the payload
                ssrf_result = await self._check_ssrf_response(session, test_url, payload, original_content)
                if ssrf_result:
                    return {
                        'type': 'ssrf',
                        'severity': calculate_severity('ssrf'),
                        'title': 'Server-Side Request Forgery',
                        'description': f'SSRF vulnerability detected in parameter "{param_name}"',
                        'url': test_url,
                        'parameter': param_name,
                        'payload': payload,
                        'evidence': ssrf_result['evidence'],
                        'recommendation': 'Implement URL validation and whitelist allowed domains/protocols'
                    }
        
        except Exception as e:
            logger.debug(f"Error testing SSRF for parameter {param_name}: {e}")
        
        return None
    
    async def _test_form_field_ssrf(self, session, form: Dict[str, Any], input_field: Dict[str, Any], original_content: str) -> Optional[Dict[str, Any]]:
        """Test a form field for SSRF vulnerability"""
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
                
                # Send form request
                if form['method'].lower() == 'post':
                    async with session.post(form['action'], data=form_data) as response:
                        content = await response.text()
                        response_headers = response.headers
                else:
                    async with session.get(form['action'], params=form_data) as response:
                        content = await response.text()
                        response_headers = response.headers
                
                # Check for SSRF indicators
                ssrf_result = await self._analyze_ssrf_response(content, response_headers, payload, original_content)
                if ssrf_result:
                    return {
                        'type': 'ssrf',
                        'severity': calculate_severity('ssrf'),
                        'title': 'SSRF in Form Field',
                        'description': f'SSRF vulnerability detected in form field "{input_field["name"]}"',
                        'url': form['action'],
                        'form_method': form['method'],
                        'parameter': input_field['name'],
                        'payload': payload,
                        'evidence': ssrf_result['evidence'],
                        'recommendation': 'Implement URL validation and restrict outbound requests'
                    }
        
        except Exception as e:
            logger.debug(f"Error testing SSRF for form field {input_field['name']}: {e}")
        
        return None
    
    async def _check_ssrf_response(self, session, test_url: str, payload: str, original_content: str) -> Optional[Dict[str, str]]:
        """Check response for SSRF indicators"""
        try:
            import time
            start_time = time.time()
            
            async with session.get(test_url) as response:
                content = await response.text()
                response_time = time.time() - start_time
                headers = response.headers
            
            return await self._analyze_ssrf_response(content, headers, payload, original_content, response_time)
        
        except Exception as e:
            logger.debug(f"Error checking SSRF response: {e}")
            return None
    
    async def _analyze_ssrf_response(self, content: str, headers: Dict[str, str], payload: str, 
                                   original_content: str, response_time: float = 0) -> Optional[Dict[str, str]]:
        """Analyze response for SSRF vulnerability indicators"""
        
        # Check for internal service responses
        internal_indicators = [
            'metadata.google.internal',
            '169.254.169.254',
            'localhost',
            '127.0.0.1',
            'internal server',
            'connection refused',
            'connection timeout',
            'no route to host',
            'network unreachable'
        ]
        
        content_lower = content.lower()
        for indicator in internal_indicators:
            if indicator in content_lower:
                return {
                    'evidence': f'Response contains internal service indicator: "{indicator}"'
                }
        
        # Check for cloud metadata service responses
        cloud_metadata_indicators = [
            'ami-id',
            'instance-id',
            'security-groups',
            'iam/security-credentials',
            'compute/v1/instance',
            'metadata/instance'
        ]
        
        for indicator in cloud_metadata_indicators:
            if indicator in content_lower:
                return {
                    'evidence': f'Response contains cloud metadata: "{indicator}"'
                }
        
        # Check for file system access (file:// protocol)
        if payload.startswith('file://'):
            file_indicators = [
                'root:x:0:0',  # /etc/passwd content
                'kernel',      # /proc/version content
                '[boot loader]', # Windows boot.ini
                'version_info'
            ]
            
            for indicator in file_indicators:
                if indicator in content_lower:
                    return {
                        'evidence': f'File system access detected: "{indicator}" found in response'
                    }
        
        # Check for protocol-specific responses
        if payload.startswith('gopher://') or payload.startswith('dict://'):
            # These protocols might cause different response patterns
            if len(content) != len(original_content):
                length_diff = abs(len(content) - len(original_content))
                if length_diff > 100:  # Significant difference
                    return {
                        'evidence': f'Protocol-specific payload caused significant response change ({length_diff} bytes difference)'
                    }
        
        # Check for timing-based SSRF (slow internal requests)
        if response_time > 5:  # Unusually slow response
            return {
                'evidence': f'Slow response time ({response_time:.2f}s) suggests internal network request'
            }
        
        # Check for error messages that might indicate SSRF
        ssrf_error_patterns = [
            'failed to connect',
            'connection error',
            'timeout',
            'unreachable',
            'invalid url',
            'malformed url',
            'protocol not supported',
            'curl error',
            'http error'
        ]
        
        for pattern in ssrf_error_patterns:
            if pattern in content_lower and pattern not in original_content.lower():
                return {
                    'evidence': f'SSRF-related error message: "{pattern}"'
                }
        
        return None