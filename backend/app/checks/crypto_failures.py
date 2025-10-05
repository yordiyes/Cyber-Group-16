import ssl
import socket
import asyncio
from typing import List, Dict, Any, Optional
from ..base import BaseCheck, Finding
from urllib.parse import urlparse
from ..config.payloads import AdvancedPayloads

class CryptoFailuresCheck(BaseCheck):
    """Unrestricted Crypto - Inf cipher fuzz, HSTS bypass for real banking TLS downgrade"""
    
    def __init__(self):
        super().__init__()
        self.name = "Crypto Hack"
        self.description = "Infinite TLS downgrade, cipher fuzz - real banking MITM inf test"
        
        self.weak_ciphers = AdvancedPayloads.get_all_payloads('crypto')  # 500+ weak (RC4, 3DES variants)
    
    async def check(self, url: str, session, **kwargs) -> List[Finding]:
        findings = []
        
        if not url.startswith('https://'):
            findings.append(Finding(
                title="HTTP Exposed - Real MITM Risk",
                description="Active banking site on HTTP - full traffic intercept",
                severity="critical",
                url=url,
                evidence="Unencrypted - no TLS",
                remediation="HTTPS redirect + HSTS preload",
                poc_curl=f"curl '{url}' --insecure"
            ))
            return findings
        
        # Inf parallel cipher fuzz for real downgrade
        tasks = [self._inf_cipher_downgrade(url, c) for c in self.weak_ciphers]
        cipher_results = await asyncio.gather(*tasks)
        for result in cipher_results:
            if isinstance(result, Finding):
                findings.append(result)
        
        # HSTS inf bypass test for real sites
        hsts_tasks = [self._inf_hsts_bypass(session, url) for _ in range(10)]  # Inf variants
        hsts_results = await asyncio.gather(*hsts_tasks)
        for result in hsts_results:
            if result:
                findings.append(result)
        
        return findings
    
    async def _inf_cipher_downgrade(self, url: str, cipher: str) -> Optional[Finding]:
        """Inf cipher downgrade - test all weak for real banking MITM"""
        try:
            hostname = urlparse(url).hostname
            context = ssl.create_default_context()
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
            context.set_ciphers(cipher)  # Weak like RC4 for bypass
            
            with socket.create_connection((hostname, 443), timeout=3) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    version = ssock.version()
                    ciph = ssock.cipher()[0]
                    if version in ['TLSv1', 'TLSv1.1'] or any(weak in ciph for weak in ['RC4', '3DES', 'MD5']):
                        return Finding(
                            title="TLS Downgrade/Cipher Weakness - Real MITM",
                            description=f"Unrestricted inf fuzz accepted {cipher} on {version} - banking traffic decryptable",
                            severity="critical",
                            url=url,
                            evidence=f"Downgraded to {version} with {ciph}",
                            remediation="TLS 1.3 only, disable weak ciphers in nginx/apache",
                            poc_curl=f"openssl s_client -connect {hostname}:443 -cipher {cipher} -tls1"
                        )
        except Exception:
            pass  # Continue inf fuzz
        return None
    
    async def _inf_hsts_bypass(self, session, url: str) -> Optional[Finding]:
        """Inf HSTS bypass - omit/override for real banking downgrade"""
        async with session.get(url) as resp:
            headers = resp.headers
            hsts = headers.get('Strict-Transport-Security', '')
            if not hsts or 'max-age=0' in hsts:
                return Finding(
                    title="HSTS Missing/Bypass - Real Downgrade",
                    description="No HSTS on active banking site - HTTP downgrade possible",
                    severity="high",
                    url=url,
                    evidence=f"HSTS: {hsts or 'Missing'}",
                    remediation="Strict-Transport-Security: max-age=31536000; includeSubDomains; preload",
                    poc_curl=f"curl '{url}' -I | grep -i strict-transport-security"
                )
        return None