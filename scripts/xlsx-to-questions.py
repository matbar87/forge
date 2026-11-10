# Converts the Group Time spreadsheet (made by questions-to-xlsx.py, possibly
# edited in Excel / Google Sheets) back to src/data/questions.json:
#   python3 scripts/xlsx-to-questions.py plan/pytania-grupy.xlsx src/data/questions.json
# Then run `node scripts/check-questions.mjs` to validate the result.
import json, sys
from openpyxl import load_workbook

src, dest = sys.argv[1], sys.argv[2]
wb = load_workbook(src, data_only=True)

def text(v):
    if v is None: return ''
    if isinstance(v, float) and v.is_integer(): v = int(v)
    return ' '.join(str(v).split())

def rows(ws):
    hdr = [text(c.value) for c in ws[1]]
    for r in ws.iter_rows(min_row=2, values_only=True):
        if all(text(v) == '' for v in r): continue
        yield dict(zip(hdr, r))

def num(v, where):
    t = text(v)
    try:
        return int(t)
    except ValueError:
        sys.exit(f'{where}: "{t}" nie jest numerem sesji')

sessions = sorted(rows(wb['Sesje']), key=lambda r: num(r['Sesja'], 'Sesje'))
numbers = [num(r['Sesja'], 'Sesje') for r in sessions]
if numbers != list(range(1, len(numbers) + 1)):
    sys.exit(f'Sesje: numery muszą iść po kolei od 1 (są: {numbers})')

try:
    old = json.load(open(dest, encoding='utf-8'))
except FileNotFoundError:
    old = {}
out = {'_info': old.get('_info', [])}
# Page heading from the Ustawienia tab; sheets made before it existed keep the current one.
settings = {text(r['Ustawienie']): text(r['Wartość']) for r in rows(wb['Ustawienia'])} if 'Ustawienia' in wb.sheetnames else {}
def heading(label, L, lang, key):
    if not settings: return old.get(lang, {}).get(key, '')
    return settings.get(f'{label} PL', '') if L == 'PL' else settings.get(f'{label} EN', '') or settings.get(f'{label} PL', '')

for lang, L, word in (('pl', 'PL', 'Sesja'), ('en', 'EN', 'Session')):
    out[lang] = {
        'title': heading('Tytuł strony', L, lang, 'title'),
        'subtitle': heading('Podtytuł strony', L, lang, 'subtitle'),
        'sessions': [
        {'title': f'{word} {n}', 'topic': text(r[f'Temat {L}']) or text(r['Temat PL']), 'questions': []}
        for n, r in zip(numbers, sessions)
    ]}
for i, r in enumerate(rows(wb['Pytania']), 2):
    n = num(r['Sesja'], f'Pytania, wiersz {i}')
    if not 1 <= n <= len(numbers):
        sys.exit(f'Pytania, wiersz {i}: sesja {n} nie istnieje w zakładce Sesje')
    q_pl = text(r['Pytanie PL'])
    if not q_pl:
        sys.exit(f'Pytania, wiersz {i}: brak treści pytania PL')
    out['pl']['sessions'][n - 1]['questions'].append(q_pl)
    out['en']['sessions'][n - 1]['questions'].append(text(r['Pytanie EN']) or q_pl)
with open(dest, 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2); f.write('\n')
print(f'{dest} written')
