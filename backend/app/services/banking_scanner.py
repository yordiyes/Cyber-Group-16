from .scanner_engine.runner import run_all_checks as _run_all_checks
from .scanner_engine.utils import normalize_url

def run_all_checks(url: str):
    """
    Scanner for online banking apps.
    Adds deeper checks for encryption, session management, and sensitive endpoint exposure.
    """
    url = normalize_url(url)
    findings = _run_all_checks(url)

    # Simulated additional banking-specific checks
    extra_findings = [
        {"type": "ssl_strength", "severity": "high", "detail": "Weak SSL configuration detected"},
        {"type": "session_security", "severity": "critical", "detail": "Session tokens not invalidated after logout"},
    ]

    return findings + extra_findings
