import requests

def check_xss(target: str) -> dict:
    payload = "<script>alert(1)</script>"
    try:
        res = requests.get(target, params={"q": payload}, timeout=5)
        if payload in res.text:
            return {"type": "XSS", "status": "vulnerable", "target": target}
    except Exception as e:
        return {"type": "XSS", "status": "error", "error": str(e)}
    return {"type": "XSS", "status": "safe", "target": target}
