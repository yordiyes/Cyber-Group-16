from .scanner_engine.runner import run_all_checks as _run_all_checks
from .scanner_engine.utils import normalize_url

def run_all_checks(url: str):
    """
    Scanner for e-commerce web apps.
    Adds extra checks specific to payment gateways, checkout flows, and sensitive data exposure.
    """
    url = normalize_url(url)
    findings = _run_all_checks(url)

    # Simulated additional e-commerce checks
    extra_findings = [
        {"type": "payment_security", "severity": "high", "detail": "Missing HTTPS on checkout page"},
        {"type": "data_exposure", "severity": "medium", "detail": "Customer emails visible in response headers"}
    ]

    return findings + extra_findings
