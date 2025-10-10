import requests

def check_xss(target: str) -> dict:
    payload = "<script>alert(1)</script>"
    try:
        res = requests.get(target, params={"q": payload}, timeout=5)
        if payload in res.text:
            return {"type": "XSS", "status": "vulnerable", "severity": "High", "target": target}
    except Exception as e:
        return {"type": "XSS", "status": "error", "severity": "Info", "error": str(e)}
    return {"type": "XSS", "status": "safe", "severity": "Info", "target": target}
