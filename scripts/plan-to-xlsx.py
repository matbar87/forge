# Exports src/data/plan.json to an editable spreadsheet (.xlsx, also opens in
# Google Sheets): python3 scripts/plan-to-xlsx.py src/data/plan.json plan.xlsx
# The reverse is scripts/xlsx-to-plan.py.
import json, sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter

d = json.load(open(sys.argv[1], encoding='utf-8')); out = sys.argv[2]
F = 'Arial'
hdr_font = Font(name=F, bold=True, color='FFFFFF'); hdr_fill = PatternFill('solid', fgColor='18212C')
body = Font(name=F); bold = Font(name=F, bold=True)
day_fills = ['F2F4EE', 'FFFFFF', 'F2F4EE']
thin = Side(style='thin', color='D0D4C8')
TYPES = {'session': 'sesja', 'meal': 'posiłek', 'break': 'przerwa', 'activity': 'aktywność'}

wb = Workbook()

def header(ws, cols):
    for c, (name, width) in enumerate(cols, 1):
        cell = ws.cell(1, c, name); cell.font = hdr_font; cell.fill = hdr_fill
        cell.alignment = Alignment(vertical='center', wrap_text=True)
        ws.column_dimensions[get_column_letter(c)].width = width
    ws.row_dimensions[1].height = 30
    ws.freeze_panes = 'A2'

def plan_sheet(ws, version):
    cols = [('Dzień', 7), ('Od', 8), ('Do', 8), ('Tytuł PL', 30), ('Tytuł EN', 30), ('Opis PL', 26), ('Opis EN', 26),
            ('Typ', 12), ('Etykieta PL', 14), ('Etykieta EN', 14)]
    header(ws, cols)
    r = 2
    for di, (dpl, den) in enumerate(zip(d['pl'][version]['days'], d['en'][version]['days'])):
        for a, b in zip(dpl['items'], den['items']):
            parts = [p.strip() for p in a['time'].split('–')]
            row = [di + 1, parts[0], parts[1] if len(parts) > 1 else '', a['title'], b['title'],
                   a.get('description', ''), b.get('description', ''), TYPES[a['type']], a.get('badge', ''), b.get('badge', '')]
            for c, v in enumerate(row, 1):
                cell = ws.cell(r, c, v if v != '' else None); cell.font = body
                cell.fill = PatternFill('solid', fgColor=day_fills[di % 3])
                cell.border = Border(bottom=thin)
                if c in (2, 3): cell.number_format = '@'
                cell.alignment = Alignment(vertical='top', wrap_text=c >= 4, horizontal='center' if c <= 3 else None)
            r += 1
    dv = DataValidation(type='list', formula1='"' + ','.join(TYPES.values()) + '"', allow_blank=False,
                        showErrorMessage=True, errorTitle='Typ', error='Wybierz: ' + ', '.join(TYPES.values()))
    ws.add_data_validation(dv); dv.add(f'H2:H{r + 200}')
    dvd = DataValidation(type='whole', operator='between', formula1='1', formula2=str(len(d['pl'][version]['days'])),
                         showErrorMessage=True, errorTitle='Dzień', error='Numer dnia z zakładki Dni')
    ws.add_data_validation(dvd); dvd.add(f'A2:A{r + 200}')
    for c in (2, 3):
        for rr in range(r, r + 200): ws.cell(rr, c).number_format = '@'
    ws.auto_filter.ref = f'A1:J{r - 1}'

ws = wb.active; ws.title = 'Instrukcja'
lines = [
    ('Plan wydarzenia Kuźnia / Forge', True),
    ('', False),
    ('Zakładki:', True),
    ('• Plan szczegółowy — plan pokazywany w aplikacji /app (z podziałem na grupy A/B itp.).', False),
    ('• Plan podstawowy — uproszczony plan na stronie głównej.', False),
    ('• Dni — daty, nazwy dni i motywy (wspólne dla obu planów).', False),
    ('• Nagłówek — tytuł i podtytuł sekcji planu.', False),
    ('', False),
    ('Jak edytować:', True),
    ('• Jeden wiersz = jeden punkt planu. Kolejność wierszy = kolejność na stronie.', False),
    ('• Dzień: numer dnia (1, 2, 3) z zakładki Dni.', False),
    ('• Od / Do: godzina w formacie 9:30. „Do” można zostawić puste (np. Zakończenie o 16:00).', False),
    ('• Typ (lista): sesja, posiłek, przerwa, aktywność — decyduje o ikonie, kolorze i domyślnej etykiecie.', False),
    ('• Etykieta: opcjonalna, własny napis zamiast domyślnego dla typu (np. GRUPY, MODLITWA, PRZYJAZD).', False),
    ('• Opis: opcjonalny (np. Grupa A, Dla chętnych).', False),
    ('• Wypełnij obie kolumny: PL i EN.', False),
    ('', False),
    ('Aktualizacja strony: wgraj ten plik na GitHubie do repo forge jako plan/plan-wydarzenia.xlsx', False),
    ('(Add file → Upload files, ta sama nazwa i folder). Strona przebuduje się sama w kilka minut.', False),
    ('Jeśli w planie jest błąd, w zakładce Actions pojawi się czerwony krzyżyk z opisem, a strona zostanie bez zmian.', False),
]
ws.column_dimensions['A'].width = 110
for i, (t, b) in enumerate(lines, 1):
    c = ws.cell(i, 1, t); c.font = Font(name=F, bold=b, size=14 if i == 1 else 11)
plan_sheet(wb.create_sheet('Plan szczegółowy'), 'szczegolowy')
plan_sheet(wb.create_sheet('Plan podstawowy'), 'podstawowy')

ws = wb.create_sheet('Dni')
header(ws, [('Dzień', 7), ('Data PL', 26), ('Data EN', 26), ('Nazwa dnia PL', 28), ('Nazwa dnia EN', 28), ('Motyw PL', 32), ('Motyw EN', 32)])
for i, (a, b) in enumerate(zip(d['pl']['szczegolowy']['days'], d['en']['szczegolowy']['days'])):
    for c, v in enumerate([i + 1, a['date'], b['date'], a['dayName'], b['dayName'], a['theme'], b['theme']], 1):
        cell = ws.cell(i + 2, c, v); cell.font = body; cell.alignment = Alignment(vertical='top', wrap_text=True)

ws = wb.create_sheet('Nagłówek')
header(ws, [('', 12), ('PL', 50), ('EN', 50)])
for i, k in enumerate(['title', 'subtitle']):
    ws.cell(i + 2, 1, {'title': 'Tytuł', 'subtitle': 'Podtytuł'}[k]).font = bold
    for c, l in enumerate(['pl', 'en'], 2):
        cell = ws.cell(i + 2, c, d[l][k]); cell.font = body; cell.alignment = Alignment(wrap_text=True)

wb.active = 1
wb.save(out)
