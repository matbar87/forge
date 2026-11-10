# Exports src/data/groups.json (the division into groups) to an editable
# spreadsheet (.xlsx, also opens in Google Sheets):
#   python3 scripts/groups-to-xlsx.py src/data/groups.json plan/grupy.xlsx
# The reverse is scripts/xlsx-to-groups.py.
import json, sys
from openpyxl import Workbook
from openpyxl.worksheet.datavalidation import DataValidation
from xlsx_style import FILLS, data_cell, header, instructions, write_source

json_text = open(sys.argv[1], encoding='utf-8').read()
d = json.loads(json_text); out = sys.argv[2]
ROLE = {'leader': 'lider', 'assistant': 'asystent'}
initial = lambda s: (s.strip()[:1].upper() + '.') if s.strip() else ''
yn = lambda v: 'TAK' if v else 'NIE'

wb = Workbook()
ws = wb.active; ws.title = 'Instrukcja'
instructions(ws, [
    ('Grupy — podział na grupy (Kuźnia / Forge, zakładka „Grupy” w /app)', True),
    ('', False),
    ('Zakładki:', True),
    ('• Ustawienia — czy strona Grupy jest włączona (TAK / NIE) oraz nagłówek strony (tytuł i podtytuł, PL i EN; puste EN = tekst PL).', False),
    ('• Grupy — jedna grupa w wierszu (nazwa). Kolejność wierszy = kolejność na stronie.', False),
    ('• Osoby — jedna osoba w wierszu: grupa, inicjał nazwiska, imię, rola (lider / asystent / puste). Kolejność = kolejność na liście.', False),
    ('', False),
    ('Zasady:', True),
    ('• W grupie maksymalnie 12 osób i najwyżej dwóch liderów (asystentów może być kilku).', False),
    ('• Nazwa grupy w zakładce Osoby musi istnieć w zakładce Grupy.', False),
    ('• Na stronie osoby są pokazywane jako „Imię N.” (imię i inicjał nazwiska).', False),
    ('• Repo na GitHubie jest PUBLICZNE, dlatego nie przechowujemy nazwisk: w kolumnie „Inicjał nazwiska” wpisz jedną literę (np. „K.”).', False),
    ('  Jeśli wpiszesz całe nazwisko, zostanie skrócone do inicjału — ale wgrany plik zostaje w historii repo, więc lepiej nie wgrywać pełnych nazwisk.', False),
    ('• Strona włączona = NIE: zakładka Grupy znika, a dane osób nie trafiają do kodu strony.', False),
    ('', False),
    ('Aktualizacja strony: wgraj ten plik na GitHubie do repo forge jako plan/grupy.xlsx', False),
    ('(Add file → Upload files, ta sama nazwa i folder). Strona przebuduje się sama w kilka minut.', False),
    ('Jeśli w pliku jest błąd, w zakładce Actions pojawi się czerwony krzyżyk z opisem, a strona zostanie bez zmian.', False),
])

ws = wb.create_sheet('Ustawienia')
header(ws, [('Ustawienie', 40), ('Wartość', 90)])
data_cell(ws, 2, 1, 'Strona Grupy włączona', FILLS[0]); data_cell(ws, 2, 2, yn(d.get('enabled', True)), FILLS[0])
for i, (k, v) in enumerate([
    ('Tytuł strony PL', d['pl']['title']), ('Tytuł strony EN', d['en']['title']),
    ('Podtytuł strony PL', d['pl']['subtitle']), ('Podtytuł strony EN', d['en']['subtitle']),
], 1):
    data_cell(ws, i + 2, 1, k, FILLS[i % 2]); data_cell(ws, i + 2, 2, v, FILLS[i % 2])
dv = DataValidation(type='list', formula1='"TAK,NIE"', allow_blank=False, showErrorMessage=True, errorTitle='Ustawienie', error='TAK albo NIE')
ws.add_data_validation(dv); dv.add('B2:B2')

groups = d['groups']
ws = wb.create_sheet('Grupy')
header(ws, [('Grupa', 30), ('Liczba osób', 12)])
for i, g in enumerate(groups):
    data_cell(ws, i + 2, 1, g['name'], FILLS[i % 2], wrap=False)
    c = data_cell(ws, i + 2, 2, f"=COUNTIF(Osoby!A:A,A{i + 2})", FILLS[i % 2], center=True)

ws = wb.create_sheet('Osoby')
header(ws, [('Grupa', 24), ('Inicjał nazwiska', 18), ('Imię', 20), ('Rola', 14)])
r = 2
for i, g in enumerate(groups):
    for m in g['members']:
        for c, v in enumerate([g['name'], m['last'], m['first'], ROLE.get(m.get('role', ''), '')], 1):
            data_cell(ws, r, c, v, FILLS[i % 2], wrap=False)
        r += 1
n = len(groups) + 1
dv = DataValidation(type='list', formula1=f'=Grupy!$A$2:$A${n + 40}', allow_blank=True, showErrorMessage=True,
                    errorTitle='Grupa', error='Nazwa grupy z zakładki Grupy')
ws.add_data_validation(dv); dv.add(f'A2:A{r + 300}')
dv = DataValidation(type='list', formula1='"lider,asystent"', allow_blank=True, showErrorMessage=True,
                    errorTitle='Rola', error='lider, asystent albo puste')
ws.add_data_validation(dv); dv.add(f'D2:D{r + 300}')

write_source(wb, json_text)
wb.active = 1
wb.save(out)
