# app/services/scanner_engine/checks/open_redirect.py
import httpx
from urllib.parse import urlparse

def check_open_redirect(url: str):
    try:
        evil = "https://evil.example.com"
        r = httpx.get(url, params={"next": evil}, timeout=7.0, allow_redirects=False)
        loc = r.headers.get("location", "") or ""
        # if location header points to the 'evil' domain - redirection present
        parsed = urlparse(loc)
        is_redirect = parsed.netloc and "evil.example.com" in parsed.netloc
        return {"type": "OpenRedirect", "status": "vulnerable" if is_redirect else "safe", "severity": "Medium" if is_redirect else "Info", "target": url}
    except Exception as e:
        return {"type": "OpenRedirect", "status": "error", "severity": "Info", "error": str(e), "target": url}
