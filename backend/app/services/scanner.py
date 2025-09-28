import httpx

def check_headers(url: str):
    # Add http:// if user forgot
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "http://" + url  

    r = httpx.get(url, timeout=5.0)
    return [{"header": k, "value": v} for k, v in r.headers.items()]

def run_all_checks(url: str):
    findings = []
    findings.extend(check_headers(url))
    # TODO: Add XSS, SQLi, CSRF checks...
    return findings
