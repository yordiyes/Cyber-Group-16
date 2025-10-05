"""
IDOR Detection

Enumeration of resource IDs for GET endpoints only.
Rate limits and stops enumeration upon finding unauthorized access.
"""

import asyncio
import logging
import hashlib
import time
from typing import List, Dict, Any, Optional, Set
import re
import urllib.parse
from ..base import BaseCheck, Finding
from ..utils import extract_parameters

logger = logging.getLogger(__name__)

class IDORCheck(BaseCheck):
    """Insecure Direct Object Reference (IDOR) vulnerability checker"""
    
    def __init__(self):
        super().__init__()
        self.name = "IDOR Detection"
        self.description = "Enumeration for IDOR vulnerabilities with rate limits"
        
        # Rate limiting: Maximum requests per target
        self.max_requests_per_target = 5
        self.request_delay = 1.0  # 1 second between requests
        
        # Common parameter names that might contain object references
        self.object_ref_patterns = [
            r'^id$',
            r'^user_?id$',
            r'^account_?id$', 
            r'^profile_?id$',
            r'^doc_?id$',
            r'^file_?id$',
            r'^order_?id$',
            r'^invoice_?id$',
            r'^ticket_?id$',
            r'^message_?id$',
            r'^post_?id$',
            r'^comment_?id$',
            r'^uid$',
            r'^pid$',
            r'^oid$',
            r'^key$',
            r'^ref$',
            r'^reference$'
        ]
        
        # Track requests per target to enforce rate limits
        self.request_counts: Dict[str, int] = {}
        self.last_request_time: Dict[str, float] = {}
    
    async def check(self, url: str, session, **kwargs) -> List[Finding]:
        """
        IDOR detection with rate limiting
        
        Tests GET endpoints (read-only operations).
        Stops enumeration immediately upon finding unauthorized access.
        """
        findings = []
        
        # Initialize rate limiting for this target
        target_key = urllib.parse.urlparse(url).netloc
        self.request_counts[target_key] = 0
        self.last_request_time[target_key] = 0
        
        try:
            # Get the original page (this counts as first request)
            if not await self._can_make_request(target_key):
                logger.warning(f"Rate limit exceeded for {target_key}")
                return findings
            
            response = await session.get(url, follow_redirects=True)
            if response.status_code != 200:
                return findings
                
            original_content = response.text
            
            # Only test URL parameters for IDOR (GET requests only)
            param_findings = await self._test_url_parameters_safe(session, url, original_content, target_key)
            findings.extend(param_findings)
            
            # Only test path parameters if we haven't hit rate limits
            if self.request_counts[target_key] < self.max_requests_per_target:
                path_findings = await self._test_path_parameters_safe(session, url, original_content, target_key)
                findings.extend(path_findings)
                
        except Exception as e:
            logger.error(f"IDOR check failed for {url}: {e}")
        
        return findings
    
    async def _can_make_request(self, target_key: str) -> bool:
        """Check if we can make another request within rate limits"""
        current_time = time.time()
        
        # Check if we've exceeded max requests
        if self.request_counts.get(target_key, 0) >= self.max_requests_per_target:
            return False
        
        # Check if enough time has passed since last request
        last_time = self.last_request_time.get(target_key, 0)
        if current_time - last_time < self.request_delay:
            await asyncio.sleep(self.request_delay - (current_time - last_time))
        
        # Update counters
        self.request_counts[target_key] = self.request_counts.get(target_key, 0) + 1
        self.last_request_time[target_key] = time.time()
        
        return True
    
    async def _test_url_parameters_safe(self, session, url: str, original_content: str, target_key: str) -> List[Finding]:
        """
        Test URL parameters for IDOR vulnerabilities with safety controls
        
        GET requests only with rate limiting.
        """
        findings = []
        parsed_url = urllib.parse.urlparse(url)
        
        if not parsed_url.query:
            return findings
        
        # Extract parameters
        params = dict(urllib.parse.parse_qsl(parsed_url.query))
        
        for param_name, param_value in params.items():
            # Check if parameter name suggests it's an object reference
            if self._is_object_reference_param(param_name):
                # Check if parameter value looks like an ID
                if self._is_potential_id(param_value):
                    # Test this parameter with rate limiting
                    idor_finding = await self._test_parameter_idor_safe(
                        session, url, param_name, param_value, original_content, target_key
                    )
                    if idor_finding:
                        findings.append(idor_finding)
                        # Stop enumeration immediately upon finding IDOR
                        logger.info(f"IDOR found for {param_name}, stopping enumeration")
                        break
                    
                    # Check rate limits after each test
                    if self.request_counts[target_key] >= self.max_requests_per_target:
                        logger.info(f"Rate limit reached for {target_key}, stopping IDOR enumeration")
                        break
        
        return findings
    
    async def _test_path_parameters_safe(self, session, url: str, original_content: str, target_key: str) -> List[Finding]:
        """
        Test path segments for IDOR vulnerabilities with safety controls
        
        GET requests only with rate limiting.
        """
        findings = []
        
        parsed_url = urllib.parse.urlparse(url)
        path_segments = [seg for seg in parsed_url.path.split('/') if seg]
        
        for i, segment in enumerate(path_segments):
            if self._is_potential_id(segment):
                # Test by modifying this path segment with rate limiting
                idor_finding = await self._test_path_segment_idor_safe(
                    session, url, i, segment, original_content, target_key
                )
                if idor_finding:
                    findings.append(idor_finding)
                    # Stop enumeration immediately upon finding IDOR
                    logger.info(f"IDOR found in path segment {segment}, stopping enumeration")
                    break
                
                # Check rate limits after each test
                if self.request_counts[target_key] >= self.max_requests_per_target:
                    logger.info(f"Rate limit reached for {target_key}, stopping path IDOR enumeration")
                    break
        
        return findings
    
    def _is_object_reference_param(self, param_name: str) -> bool:
        """Check if parameter name suggests object reference"""
        param_lower = param_name.lower()
        return any(re.match(pattern, param_lower, re.IGNORECASE) for pattern in self.object_ref_patterns)
    
    def _is_potential_id(self, value: str) -> bool:
        """Check if value looks like an ID"""
        return value.isdigit() or re.match(r'^[0-9a-f-]{8,36}$', value, re.IGNORECASE)
    
    async def _test_parameter_idor_safe(self, session, url: str, param_name: str, param_value: str,
                                      original_content: str, target_key: str) -> Optional[Finding]:
        """Test a parameter for IDOR vulnerability"""
        if not await self._can_make_request(target_key):
            return None
        
        try:
            test_values = self._generate_test_values(param_value)
            
            for test_value in test_values:
                # Create modified parameters
                params = extract_parameters(url)
                params[param_name] = test_value
                
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
                
                # Test the modified URL
                async with session.get(test_url) as response:
                    test_content = await response.text()
                    
                    # Check if we get different but valid content
                    if response.status_code == 200 and test_content != original_content:
                        if self._analyze_idor_response(original_content, test_content):
                            return Finding(
                                title='Insecure Direct Object Reference',
                                description=f'IDOR vulnerability detected in parameter "{param_name}"',
                                severity='high',
                                confidence='medium',
                                url=test_url,
                                evidence=f'Different content returned when changing {param_name} from {param_value} to {test_value}',
                                remediation='Implement proper access controls and validate user permissions for each resource',
                                references=self._get_owasp_references()
                            )
        except Exception as e:
            logger.debug(f"Error testing IDOR for parameter {param_name}: {e}")
        
        return None
    
    async def _test_path_segment_idor_safe(self, session, url: str, segment_index: int, segment_value: str,
                                         original_content: str, target_key: str) -> Optional[Finding]:
        """Test a path segment for IDOR vulnerability"""
        if not await self._can_make_request(target_key):
            return None
        
        try:
            test_values = self._generate_test_values(segment_value)
            
            for test_value in test_values:
                # Create modified URL by replacing path segment
                parsed_url = urllib.parse.urlparse(url)
                path_segments = [seg for seg in parsed_url.path.split('/') if seg]
                
                if segment_index < len(path_segments):
                    path_segments[segment_index] = test_value
                    new_path = '/' + '/'.join(path_segments)
                    
                    test_url = urllib.parse.urlunparse((
                        parsed_url.scheme,
                        parsed_url.netloc,
                        new_path,
                        parsed_url.params,
                        parsed_url.query,
                        parsed_url.fragment
                    ))
                    
                    # Test the modified URL
                    async with session.get(test_url) as response:
                        test_content = await response.text()
                        
                        # Check if we get different but valid content
                        if response.status_code == 200 and test_content != original_content:
                            if self._analyze_idor_response(original_content, test_content):
                                return Finding(
                                    title='IDOR in URL Path',
                                    description=f'IDOR vulnerability detected in URL path segment',
                                    severity='high',
                                    confidence='medium',
                                    url=test_url,
                                    evidence=f'Different content returned when changing path segment from {segment_value} to {test_value}',
                                    remediation='Implement proper authorization checks for path-based object access',
                                    references=self._get_owasp_references()
                                )
        except Exception as e:
            logger.debug(f"Error testing IDOR for path segment {segment_value}: {e}")
        
        return None
    
    def _generate_test_values(self, original_value: str) -> List[str]:
        """Generate test values for IDOR testing"""
        test_values = []
        
        if original_value.isdigit():
            # For numeric IDs, try adjacent values and common test values
            num_val = int(original_value)
            test_values.extend([
                str(num_val + 1),
                str(num_val - 1),
                str(num_val + 10),
                str(max(1, num_val - 10)),
                '1',
                '2',
                '100',
                '999',
                '0'
            ])
        elif re.match(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', original_value, re.IGNORECASE):
            # For UUIDs, try common test UUIDs
            test_values.extend([
                '00000000-0000-0000-0000-000000000000',
                '11111111-1111-1111-1111-111111111111',
                'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
                '12345678-1234-1234-1234-123456789012'
            ])
        else:
            # For alphanumeric IDs, try variations
            if len(original_value) > 1:
                # Try incrementing last character if it's a digit
                if original_value[-1].isdigit():
                    last_digit = int(original_value[-1])
                    if last_digit < 9:
                        test_values.append(original_value[:-1] + str(last_digit + 1))
                    if last_digit > 0:
                        test_values.append(original_value[:-1] + str(last_digit - 1))
                
                # Try common variations
                test_values.extend([
                    'admin',
                    'test',
                    'user1',
                    'user2',
                    '1',
                    '2'
                ])
        
        # Remove duplicates and original value
        test_values = list(set(test_values))
        if original_value in test_values:
            test_values.remove(original_value)
        
        return test_values[:5]  # Limit to prevent excessive requests
    
    def _analyze_idor_response(self, original_content: str, test_content: str) -> bool:
        """Analyze if the response indicates a potential IDOR vulnerability"""
        # Check content length difference (significant change suggests different data)
        length_diff = abs(len(test_content) - len(original_content))
        if length_diff < 50:  # Too similar, might not be IDOR
            return False
        
        # Look for indicators that suggest we're accessing different user/object data
        idor_indicators = [
            r'user.*?:.*?\w+',  # User information patterns
            r'name.*?:.*?\w+',
            r'email.*?:.*?\w+',
            r'profile.*?:.*?\w+',
            r'account.*?:.*?\w+',
            r'id.*?:.*?\d+',
            r'"id"\s*:\s*\d+',  # JSON ID patterns
            r'"user"\s*:\s*"[^"]+',
            r'"name"\s*:\s*"[^"]+',
            r'"email"\s*:\s*"[^"]+'
        ]
        
        original_matches = set()
        test_matches = set()
        
        for pattern in idor_indicators:
            original_matches.update(re.findall(pattern, original_content, re.IGNORECASE))
            test_matches.update(re.findall(pattern, test_content, re.IGNORECASE))
        
        # If we find different user/object identifiers, it's likely IDOR
        if original_matches and test_matches and original_matches != test_matches:
            return True
        
        # Check for different titles or headings (might indicate different objects)
        title_patterns = [r'<title>(.*?)</title>', r'<h1[^>]*>(.*?)</h1>', r'<h2[^>]*>(.*?)</h2>']
        
        for pattern in title_patterns:
            original_titles = re.findall(pattern, original_content, re.IGNORECASE | re.DOTALL)
            test_titles = re.findall(pattern, test_content, re.IGNORECASE | re.DOTALL)
            
            if original_titles and test_titles and original_titles != test_titles:
                return True
        
        return False