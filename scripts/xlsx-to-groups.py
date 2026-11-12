# Converts the groups spreadsheet (made by groups-to-xlsx.py, possibly edited
# in Excel / Google Sheets) back to src/data/groups.json:
#   python3 scripts/xlsx-to-groups.py plan/grupy.xlsx src/data/groups.json
# Then run `node scripts/check-groups.mjs` to validate the result.
import json, sys
from openpyxl import load_workbook

src, dest = sys.argv[1], sys.argv[2]
wb = load_workbook(src, data_only=True)

def text(v):
    if v is None: return ''
    if isinstance(v, float) and v.is_integer(): v = int(v)
    return ' '.join(str(v).split())

def rows(ws, need=()):
    hdr = [text(c.value) for c in ws[1]]
    for col in need:
        if col not in hdr: sys.exit(f'Zakładka „{ws.title}”: brak kolumny „{col}” w pierwszym wierszu (nie zmieniaj nagłówków)')
    for i, r in enumerate(ws.iter_rows(min_row=2, values_only=True), 2):
        if all(text(v) == '' for v in r): continue
        yield i, dict(zip(hdr, r))

# The repo is public: whatever is typed in the surname column is cut down to
# an initial before it is written anywhere.
def initial(s):
    return s[:1].upper() + '.' if s else ''

def yes_no(v, what):
    t = text(v).upper()
    if t in ('TAK', 'T', 'YES', 'TRUE', '1'): return True
    if t in ('NIE', 'N', 'NO', 'FALSE', '0'): return False
    sys.exit(f'Ustawienia: „{what}” — wpisz TAK albo NIE (jest: "{text(v)}")')

settings = {text(r['Ustawienie']): r['Wartość'] for _, r in rows(wb['Ustawienia'], ('Ustawienie', 'Wartość'))}
for k in ('Strona Grupy włączona',):
    if k not in settings: sys.exit(f'Ustawienia: brak wiersza „{k}”')

ROLES = {'lider': 'leader', 'leader': 'leader', 'asystent': 'assistant', 'assistant': 'assistant', '': ''}
groups, by_key = [], {}
for i, r in rows(wb['Grupy'], ('Grupa',)):
    name = text(r['Grupa'])
    if name.lower() in by_key: sys.exit(f'Grupy, wiersz {i}: grupa „{name}” występuje dwa razy')
    by_key[name.lower()] = {'name': name, 'members': []}
    groups.append(by_key[name.lower()])
for i, r in rows(wb['Osoby'], ('Grupa', 'Inicjał nazwiska', 'Imię', 'Rola')):
    g = by_key.get(text(r['Grupa']).lower())
    if g is None: sys.exit(f'Osoby, wiersz {i}: grupa „{text(r["Grupa"])}” nie istnieje w zakładce Grupy')
    role = text(r['Rola']).lower()
    if role not in ROLES: sys.exit(f'Osoby, wiersz {i}: rola „{text(r["Rola"])}” — wpisz lider, asystent albo zostaw puste')
    m = {'first': text(r['Imię']), 'last': initial(text(r['Inicjał nazwiska']))}
    if ROLES[role]: m['role'] = ROLES[role]
    g['members'].append(m)

try:
    old = json.load(open(dest, encoding='utf-8'))
except FileNotFoundError:
    old = {}
def heading(lang, label, key):
    # PL blank -> keep the current text; EN blank -> same as PL.
    pl = text(settings.get(f'{label} PL')) or old.get('pl', {}).get(key, '')
    if lang == 'pl': return pl
    return text(settings.get(f'{label} EN')) or pl

# Task PDFs are set in the admin panel only: keep them, and each group's
# task (matched by group name), as they are in the current JSON.
old_task = {str(g.get('name', '')).lower(): g['task'] for g in old.get('groups', []) if g.get('task')}
for g in groups:
    if g['name'].lower() in old_task:
        members = g.pop('members'); g['task'] = old_task[g['name'].lower()]; g['members'] = members

out = {'_info': old.get('_info', []),
       'enabled': yes_no(settings['Strona Grupy włączona'], 'Strona Grupy włączona'),
       'pl': {'title': heading('pl', 'Tytuł strony', 'title'), 'subtitle': heading('pl', 'Podtytuł strony', 'subtitle')},
       'en': {'title': heading('en', 'Tytuł strony', 'title'), 'subtitle': heading('en', 'Podtytuł strony', 'subtitle')},
       **({'tasks': old['tasks']} if 'tasks' in old else {}),
       'groups': groups}
with open(dest, 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2); f.write('\n')
print(f'{dest} written')
