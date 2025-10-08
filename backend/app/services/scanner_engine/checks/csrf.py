# app/services/scanner_engine/checks/csrf.py
import httpx

def check_csrf(url: str):
    """
    Passive check looking for CSRF token fields in forms.
    """
    try:
        r = httpx.get(url, timeout=7.0, follow_redirects=True)
        text = r.text.lower()
        tokens = ["csrf", "csrf_token", "authenticity_token", "xsrf"]
        found = any(t in text for t in tokens)
        return {"type": "CSRF", "status": "token-present" if found else "token-missing", "target": url}
    except Exception as e:
        return {"type": "CSRF", "status": "error", "error": str(e), "target": url}
