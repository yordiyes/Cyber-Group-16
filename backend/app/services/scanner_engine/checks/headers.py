# app/services/scanner_engine/checks/headers.py
import httpx

def check_headers(url: str):
    """
    Returns a list of findings: each finding is a dict.
    Non-destructive, passive header inspection.
    """
    try:
        r = httpx.get(url, timeout=7.0, follow_redirects=True)
    except Exception as e:
        return [{"type": "Headers", "status": "error", "error": str(e), "target": url}]

    findings = []
    # Report each header as an observation
    for k, v in r.headers.items():
        findings.append({"type": "Header", "header": k, "value": v, "target": url})

    # Check some important security headers
    required = {
        "Content-Security-Policy": "Low",
        "Strict-Transport-Security": "High",
        "X-Frame-Options": "Medium",
        "X-Content-Type-Options": "Medium",
        "Referrer-Policy": "Low",
    }
    missing = [h for h in required if h not in r.headers]
    if missing:
        findings.append({"type": "Headers", "status": "missing-security-headers", "missing": missing, "severity": "Medium", "target": url})
    else:
        findings.append({"type": "Headers", "status": "ok", "target": url})

    return findings
