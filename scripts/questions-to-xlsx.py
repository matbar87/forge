# Exports src/data/questions.json (Group Time sessions and questions) to an
# editable spreadsheet (.xlsx, also opens in Google Sheets):
#   python3 scripts/questions-to-xlsx.py src/data/questions.json plan/pytania-grupy.xlsx
# The reverse is scripts/xlsx-to-questions.py.
import json, sys
from openpyxl import Workbook
from openpyxl.worksheet.datavalidation import DataValidation
from xlsx_style import FILLS, data_cell, header, instructions, write_source

json_text = open(sys.argv[1], encoding='utf-8').read()
d = json.loads(json_text); out = sys.argv[2]

def put(ws, r, values, fill, wrap_from=2):
    for c, v in enumerate(values, 1):
        data_cell(ws, r, c, v, fill, wrap=c >= wrap_from, center=c < wrap_from)

wb = Workbook()
ws = wb.active; ws.title = 'Instrukcja'
lines = [
    ('Czas w grupach — sesje i pytania (Kuźnia / Forge, zakładka w /app)', True),
    ('', False),
    ('Zakładki:', True),
    ('• Sesje — jedna sesja w wierszu: numer i temat (PL i EN). Tytuł na stronie to „Sesja [numer]” / „Session [number]”.', False),
    ('  Kolumna Odblokowanie: puste = pytania pojawią się, gdy „Sesja [numer]” zacznie się wg planu szczegółowego;', False),
    ('  „od razu” = widoczne od razu; data i godzina RRRR-MM-DD GG:MM (np. 2026-11-12 19:00) = widoczne od tej chwili.', False),
    ('• Pytania — jedno pytanie w wierszu: numer sesji i treść (PL i EN). Kolejność wierszy = numeracja pytań w danej sesji.', False),
    ('• Ustawienia — nagłówek strony (tytuł i podtytuł, PL i EN).', False),
    ('', False),
    ('Jak edytować:', True),
    ('• Aby dodać pytanie, dopisz wiersz z numerem sesji (może być na końcu arkusza). Aby usunąć — usuń wiersz.', False),
    ('• Sesja bez pytań pokaże komunikat „Pytania do tej sesji pojawią się wkrótce”.', False),
    ('• Puste pole EN = na angielskiej wersji strony pojawi się tekst PL.', False),
    ('', False),
    ('Aktualizacja strony: wgraj ten plik na GitHubie do repo forge jako plan/pytania-grupy.xlsx', False),
    ('(Add file → Upload files, ta sama nazwa i folder). Strona przebuduje się sama w kilka minut.', False),
    ('Jeśli w pliku jest błąd, w zakładce Actions pojawi się czerwony krzyżyk z opisem, a strona zostanie bez zmian.', False),
]
instructions(ws, lines)

pl, en = d['pl']['sessions'], d['en']['sessions']
ws = wb.create_sheet('Sesje')
header(ws, [('Sesja', 8), ('Temat PL', 50), ('Temat EN', 50), ('Odblokowanie', 22)])
def unlock_cell(u):
    return 'od razu' if u == 'open' else (u or '')
for i, (a, b) in enumerate(zip(pl, en)):
    put(ws, i + 2, [i + 1, a['topic'], b['topic'], unlock_cell(a.get('unlock', ''))], FILLS[i % 2])

ws = wb.create_sheet('Pytania')
header(ws, [('Sesja', 8), ('Pytanie PL', 70), ('Pytanie EN', 70)])
r = 2
for i, (a, b) in enumerate(zip(pl, en)):
    for j, qa in enumerate(a['questions']):
        qb = b['questions'][j] if j < len(b['questions']) else ''
        put(ws, r, [i + 1, qa, '' if qb == qa else qb], FILLS[i % 2]); r += 1
dv = DataValidation(type='whole', operator='between', formula1='1', formula2=str(len(pl)),
                    showErrorMessage=True, errorTitle='Sesja', error='Numer sesji z zakładki Sesje')
ws.add_data_validation(dv); dv.add(f'A2:A{r + 300}')

ws = wb.create_sheet('Ustawienia')
header(ws, [('Ustawienie', 30), ('Wartość', 90)])
for i, (k, v) in enumerate([
    ('Tytuł strony PL', d['pl'].get('title', '')), ('Tytuł strony EN', d['en'].get('title', '')),
    ('Podtytuł strony PL', d['pl'].get('subtitle', '')), ('Podtytuł strony EN', d['en'].get('subtitle', '')),
]):
    data_cell(ws, i + 2, 1, k, FILLS[i % 2], wrap=False); data_cell(ws, i + 2, 2, v, FILLS[i % 2])

write_source(wb, json_text)
wb.active = 1
wb.save(out)
