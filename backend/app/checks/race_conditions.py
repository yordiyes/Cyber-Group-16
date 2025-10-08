import json
import datetime
from urllib.parse import urljoin
from concurrent.futures import ThreadPoolExecutor
import requests
from bs4 import BeautifulSoup

CANDIDATE_KEYWORDS = ('order', 'checkout', 'purchase', 'buy', 'confirm', 'placeorder')
HEADER_TEST_FLAG = {'X-Scan-Test': '1'}


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


def _is_candidate_action(action):
    a = (action or '').lower()
    return any(k in a for k in CANDIDATE_KEYWORDS)


def _make_payload(form):
    data = {}
    for i in form['inputs']:
        n = i.get('name')
        if not n:
            continue
        t = (i.get('type') or 'text').lower()
        if 'qty' in n.lower() or 'quantity' in n.lower():
            data[n] = '1'
        elif t in ('hidden', 'submit', 'checkbox', 'radio'):
            data[n] = i.get('value', '')
        else:
            data[n] = i.get('value', '1') or '1'
    if not data:
        return None
    return data


def _post_and_capture(session, url, data, method):
    try:
        if method == 'post':
            r = session.post(url, data=data, timeout=10, headers=HEADER_TEST_FLAG, verify=False)
        else:
            r = session.get(url, params=data, timeout=10, headers=HEADER_TEST_FLAG, verify=False)
        return {'status': r.status_code, 'len': len(r.text or ''), 'body_snippet': (r.text or '')[:500]}
    except Exception as e:
        return {'status': 'error', 'error': str(e)}


def run(session, target, timeout=8, workers=4):
    results = []
    try:
        r = session.get(target, timeout=timeout, verify=False)
    except Exception:
        return results
    soup = BeautifulSoup(r.text or '', 'lxml')
    forms = _extract_forms(soup)
    candidates = []
    for f in forms:
        if _is_candidate_action(f['action']):
            candidates.append(f)
    for form in candidates:
        payload = _make_payload(form)
        if not payload:
            continue
        action = urljoin(target, form['action'] or '')
        sequential = []
        sequential.append(_post_and_capture(session, action, payload, form['method']))
        sequential.append(_post_and_capture(session, action, payload, form['method']))
        statuses = [s.get('status') for s in sequential]
        if statuses[0] != statuses[1] or sequential[0].get('len') != sequential[1].get('len'):
            results.append({
                'type': 'race-condition-candidate',
                'url': action,
                'payload': json.dumps(payload),
                'evidence': f'sequential responses differ {statuses}',
                'severity': 'medium',
                'detected_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
            })
            continue
        pool_results = []
        with ThreadPoolExecutor(max_workers=workers) as ex:
            futures = [ex.submit(_post_and_capture, session, action, payload, form['method']) for _ in range(workers)]
            for fut in futures:
                pool_results.append(fut.result())
        pool_statuses = [p.get('status') for p in pool_results]
        if len(set(pool_statuses)) > 1:
            results.append({
                'type': 'race-condition-candidate',
                'url': action,
                'payload': json.dumps(payload),
                'evidence': f'concurrent responses differ {pool_statuses}',
                'severity': 'high',
                'detected_at': datetime.datetime.now(datetime.timezone.utc).isoformat()
            })
    return results
