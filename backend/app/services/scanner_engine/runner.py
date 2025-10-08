from .checks.headers import check_headers
from .checks.xss import check_xss
from .checks.sqli import check_sqli
from .checks.csrf import check_csrf
from .checks.idor import check_idor
from .checks.ssrf import check_ssrf
from .checks.open_redirect import check_open_redirect

# If your editor flags "ssr f" typo above, use this correct import instead:
# from .checks.ssrf import check_ssrf

CHECKS = [
    check_headers,
    check_xss,
    check_sqli,
    check_csrf,
    check_idor,
    check_ssrf,
    check_open_redirect,
]

def run_all_checks(url: str) -> list:
    findings = []
    for check in CHECKS:
        try:
            result = check(url)
            if isinstance(result, list):
                findings.extend(result)
            elif isinstance(result, dict):
                findings.append(result)
            else:
                findings.append({"type": "Unknown", "detail": str(result)})
        except Exception as e:
            findings.append({"type": "CheckError", "check": check.__name__, "error": str(e)})
    return findings
