# Keeps each spreadsheet in plan/ and its JSON in src/data/ in sync. Run by
# the build workflow before building (needs the full git history):
#   python scripts/sync-data.py
#
# It compares the current files instead of only the latest push, so a sync
# skipped by a cancelled CI run is caught up by the next one. Every sheet
# records which JSON it was generated from (hidden "_zrodlo" tab):
#   - sheet content == JSON            -> nothing to do (refresh the sheet
#                                         if its marker is out of date)
#   - sheet differs, made from the
#     current JSON                     -> an edit of the sheet: apply it to
#                                         the JSON, then regenerate the sheet
#   - sheet differs, made from an
#     older JSON, JSON changed later   -> JSON was edited (panel / GitHub):
#                                         regenerate the sheet
#   - sheet differs, made from an
#     older JSON, sheet uploaded later -> an outdated sheet was uploaded:
#                                         stop with an error rather than
#                                         overwrite newer changes
import json, os, shutil, subprocess, sys, tempfile
from openpyxl import load_workbook
from xlsx_style import json_hash, read_source

HERE = os.path.dirname(os.path.abspath(__file__))
PAIRS = [
    ('plan/plan-wydarzenia.xlsx', 'src/data/plan.json', 'xlsx-to-plan.py', 'plan-to-xlsx.py'),
    ('plan/pytania-grupy.xlsx', 'src/data/questions.json', 'xlsx-to-questions.py', 'questions-to-xlsx.py'),
]


def last_change(path):
    out = subprocess.run(['git', 'log', '-1', '--format=%ct', '--', path], capture_output=True, text=True, check=True).stdout
    return int(out.strip() or 0)


def run(script, *args):
    return subprocess.run([sys.executable, os.path.join(HERE, script), *args], capture_output=True, text=True)


def fail(msg):
    print(f'::error::{msg}')
    sys.exit(1)


def sync(xlsx, json_path, to_json, to_xlsx):
    json_text = open(json_path, encoding='utf-8').read()
    recorded = read_source(load_workbook(xlsx, read_only=True))
    current = json_hash(json_text)
    sheet_newer = last_change(xlsx) > last_change(json_path)

    def regenerate(reason):
        print(f'{xlsx}: {reason} — regenerating it from {json_path}')
        r = run(to_xlsx, json_path, xlsx)
        if r.returncode: fail(f'{to_xlsx}: {r.stderr.strip() or r.stdout.strip()}')

    with tempfile.TemporaryDirectory() as tmp:
        converted_path = os.path.join(tmp, 'converted.json')
        shutil.copy(json_path, converted_path)  # keeps the _info block
        r = run(to_json, xlsx, converted_path)
        if r.returncode:
            if not sheet_newer:
                return regenerate('cannot be read (older format?) and the JSON is newer')
            fail(f'{xlsx}: {r.stderr.strip() or r.stdout.strip()}')
        converted = open(converted_path, encoding='utf-8').read()

    # Compare the data, not the text: formatting (e.g. a missing final
    # newline after an edit on GitHub) isn't a change.
    if json.loads(converted) == json.loads(json_text):
        if recorded != current:
            regenerate('same content, outdated version marker')
        else:
            print(f'{xlsx} / {json_path}: in sync')
        return
    if recorded == current or (recorded is None and sheet_newer):
        if recorded is None:
            print(f'::warning::{xlsx} has no version marker (made before markers existed, or the marker tab '
                  'was removed); applying it as an edit of the current plan.')
        print(f'{xlsx}: edited — updating {json_path}')
        with open(json_path, 'w', encoding='utf-8') as f:
            f.write(converted)
        return regenerate('normalising after the edit')
    if not sheet_newer:
        return regenerate(f'outdated ({json_path} changed after it was generated)')
    fail(
        f'{xlsx} został przygotowany na podstawie starszej wersji danych — w międzyczasie zmieniono {json_path} '
        '(np. w panelu edycji). Żeby nie nadpisać tych zmian, nic nie zostało opublikowane. Pobierz aktualny '
        f'{xlsx} z repo, nanieś w nim swoje zmiany i wgraj go ponownie.'
    )


if __name__ == '__main__':
    for pair in PAIRS:
        sync(*pair)
