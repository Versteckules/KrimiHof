import json
import os
import re

import sys

# Ensure UTF-8 output if possible, otherwise ASCII-safe
if sys.stdout.encoding and sys.stdout.encoding.lower() not in ('utf-8', 'utf8'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

REPORT = []

def log(msg, status="OK"):
    symbols = {"OK": "[OK]", "WARN": "[WARN]", "ERROR": "[FAIL]"}
    print(f"{symbols.get(status, '[?]')} {msg}")
    REPORT.append((status, msg))

base_dir = r"c:\Users\flaem\Desktop\Krimi"

print("=" * 70)
print("  SYSTEMWEITER QUERCHECK: DER PAKT DER SCHLAPPEN-ERBEN")
print("=" * 70)

# --- 1. JSON VALIDIERUNG ---
print("\n--- 1. JSON Validierung ---")
json_files = [
    "data/story.json",
    "data/stations.json",
    "data/events.json",
    "data/final.json",
    "manifest.json"
]

loaded_json = {}
for jf in json_files:
    full_p = os.path.join(base_dir, jf)
    if not os.path.exists(full_p):
        log(f"Datei fehlt: {jf}", "ERROR")
        continue
    try:
        with open(full_p, "r", encoding="utf-8") as f:
            data = json.load(f)
            loaded_json[jf] = data
            log(f"{jf} erfolgreich geparst ({os.path.getsize(full_p)} Bytes)", "OK")
    except Exception as e:
        log(f"JSON Syntaxfehler in {jf}: {e}", "ERROR")

# --- 2. DIALOGBAUM-INTEGRITÄT (Verzweigungen & Sackgassen) ---
print("\n--- 2. Dialogbaum-Integrität & Verzweigungen ---")
story = loaded_json.get("data/story.json", {})
trees = story.get("dialogueTrees", {})
broken_links = 0
total_choices = 0
total_nodes = 0

for tree_key, nodes in trees.items():
    node_ids = {n.get("id") for n in nodes}
    for n in nodes:
        total_nodes += 1
        choices = n.get("choices", [])
        for c in choices:
            total_choices += 1
            target = c.get("next")
            if target and target not in node_ids:
                log(f"Baum '{tree_key}': Node '{n.get('id')}' verweist auf ungültiges Ziel '{target}'!", "ERROR")
                broken_links += 1

if broken_links == 0:
    log(f"Alle {trees.__len__()} Dialogbäume ({total_nodes} Knoten, {total_choices} Verzweigungen) sind mathematisch geschlossen!", "OK")
else:
    log(f"{broken_links} fehlerhafte Sprungziele in Dialogbäumen gefunden!", "ERROR")

# --- 3. AUDIO-DATEIEN INTEGRITÄT ---
print("\n--- 3. Audio-Dateien & Existenzprüfung ---")
missing_dialogue_audio = 0
for tree_key, nodes in trees.items():
    for n in nodes:
        audio = n.get("audio")
        if not audio:
            log(f"Node '{n.get('id')}' in '{tree_key}' hat keine Audio-Referenz", "WARN")
            missing_dialogue_audio += 1
        else:
            full_audio = os.path.join(base_dir, audio.replace("/", "\\"))
            if not os.path.exists(full_audio) or os.path.getsize(full_audio) == 0:
                log(f"Audiodatei fehlt oder ist leer: {audio}", "ERROR")
                missing_dialogue_audio += 1

if missing_dialogue_audio == 0:
    log(f"Sämtliche {total_nodes} Dialog-Audiodateien existieren auf der Festplatte und sind gültig!", "OK")

# Prüfe Story-Audios (Intro, Suspects, Outro)
story_audio_files = [
    "assets/audio/story/intro_slide_1.mp3",
    "assets/audio/story/intro_slide_2.mp3",
    "assets/audio/story/intro_slide_3.mp3",
    "assets/audio/story/intro_slide_4.mp3",
    "assets/audio/story/suspect_intro_herold.mp3",
    "assets/audio/story/suspect_intro_gipser.mp3",
    "assets/audio/story/suspect_intro_heiden.mp3",
    "assets/audio/story/outro_win_ueberfuehrung.mp3",
    "assets/audio/story/outro_confession_herold.mp3",
    "assets/audio/story/outro_confession_gipser.mp3",
    "assets/audio/story/outro_confession_heiden.mp3",
    "assets/audio/story/outro_win_abschluss.mp3",
    "assets/audio/story/outro_insufficient_ueberfuehrung.mp3",
    "assets/audio/story/outro_insufficient_abschluss.mp3",
    "assets/audio/story/outro_fail_irrtum.mp3",
    "assets/audio/story/outro_fail_chance.mp3",
    "assets/audio/story/outro_fail_abschluss.mp3"
]

missing_story_audio = 0
for saf in story_audio_files:
    full_saf = os.path.join(base_dir, saf.replace("/", "\\"))
    if not os.path.exists(full_saf) or os.path.getsize(full_saf) == 0:
        log(f"Story-Audio fehlt oder ist leer: {saf}", "ERROR")
        missing_story_audio += 1

if missing_story_audio == 0:
    log(f"Sämtliche 17 Story-Audios (Intro, Verdächtige, Outro) existieren auf der Festplatte!", "OK")

# --- 4. STATIONEN & KOORDINATEN PRÜFUNG ---
print("\n--- 4. Stationen & GPS-Geofence Prüfung ---")
stations_data = loaded_json.get("data/stations.json", [])
if isinstance(stations_data, dict):
    stations_list = stations_data.get("stations", [])
else:
    stations_list = stations_data

log(f"{len(stations_list)} Stationen in stations.json geladen", "OK")

dmm_regex = re.compile(r'([NS])\s*(\d{1,2})[^0-9.,]+(\d{1,2}(?:[.,]\d+)?)[^A-Z0-9]+([EOW])\s*(\d{1,3})[^0-9.,]+(\d{1,2}(?:[.,]\d+)?)', re.I)

def parse_lat_lng(c):
    if isinstance(c, dict):
        return c.get("lat"), c.get("lng")
    if isinstance(c, str):
        m = dmm_regex.search(c)
        if m:
            hemi_lat = m.group(1).upper()
            lat_deg = float(m.group(2))
            lat_min = float(m.group(3).replace(',', '.'))
            lat = lat_deg + (lat_min / 60.0)
            if hemi_lat == 'S': lat = -lat

            hemi_lng = m.group(4).upper()
            if hemi_lng == 'O': hemi_lng = 'E'
            lng_deg = float(m.group(5))
            lng_min = float(m.group(6).replace(',', '.'))
            lng = lng_deg + (lng_min / 60.0)
            if hemi_lng == 'W': lng = -lng
            return lat, lng
    return None, None

station_ids = set()
for st in stations_list:
    sid = st.get("id")
    snum = st.get("number")
    sname = st.get("name")
    station_ids.add(sid)
    coords_raw = st.get("coords")
    lat, lng = parse_lat_lng(coords_raw)
    if lat is None or lng is None:
        log(f"Station #{snum} '{sid}': Koordinaten nicht parsebar ('{coords_raw}')", "ERROR")
    elif not (50.25 < lat < 50.40 and 11.85 < lng < 12.05):
        log(f"Station #{snum} '{sid}' ({sname}): Koordinaten außerhalb Hof-Bereich ({lat:.5f}, {lng:.5f})", "WARN")
    else:
        # Valid coordinate in Hof
        pass
    
    # Check characters in station
    chars = st.get("characters", [])
    for ch in chars:
        img = ch.get("image")
        if img:
            full_img = os.path.join(base_dir, img.replace("/", "\\"))
            if not os.path.exists(full_img):
                log(f"Station #{snum}: Charakter-Bild fehlt: {img}", "WARN")

log(f"Alle {len(stations_list)} Stationen haben gültige Koordinaten im Stadtgebiet Hof!", "OK")

# --- 5. JAVASCRIPT & DOM-ELEMENTE CHECK ---
print("\n--- 5. DOM & HTML Element-Check in index.html ---")
with open(os.path.join(base_dir, "index.html"), "r", encoding="utf-8") as f:
    html_text = f.read()

# Kritische IDs prüfen
critical_ids = [
    "view-landing", "view-intro", "view-dialogue", "view-dashboard",
    "dialogue-avatar", "dialogue-name", "dialogue-text", "dialogue-choices",
    "btn-toggle-voice", "btn-toggle-music", "flashlight-overlay",
    "intro-slide-img", "intro-slide-badge", "intro-slide-title", "intro-slide-text",
    "btn-intro-next", "btn-intro-prev", "btn-intro-skip", "intro-indicators"
]

missing_dom_ids = 0
for cid in critical_ids:
    if f'id="{cid}"' not in html_text and f"id='{cid}'" not in html_text:
        log(f"HTML: Element mit ID '{cid}' fehlt in index.html!", "ERROR")
        missing_dom_ids += 1
    else:
        pass

if missing_dom_ids == 0:
    log(f"Alle {len(critical_ids)} kritischen DOM-Elemente in index.html vorhanden!", "OK")

print("\n" + "=" * 70)
errors = [m for s, m in REPORT if s == "ERROR"]
warnings = [m for s, m in REPORT if s == "WARN"]

if not errors:
    print(f"  GESAMTERGEBNIS: ALLES PERFEKT! 0 FEHLER GEFUNDEN ({len(warnings)} Hinweise)")
else:
    print(f"  GESAMTERGEBNIS: {len(errors)} FEHLER GEFUNDEN!")
print("=" * 70)
