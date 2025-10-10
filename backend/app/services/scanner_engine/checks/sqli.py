# app/services/scanner_engine/checks/sqli.py
import httpx

def check_sqli(url: str):
    """
    Non-destructive heuristic for SQLi: inject a benign payload and look for SQL errors.
    """
    try:
        payload = "' OR '1'='1"
        params = {"id": payload}
        r = httpx.get(url, params=params, timeout=7.0, follow_redirects=True)
        body = r.text.lower()
        heuristics = ["sql syntax", "mysql", "syntax error", "sqlstate", "pgsql"]
        likely = any(h in body for h in heuristics)
        return {"type": "SQLi", "status": "vulnerable" if likely else "safe", "severity": "High" if likely else "Info", "target": url}
    except Exception as e:
        return {"type": "SQLi", "status": "error", "severity": "Info", "error": str(e), "target": url}
