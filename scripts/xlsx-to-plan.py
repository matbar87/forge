# Converts the plan spreadsheet (made by plan-to-xlsx.py, possibly edited in
# Excel / Google Sheets) back to src/data/plan.json:
#   python3 scripts/xlsx-to-plan.py plan.xlsx src/data/plan.json
# Then run `node scripts/check-plan.mjs` to validate the result.
import json, sys
from datetime import time as dtime, datetime, date
from openpyxl import load_workbook

src, dest = sys.argv[1], sys.argv[2]
wb = load_workbook(src, data_only=True)
TYPES = {'sesja': 'session', 'posiłek': 'meal', 'przerwa': 'break', 'aktywność': 'activity'}

def text(v):
    if v is None: return ''
    # A cell Excel / Sheets turned into a real time value: midnight as 00:00
    # (like the plan writes it), other hours without a leading zero.
    if isinstance(v, dtime): return f'{v.hour if v.hour else "00"}:{v.minute:02d}'
    # A date / date-time cell (Excel / Sheets may convert typed dates).
    if isinstance(v, datetime):
        return v.strftime('%Y-%m-%d') + (f' {v.hour}:{v.minute:02d}' if (v.hour, v.minute) != (0, 0) else '')
    if isinstance(v, date): return v.strftime('%Y-%m-%d')
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
if days_ws and 'Data (RRRR-MM-DD)' not in days_ws[0]:
    sys.exit('Dni: brak kolumny "Data (RRRR-MM-DD)" — to starsza wersja arkusza. '
             'Pobierz aktualny plan/plan-wydarzenia.xlsx z repo i nanieś zmiany w nim.')
head = {text(r['']): r for r in rows(wb['Nagłówek'])}
settings = {text(r['Ustawienie']): r for r in rows(wb['Ustawienia'])} if 'Ustawienia' in wb.sheetnames else {}
old = {}
try:
    old = json.load(open(dest, encoding='utf-8'))
except FileNotFoundError:
    pass

def start_minutes(item):
    h, _, m = item['time'].split('–')[0].strip().partition(':')
    try:
        return int(h) * 60 + int(m)
    except ValueError:
        return 0

def day_number(v, where):
    t = text(v)
    try:
        return int(t)
    except ValueError:
        sys.exit(f'{where}: "{t}" nie jest numerem dnia')

plan = {'_info': old.get('_info', [])}
leaders_until = text(settings['Koniec wydarzenia dla liderów']['Wartość']) if 'Koniec wydarzenia dla liderów' in settings else ''
if leaders_until:
    plan['leadersUntil'] = leaders_until
day_rows = sorted(((day_number(dr['Dzień'], 'Dni'), dr) for dr in days_ws), key=lambda x: text(x[1]['Data (RRRR-MM-DD)']))
numbers = [n for n, _ in day_rows]
dupes = sorted({n for n in numbers if numbers.count(n) > 1})
if dupes:
    sys.exit(f'Dni: numer dnia {", ".join(map(str, dupes))} występuje więcej niż raz — każdy dzień musi mieć inny numer')
known = set(numbers)
for lang, L in (('pl', 'PL'), ('en', 'EN')):
    plan[lang] = {'title': text(head['Tytuł'][L]), 'subtitle': text(head['Podtytuł'][L])}
    for version, sheet in (('szczegolowy', 'Plan szczegółowy'), ('podstawowy', 'Plan podstawowy')):
        items = {n: [] for n in known}
        for i, r in enumerate(rows(wb[sheet]), 2):
            n = day_number(r['Dzień'], f'{sheet}, wiersz {i}')
            if n not in known:
                sys.exit(f'{sheet}, wiersz {i}: dnia {n} nie ma w zakładce Dni')
            start, end = hhmm(r['Od']), hhmm(r['Do'])
            item = {'time': f'{start} – {end}' if end else start, 'title': text(r[f'Tytuł {L}'])}
            if text(r[f'Opis {L}']): item['description'] = text(r[f'Opis {L}'])
            typ = text(r['Typ']).lower()
            item['type'] = TYPES.get(typ, typ)
            if text(r[f'Etykieta {L}']): item['badge'] = text(r[f'Etykieta {L}'])
            if text(r.get('Tylko liderzy')).lower() in ('tak', 'yes', 'x', 'true', '1'): item['leaders'] = True
            items[n].append(item)
        days = []
        for n, dr in day_rows:
            if not items[n]:
                continue  # a day appears in a plan only if it has rows there
            day = {'number': n, 'isoDate': text(dr['Data (RRRR-MM-DD)']), 'date': text(dr[f'Data {L}'])}
            if version == 'szczegolowy':
                day['dayName'] = text(dr[f'Nazwa dnia {L}']); day['theme'] = text(dr[f'Motyw {L}'])
            # In start-time order; rows starting at the same time keep the
            # sheet's order (sorted() is stable).
            day['items'] = sorted(items[n], key=start_minutes)
            days.append(day)
        plan[lang][version] = {'days': days}
with open(dest, 'w', encoding='utf-8') as f:
    json.dump(plan, f, ensure_ascii=False, indent=2); f.write('\n')
print(f'{dest} written')
