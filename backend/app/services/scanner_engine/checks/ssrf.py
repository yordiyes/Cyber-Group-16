# app/services/scanner_engine/checks/ssrf.py
import httpx

def check_ssrf(url: str):
    """
    Non-destructive SSRF heuristic — send a param pointing to a localhost address and look for signs of SSRF.
    NOTE: Be conservative and safe — do NOT attempt to access sensitive IPs in production.
    """
    try:
        payload = "http://127.0.0.1/"
        r = httpx.get(url, params={"url": payload}, timeout=7.0, follow_redirects=True)
        body = r.text.lower()
        indicators = ["connection refused", "could not connect", "127.0.0.1"]
        likely = any(i in body for i in indicators)
        return {"type": "SSRF", "status": "possible" if likely else "safe", "target": url}
    except Exception as e:
        return {"type": "SSRF", "status": "error", "error": str(e), "target": url}
