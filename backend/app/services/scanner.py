# app/services/scanner.py
# Public wrapper used by the rest of your app (keeps old import path)

from .scanner_engine.runner import run_all_checks as _run_all_checks
from .scanner_engine.utils import normalize_url

def run_all_checks(url: str):
    """
    Public entrypoint used by your API:
        from app.services import scanner
        scanner.run_all_checks(url)
    The function normalizes the URL and calls the engine runner.
    """
    url = normalize_url(url)
    return _run_all_checks(url)
