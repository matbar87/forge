# Converts the plan spreadsheet (made by plan-to-xlsx.py, possibly edited in
# Excel / Google Sheets) back to src/data/plan.json:
#   python3 scripts/xlsx-to-plan.py plan.xlsx src/data/plan.json
# Then run `node scripts/check-plan.mjs` to validate the result.
import json, sys
from datetime import time as dtime
from openpyxl import load_workbook

src, dest = sys.argv[1], sys.argv[2]
wb = load_workbook(src, data_only=True)
TYPES = {'sesja': 'session', 'posiłek': 'meal', 'przerwa': 'break', 'aktywność': 'activity'}

def text(v):
    if v is None: return ''
    # A cell Excel / Sheets turned into a real time value: midnight as 00:00
    # (like the plan writes it), other hours without a leading zero.
    if isinstance(v, dtime): return f'{v.hour if v.hour else "00"}:{v.minute:02d}'
    if isinstance(v, float) and v.is_integer(): v = int(v)
    return str(v).strip()

def hhmm(v):
    t = text(v)
    # '9.30' typed with a dot -> '9:30'; seconds from a time value are dropped
    t = t.replace('.', ':')
    return ':'.join(t.split(':')[:2]) if ':' in t else t

def rows(ws):
    hdr = [text(c.value) for c in ws[1]]
    for r in ws.iter_rows(min_row=2, values_only=True):
        if all(text(v) == '' for v in r): continue
        yield dict(zip(hdr, r))

days_ws = list(rows(wb['Dni']))
head = {text(r['']): r for r in rows(wb['Nagłówek'])}
old = {}
try:
    old = json.load(open(dest, encoding='utf-8'))
except FileNotFoundError:
    pass
plan = {'_info': old.get('_info', [])}
for lang, L in (('pl', 'PL'), ('en', 'EN')):
    plan[lang] = {'title': text(head['Tytuł'][L]), 'subtitle': text(head['Podtytuł'][L])}
    for version, sheet in (('szczegolowy', 'Plan szczegółowy'), ('podstawowy', 'Plan podstawowy')):
        days = []
        for i, dr in enumerate(days_ws):
            day = {'date': text(dr[f'Data {L}'])}
            if version == 'szczegolowy':
                day['dayName'] = text(dr[f'Nazwa dnia {L}']); day['theme'] = text(dr[f'Motyw {L}'])
            day['items'] = []
            days.append(day)
        for r in rows(wb[sheet]):
            n = int(text(r['Dzień']))
            start, end = hhmm(r['Od']), hhmm(r['Do'])
            item = {'time': f'{start} – {end}' if end else start, 'title': text(r[f'Tytuł {L}'])}
            if text(r[f'Opis {L}']): item['description'] = text(r[f'Opis {L}'])
            typ = text(r['Typ']).lower()
            item['type'] = TYPES.get(typ, typ)
            if text(r[f'Etykieta {L}']): item['badge'] = text(r[f'Etykieta {L}'])
            days[n - 1]['items'].append(item)
        plan[lang][version] = {'days': days}
with open(dest, 'w', encoding='utf-8') as f:
    json.dump(plan, f, ensure_ascii=False, indent=2); f.write('\n')
print(f'{dest} written')
