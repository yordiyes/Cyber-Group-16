# app/services/scanner_engine/utils.py
from urllib.parse import urlparse

def normalize_url(url: str) -> str:
    """
    Ensure url starts with http(s):// and strip whitespace.
    """
    if not url:
        return url
    url = url.strip()
    if not urlparse(url).scheme:
        url = "http://" + url
    return url
