import os
import re
import sys

base_dir = r"c:\Users\flaem\Desktop\Krimi"
js_dir = os.path.join(base_dir, "js")

if sys.stdout.encoding and sys.stdout.encoding.lower() not in ('utf-8', 'utf8'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

print("=" * 70)
print("  TIEFENPRÜFUNG ALLER JAVASCRIPT-DATEIEN (SYNTAX & VERKNÜPFUNGEN)")
print("=" * 70)

# 1. Collect all JS files
all_js_files = []
for root, dirs, files in os.walk(js_dir):
    for f in files:
        if f.endswith(".js"):
            all_js_files.append(os.path.join(root, f))

print(f"\n[INFO] Gefundene JS-Dateien: {len(all_js_files)}")

# Read index.html to collect all existing IDs
with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
    html_content = f.read()

dom_ids_in_html = set(re.findall(r'id=["\']([^"\']+)["\']', html_content))
print(f"[INFO] Gefundene IDs in index.html: {len(dom_ids_in_html)}")

# 2. Check each JS file
import_errors = 0
bracket_errors = 0
unmatched_dom_ids = {}

for js_path in all_js_files:
    rel_path = os.path.relpath(js_path, base_dir)
    with open(js_path, "r", encoding="utf-8") as f:
        code = f.read()

    # Bracket / Parenthesis balance check (ignoring strings and comments)
    # Simple tokenizer
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    in_single_str = False
    in_double_str = False
    in_template = False
    in_line_comment = False
    in_block_comment = False
    escaped = False

    i = 0
    line_num = 1
    has_bracket_err = False

    while i < len(code):
        c = code[i]
        nxt = code[i+1] if i+1 < len(code) else ''

        if c == '\n':
            line_num += 1
            in_line_comment = False

        if escaped:
            escaped = False
            i += 1
            continue

        if c == '\\':
            escaped = True
            i += 1
            continue

        if in_line_comment:
            i += 1
            continue

        if in_block_comment:
            if c == '*' and nxt == '/':
                in_block_comment = False
                i += 2
                continue
            i += 1
            continue

        if in_single_str:
            if c == "'":
                in_single_str = False
            i += 1
            continue

        if in_double_str:
            if c == '"':
                in_double_str = False
            i += 1
            continue

        if in_template:
            if c == '`':
                in_template = False
            i += 1
            continue

        # Check comment start
        if c == '/' and nxt == '/':
            in_line_comment = True
            i += 2
            continue
        if c == '/' and nxt == '*':
            in_block_comment = True
            i += 2
            continue

        # Check strings
        if c == "'":
            in_single_str = True
            i += 1
            continue
        if c == '"':
            in_double_str = True
            i += 1
            continue
        if c == '`':
            in_template = True
            i += 1
            continue

        # Parenthesis check
        if c in '({[':
            stack.append((c, line_num))
        elif c in ')}]':
            expected = pairs[c]
            if not stack or stack[-1][0] != expected:
                print(f"[FAIL] {rel_path}: Unerwartete Klammer '{c}' in Zeile {line_num}!")
                has_bracket_err = True
                bracket_errors += 1
                break
            else:
                stack.pop()

        i += 1

    if not has_bracket_err and stack:
        print(f"[FAIL] {rel_path}: Nicht geschlossene Klammer '{stack[-1][0]}' aus Zeile {stack[-1][1]}!")
        bracket_errors += 1

    # Check ES Imports
    imports = re.findall(r'import\s+(?:.*?from\s+)?[\'"]([^\'"]+)[\'"]', code)
    for imp in imports:
        if imp.startswith('.'):
            # Resolve relative import
            dir_of_file = os.path.dirname(js_path)
            target = os.path.normpath(os.path.join(dir_of_file, imp))
            if not os.path.exists(target):
                print(f"[FAIL] {rel_path}: Importiert nicht-existente Datei: '{imp}' -> '{target}'")
                import_errors += 1

    # Check getElementById calls
    get_ids = re.findall(r'getElementById\([\'"]([^\'"]+)[\'"]\)', code)
    for gid in get_ids:
        if gid not in dom_ids_in_html:
            unmatched_dom_ids.setdefault(gid, []).append(rel_path)

print(f"\n[STATUS] Klammer-Integrität: {'0 FEHLER' if bracket_errors == 0 else f'{bracket_errors} FEHLER'}")
print(f"[STATUS] Import-Integrität:  {'0 FEHLER' if import_errors == 0 else f'{import_errors} FEHLER'}")

print(f"\n[INFO] GetElementById Referenzen nicht direkt in statischem index.html:")
for gid, files in sorted(unmatched_dom_ids.items()):
    print(f"  - '{gid}' (verwendet in: {', '.join(files)})")

print("=" * 70)
