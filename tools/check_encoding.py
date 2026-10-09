import sys
import os

if sys.stdout.encoding and sys.stdout.encoding.lower() not in ('utf-8', 'utf8'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

corrupted_patterns = [
    '\u00c3\u00bc', # Ã¼
    '\u00c3\u00a4', # Ã¤
    '\u00c3\u00b6', # Ã¶
    '\u00c3\u0178', # ÃŸ
    '\u00c3\u201e', # Ã„
    '\u00c3\u0153', # Ãœ
    '\u00c3\u2013', # Ã–
    '\u00e2\u20ac\u017e', # â€ž
    '\u00e2\u20ac\u0153', # â€œ
    '\u00e2\u20ac\u2013', # â€“
    '?z',
    '?o'
]

files = [
    'data/story.json',
    'data/stations.json',
    'data/events.json',
    'data/final.json',
    'backup/SPRACH_BACKUP_story_dialoge.json'
]

print("=" * 60)
print("  UMLAUT- UND KODIERUNGSPRÜFUNG")
print("=" * 60)

for fpath in files:
    full_p = os.path.join(r"c:\Users\flaem\Desktop\Krimi", fpath.replace("/", "\\"))
    if not os.path.exists(full_p):
        continue
    with open(full_p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    found = [p for p in corrupted_patterns if p in content]
    if found:
        print(f"[FEHLER] {fpath}: {len(found)} Artefakte gefunden: {found}")
    else:
        # Check that REAL umlauts are present
        has_real_umlauts = any(c in content for c in 'äöüÄÖÜß')
        print(f"[OK] {fpath}: 100% sauber! Echte deutsche Umlaute vorhanden: {has_real_umlauts}")

print("=" * 60)
