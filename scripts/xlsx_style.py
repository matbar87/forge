# Shared by the spreadsheet scripts (plan-to-xlsx.py, questions-to-xlsx.py,
# sync-data.py): cell styles, the header row, the instructions tab, and the
# hidden "_zrodlo" tab that records which version of the JSON a sheet was
# generated from (so CI can tell a fresh edit from an outdated upload).
import hashlib
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

FONT = 'Arial'
HDR_FONT = Font(name=FONT, bold=True, color='FFFFFF')
HDR_FILL = PatternFill('solid', fgColor='18212C')
BODY = Font(name=FONT)
BOLD = Font(name=FONT, bold=True)
FILLS = ['F2F4EE', 'FFFFFF']
THIN = Side(style='thin', color='D0D4C8')
SOURCE_SHEET = '_zrodlo'


def header(ws, cols):
    """Header row (name, width) with frozen pane below it."""
    for c, (name, width) in enumerate(cols, 1):
        cell = ws.cell(1, c, name); cell.font = HDR_FONT; cell.fill = HDR_FILL
        cell.alignment = Alignment(vertical='center', wrap_text=True)
        ws.column_dimensions[get_column_letter(c)].width = width
    ws.row_dimensions[1].height = 30
    ws.freeze_panes = 'A2'


def data_cell(ws, r, c, value, fill, wrap=True, center=False, text_format=False):
    cell = ws.cell(r, c, value if value != '' else None)
    cell.font = BODY
    cell.fill = PatternFill('solid', fgColor=fill)
    cell.border = Border(bottom=THIN)
    cell.alignment = Alignment(vertical='top', wrap_text=wrap, horizontal='center' if center else None)
    if text_format: cell.number_format = '@'
    return cell


def instructions(ws, lines):
    """lines: (text, bold); the first line is the title."""
    ws.column_dimensions['A'].width = 110
    for i, (t, b) in enumerate(lines, 1):
        ws.cell(i, 1, t).font = Font(name=FONT, bold=b, size=14 if i == 1 else 11)


def json_hash(text):
    return hashlib.sha256(text.encode('utf-8')).hexdigest()


def write_source(wb, json_text):
    """Hidden tab with the hash of the JSON the sheet was generated from."""
    ws = wb.create_sheet(SOURCE_SHEET)
    ws['A1'] = json_hash(json_text)
    ws['A2'] = 'Nie edytuj — techniczny znacznik wersji, z której wygenerowano arkusz.'
    ws.sheet_state = 'hidden'


def read_source(wb):
    """The recorded hash, or None for sheets made before it existed."""
    if SOURCE_SHEET not in wb.sheetnames: return None
    v = wb[SOURCE_SHEET]['A1'].value
    return str(v).strip() if v else None
