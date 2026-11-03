# Exports src/data/questions.json (Group Time sessions and questions) to an
# editable spreadsheet (.xlsx, also opens in Google Sheets):
#   python3 scripts/questions-to-xlsx.py src/data/questions.json plan/pytania-grupy.xlsx
# The reverse is scripts/xlsx-to-questions.py.
import json, sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

d = json.load(open(sys.argv[1], encoding='utf-8')); out = sys.argv[2]
F = 'Arial'
hdr_font = Font(name=F, bold=True, color='FFFFFF'); hdr_fill = PatternFill('solid', fgColor='18212C')
body = Font(name=F)
fills = ['F2F4EE', 'FFFFFF']
thin = Side(style='thin', color='D0D4C8')

def header(ws, cols):
    for c, (name, width) in enumerate(cols, 1):
        cell = ws.cell(1, c, name); cell.font = hdr_font; cell.fill = hdr_fill
        cell.alignment = Alignment(vertical='center', wrap_text=True)
        ws.column_dimensions[get_column_letter(c)].width = width
    ws.row_dimensions[1].height = 30
    ws.freeze_panes = 'A2'

def put(ws, r, values, fill, wrap_from=2):
    for c, v in enumerate(values, 1):
        cell = ws.cell(r, c, v if v != '' else None); cell.font = body
        cell.fill = PatternFill('solid', fgColor=fill); cell.border = Border(bottom=thin)
        cell.alignment = Alignment(vertical='top', wrap_text=c >= wrap_from, horizontal='center' if c < wrap_from else None)

wb = Workbook()
ws = wb.active; ws.title = 'Instrukcja'
lines = [
    ('Czas w grupach — sesje i pytania (Kuźnia / Forge, zakładka w /app)', True),
    ('', False),
    ('Zakładki:', True),
    ('• Sesje — jedna sesja w wierszu: numer i temat (PL i EN). Tytuł na stronie to „Sesja [numer]” / „Session [number]”.', False),
    ('• Pytania — jedno pytanie w wierszu: numer sesji i treść (PL i EN). Kolejność wierszy = numeracja pytań w danej sesji.', False),
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
ws.column_dimensions['A'].width = 110
for i, (t, b) in enumerate(lines, 1):
    ws.cell(i, 1, t).font = Font(name=F, bold=b, size=14 if i == 1 else 11)

pl, en = d['pl']['sessions'], d['en']['sessions']
ws = wb.create_sheet('Sesje')
header(ws, [('Sesja', 8), ('Temat PL', 50), ('Temat EN', 50)])
for i, (a, b) in enumerate(zip(pl, en)):
    put(ws, i + 2, [i + 1, a['topic'], b['topic']], fills[i % 2])

ws = wb.create_sheet('Pytania')
header(ws, [('Sesja', 8), ('Pytanie PL', 70), ('Pytanie EN', 70)])
r = 2
for i, (a, b) in enumerate(zip(pl, en)):
    for j, qa in enumerate(a['questions']):
        qb = b['questions'][j] if j < len(b['questions']) else ''
        put(ws, r, [i + 1, qa, '' if qb == qa else qb], fills[i % 2]); r += 1
dv = DataValidation(type='whole', operator='between', formula1='1', formula2=str(len(pl)),
                    showErrorMessage=True, errorTitle='Sesja', error='Numer sesji z zakładki Sesje')
ws.add_data_validation(dv); dv.add(f'A2:A{r + 300}')

wb.active = 1
wb.save(out)
