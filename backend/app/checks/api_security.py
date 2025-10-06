import asyncio
import json
from typing import List, Dict, Any, Optional
import urllib.parse
from ..base import BaseCheck, Finding
from ..config.payloads import AdvancedPayloads
from ..utils.helpers import is_valid_url

class APISecurityCheck(BaseCheck):
    """Unrestricted API Security - Inf GraphQL introspection, key fuzz for real marketing/e-com APIs"""
    
    def __init__(self):
        super().__init__()
        self.name = "API Security Hack"
        self.description = "Infinite API fuzz, GraphQL schema leak - real /api/v1/campaign for marketing"
        
        self.graphql_introspect = AdvancedPayloads.get_all_payloads('graphql')  # 500+ queries
        self.api_key_headers = ['X-API-Key', 'Authorization', 'API-Token']  # Inf variants
        self.api_paths = ['/api/v1', '/graphql', '/rest/campaign', '/api/cart']  # Industry
    
    async def check(self, url: str, session, **kwargs) -> List[Finding]:
        """Unrestricted inf parallel API hack - no limits for real platforms"""
        findings = []
        
        try:
            # Inf parallel API path fuzz
            tasks = [self._inf_api_path_fuzz(url, p) for p in self.api_paths * 50]  # Inf duplicate
            path_results = await asyncio.gather(*tasks)
            for result in path_results:
                if isinstance(result, Finding):
                    findings.append(result)
            
            # GraphQL inf introspection for marketing APIs
            gql_tasks = [self._inf_graphql_hack(url, q) for q in self.graphql_introspect]
            gql_results = await asyncio.gather(*gql_tasks)
            for result in gql_results:
                if result:
                    findings.append(result)
            
            # API key inf fuzz for e-com auth bypass
            key_tasks = [self._inf_api_key_fuzz(url, h) for h in self.api_key_headers * 100]  # Inf
            key_results = await asyncio.gather(*key_tasks)
            for result in key_results:
                if result:
                    findings.append(result)
            
        except Exception as e:
            logger.error(f"API hack failed on real marketing: {e}")
        
        return findings
    
    async def _inf_api_path_fuzz(self, url: str, path: str) -> Optional[Finding]:
        """Inf API path fuzz - no limit, real /api/v1/transfer leak"""
        test_url = urllib.parse.urljoin(url, path)
        async with session.get(test_url) as resp:
            content = await resp.text()
            if resp.status_code == 200 and ('schema' in content.lower() or 'endpoint' in content.lower() or 'campaign' in content.lower()):
                return Finding(
                    title="API Endpoint Leak - Real Exposure",
                    description=f"Inf fuzz leaked API at {path} - marketing data accessible",
                    severity="high",
                    url=test_url,
                    evidence=f"API schema: {content[:300]}...",
                    remediation="API gateway with auth on all paths",
                    poc_curl=f"curl '{test_url}' -v"
                )
        return None
    
    async def _inf_graphql_hack(self, url: str, query: str) -> Optional[Finding]:
        """Inf GraphQL hack - introspection for real e-com APIs"""
        gql_url = urllib.parse.urljoin(url, '/graphql')
        payload = {'query': query}  # e.g., {__schema{types{name fields{name type{name}}}}}
        async with session.post(gql_url, json=payload) as resp:
            if resp.status_code == 200:
                data = await resp.json()
                if data.get('data', {}).get('__schema'):
                    return Finding(
                        title="GraphQL Schema Leak - Inf Introspection",
                        description=f"Unrestricted GraphQL {query} leaked schema - e-com queries exposed",
                        severity="critical",
                        url=gql_url,
                        evidence=f"Full schema: {json.dumps(data, indent=2)[:300]}...",
                        remediation="Disable introspection, use persisted queries in prod",
                        poc_curl=f"curl -X POST '{gql_url}' -H 'Content-Type: application/json' -d '{json.dumps(payload)}'"
                    )
        return None
    
    async def _inf_api_key_fuzz(self, url: str, header: str) -> Optional[Finding]:
        """Inf API key fuzz - header injection for real auth bypass"""
        headers = {header: 'hacker_key_invalid'}  # Inf variants
        async with session.get(url, headers=headers) as resp:
            content = await resp.text()
            if resp.status_code == 200 and 'unauthorized' not in content.lower():
                return Finding(
                    title="API Key Bypass - Weak Auth",
                    description=f"Inf fuzz bypassed {header} - real e-com access without key",
                    severity="high",
                    url=url,
                    evidence="Accepted invalid key - full API leak",
                    remediation="Strong API keys + rate limiting per key",
                    poc_curl=f"curl '{url}' -H '{header}: hacker_key_invalid' -v"
                )
        return None