# app/services/scanner_engine/checks/idor.py
import httpx

def check_idor(url: str):
    """
    Simple, safe IDOR heuristic: compare responses for two different ID values.
    (Only uses GET and non-destructive)
    """
    try:
        base = url.rstrip("/")
        r1 = httpx.get(base, params={"user_id": "1"}, timeout=7.0, follow_redirects=True)
        r2 = httpx.get(base, params={"user_id": "2"}, timeout=7.0, follow_redirects=True)
        vulnerable = r1.text != r2.text and (r1.status_code == 200 and r2.status_code == 200)
        return {"type": "IDOR", "status": "vulnerable" if vulnerable else "safe", "severity": "High" if vulnerable else "Info", "target": url}
    except Exception as e:
        return {"type": "IDOR", "status": "error", "severity": "Info", "error": str(e), "target": url}
