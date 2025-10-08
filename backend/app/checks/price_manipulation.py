import re
import json
import datetime
from urllib.parse import urljoin
from bs4 import BeautifulSoup

CURRENCY_RE = re.compile(r'[$£€]\s?\d[\d,]*\.?\d*')
PRICE_FIELD_KEYS = ('price', 'amount', 'total', 'cost', 'unit_price', 'subtotal', 'item_price')


def _find_price(text):
    m = CURRENCY_RE.search(text or '')
    return m.group(0) if m else None


def _extract_forms(soup):
    forms = []
    for f in soup.find_all('form'):
        action = f.attrs.get('action') or ''
        method = f.attrs.get('method', 'get').lower()
        inputs = []
        for inp in f.find_all(['input', 'textarea', 'select']):
            name = inp.attrs.get('name')
            itype = inp.attrs.get('type', 'text')
            value = inp.attrs.get('value', '')
            inputs.append({'name': name, 'type': itype, 'value': value})
        forms.append({'action': action, 'method': method, 'inputs': inputs})
    return forms


def _has_price_input(inputs):
    for i in inputs:
        n = (i.get('name') or '').lower()
        if any(k in n for k in PRICE_FIELD_KEYS):
            return True
    return False


def run(session, target, timeout=8):
    results = []
    try:
        r = session.get(target, timeout=timeout, verify=False)
    except Exception:
        return results
    base_price = _find_price(r.text)
    soup = BeautifulSoup(r.text or '', 'lxml')
    forms = _extract_forms(soup)
    for form in forms:
        if not _has_price_input(form['inputs']):
            continue
        action = urljoin(target, form['action'] or '')
        payload = {}
        for i in form['inputs']:
            name = i.get('name')
            if not name:
                continue
            nm = name.lower()
            if any(k in nm for k in PRICE_FIELD_KEYS):
                payload[name] = '0.01'
            else:
                payload[name] = i.get('value') or '1'
        try:
            if form['method'] == 'post':
                resp = session.post(action, data=payload, timeout=timeout, verify=False)
            else:
                resp = session.get(action, params=payload, timeout=timeout, verify=False)
        except Exception:
            continue
        resp_price = _find_price(resp.text)
        if resp_price and base_price:
            if (resp_price != base_price) and (resp_price == '$0.01' or '0.01' in resp_price):
                findings = {
                    'type': 'price-manipulation',
                    'url': action,
                    'payload': json.dumps(payload),
                    'evidence': f'price changed from {base_price} to {resp_price}',
                    'severity': 'high',
                    'detected_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
                }
                results.append(findings)
            elif resp_price != base_price:
                findings = {
                    'type': 'price-manipulation',
                    'url': action,
                    'payload': json.dumps(payload),
                    'evidence': f'price differs: page {base_price} vs response {resp_price}',
                    'severity': 'medium',
                    'detected_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
                }
                results.append(findings)
        else:
            if resp_price and not base_price:
                findings = {
                    'type': 'price-manipulation',
                    'url': action,
                    'payload': json.dumps(payload),
                    'evidence': f'no price on product page but response shows {resp_price}',
                    'severity': 'medium',
                    'detected_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
                }
                results.append(findings)
    try:
        parsed = session.get(target, timeout=timeout, verify=False)
    except Exception:
        return results
    qprice_match = None
    try:
        qprice_match = re.search(r'([?&]price=)([\d\.]+)', parsed.url)
    except Exception:
        qprice_match = None
    if qprice_match:
        try:
            cheap = re.sub(r'([?&]price=)([\d\.]+)', r'\g<1>0.01', parsed.url)
            rr = session.get(cheap, timeout=timeout, verify=False)
            cheap_price = _find_price(rr.text)
            if cheap_price and cheap_price != base_price:
                results.append({
                    'type': 'price-manipulation',
                    'url': cheap,
                    'payload': 'price param tampered',
                    'evidence': f'price in response changed to {cheap_price}',
                    'severity': 'high',
                    'detected_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
                })
        except Exception:
            pass
    return results
