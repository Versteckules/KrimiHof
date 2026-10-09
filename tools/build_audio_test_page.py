import json
import os
import re

with open(r'c:\Users\flaem\Desktop\Krimi\data\story.json', 'r', encoding='utf-8') as f:
    story = json.load(f)

# Stimme-Details für die Anzeige
VOICE_META = {
    "Valentin Herold": { "gender": "m", "category": "suspect", "role": "Antiquitätenhändler & Sammler", "age": "58 Jahre", "voice": "de-DE-FlorianMultilingual (-3Hz, +20%)", "vibe": "Aristokratisch, zynisch, geistig überlegen" },
    "Valentin Herold (Telefon)": { "gender": "m", "category": "suspect", "role": "Geheimer Telefonkontakt", "age": "58 Jahre", "voice": "de-DE-FlorianMultilingual (-2Hz, +22%)", "vibe": "Zynischer nächtlicher Anruf" },
    "Katharina von Gipser": { "gender": "f", "category": "suspect", "role": "Stadträtin & Investorin", "age": "46 Jahre", "voice": "de-DE-KatjaNeural (+1Hz, +24%)", "vibe": "Kühl, geschäftsmäßig, schneidend" },
    "Katharina von Gipser (Telefon)": { "gender": "f", "category": "suspect", "role": "Geheimer Telefonkontakt", "age": "46 Jahre", "voice": "de-DE-KatjaNeural (+2Hz, +26%)", "vibe": "Unterkühlt, distanziert am Hörer" },
    "Severin Heiden": { "gender": "m", "category": "suspect", "role": "Domorganist St. Michaelis", "age": "62 Jahre", "voice": "de-DE-ConradNeural (-9Hz, +18%)", "vibe": "Asketisch, düster, getragen, fanatisch" },
    "Severin Heiden (Telefon)": { "gender": "m", "category": "suspect", "role": "Geheimer Telefonkontakt", "age": "62 Jahre", "voice": "de-DE-ConradNeural (-8Hz, +20%)", "vibe": "Unheilvolle Warnung per Telefon" },
    
    "Kommissar Stahl": { "gender": "m", "category": "investigation", "role": "Einsatzleiter Polizei Hof", "age": "55 Jahre", "voice": "de-DE-ConradNeural (-4Hz, +25%)", "vibe": "Übermüdet, streng, dienstliche Autorität" },
    "Wachmann Rolf": { "gender": "m", "category": "investigation", "role": "Rathaus-Wachmann (bestochen)", "age": "45 Jahre", "voice": "de-DE-FlorianMultilingual (-6Hz, +24%)", "vibe": "Nervös, schuldbewusst, schwitzend" },
    "Archivgehilfe Max": { "gender": "m", "category": "investigation", "role": "Mitarbeiter Stadtarchiv", "age": "22 Jahre", "voice": "de-DE-KillianNeural (+5Hz, +28%)", "vibe": "Jung, hastig, eingeschüchtert" },
    "Paul Stift": { "gender": "m", "category": "investigation", "role": "Lokalreporter Frankenpost", "age": "30 Jahre", "voice": "de-DE-KillianNeural (+1Hz, +30%)", "vibe": "Forsch, sensationsgierig, zackig" },

    "Wärschtlamo Karl": { "gender": "m", "category": "witness", "role": "Hofer Original · Sonnenplatz", "age": "60 Jahre", "voice": "de-AT-JonasNeural (-5Hz, +25%)", "vibe": "Fränkisch-gemütlich, volksnah, herzlich" },
    "Schankwirtin Erna": { "gender": "f", "category": "witness", "role": "Wirtin Schwarzer Kater", "age": "56 Jahre", "voice": "de-AT-IngridNeural (-3Hz, +24%)", "vibe": "Kernig, warmherzig, resolut" },
    "Schwester Maria": { "gender": "f", "category": "witness", "role": "Ordensschwester St. Lorenz", "age": "35 Jahre", "voice": "de-DE-AmalaNeural (+3Hz, +22%)", "vibe": "Sanft, andächtig, gütig" },
    "Lisa": { "gender": "f", "category": "witness", "role": "Studentin / Augenzeugin", "age": "23 Jahre", "voice": "de-DE-SeraphinaMultilingual (+4Hz, +27%)", "vibe": "Jung, lebendig, aufgeregt" },
    "Dr. Blume": { "gender": "f", "category": "witness", "role": "Amtsärztin / Gutachterin", "age": "42 Jahre", "voice": "de-DE-KatjaNeural (-2Hz, +25%)", "vibe": "Analytisch, unbestechlich, sachlich" },
    "Mesnerin Gertrud": { "gender": "f", "category": "witness", "role": "Kirchenaufsicht St. Lorenz", "age": "63 Jahre", "voice": "de-AT-IngridNeural (-6Hz, +20%)", "vibe": "Streng, älter, skeptisch" },
    "Pfarrer Klement": { "gender": "m", "category": "witness", "role": "Geistlicher St. Lorenz", "age": "66 Jahre", "voice": "de-DE-FlorianMultilingual (-7Hz, +18%)", "vibe": "Würdevoll, väterlich, getragene Kanzelstimme" },
    "Fischer Jan": { "gender": "m", "category": "witness", "role": "Saale-Fischer am Unteren Tor", "age": "52 Jahre", "voice": "de-DE-ConradNeural (-7Hz, +22%)", "vibe": "Wettergegerbt, knorrig, misstrauisch" },
    "Käpt'n": { "gender": "m", "category": "witness", "role": "Ausflugsboot Untreusee", "age": "64 Jahre", "voice": "de-DE-ConradNeural (-12Hz, +20%)", "vibe": "Alter Seebär, bassig, brummig" },
    "Kurier Sepp": { "gender": "m", "category": "witness", "role": "Nachtkurier Hauptpost", "age": "40 Jahre", "voice": "de-CH-JanNeural (-4Hz, +25%)", "vibe": "Genervt, pragmatisch, wenig Worte" },
    "Gärtner Huber": { "gender": "m", "category": "witness", "role": "Parkgärtner Bürgerpark", "age": "54 Jahre", "voice": "de-AT-JonasNeural (-9Hz, +20%)", "vibe": "Mürrisch, einsilbig, tief" },
    "Schattenhafter Bote": { "gender": "m", "category": "witness", "role": "Geheimbund-Verbindungsmann", "age": "Unbekannt", "voice": "de-DE-ConradNeural (-14Hz, +16%)", "vibe": "Gefährlich, unheimlich, abgründig" }
}

trees = story.get('dialogueTrees', {})
characters_data = []

# Sammle ersten gesprochenen Satz jedes Charakters
seen = set()
for tkey, nodes in trees.items():
    for n in nodes:
        sp = n.get('speaker', 'Unbekannt')
        if sp not in seen and n.get('audio'):
            seen.add(sp)
            meta = VOICE_META.get(sp, {
                "gender": "m",
                "category": "witness",
                "role": "Zeuge",
                "age": "Unbekannt",
                "voice": "de-DE-ConradNeural",
                "vibe": "Standard"
            })
            characters_data.append({
                "id": re.sub(r'[^a-zA-Z0-9_]', '_', sp),
                "name": sp,
                "role": meta["role"],
                "gender": meta["gender"],
                "category": meta["category"],
                "age": meta["age"],
                "avatar": n.get('avatar', 'assets/avatar.jpg'),
                "voiceDetails": meta["voice"],
                "vibe": meta["vibe"],
                "quote": n.get('text', '').replace('{PLAYER_NAME}', 'Ermittler'),
                "src": n.get('audio')
            })

# Story Audios hinzufügen
STORY_SHOWCASE = [
    {
        "id": "story_intro_1",
        "name": "Intro • Kapitel 1: Historie",
        "role": "Tagesschau / Radiostimme (Erzähler)",
        "gender": "m",
        "category": "story",
        "age": "Radiosprecher",
        "avatar": "assets/intro_fire_1823.jpg",
        "voiceDetails": "de-DE-Conrad (+1Hz, +25%) - Seriös & Sonor",
        "vibe": "Klassische Dokumentar- & Nachrichtensprecher-Stimme",
        "quote": "4. September 1823. Die Flammen von Hof. Ein verheerendes Feuer vernichtet über zweihundert Häuser der Hofer Altstadt...",
        "src": "assets/audio/story/intro_slide_1.mp3"
    },
    {
        "id": "story_intro_4",
        "name": "Intro • Kapitel 4: Der Auftrag",
        "role": "Tagesschau / Radiostimme (Erzähler)",
        "gender": "m",
        "category": "story",
        "age": "Radiosprecher",
        "avatar": "assets/hero_hof_night.jpg",
        "voiceDetails": "de-DE-Conrad (+1Hz, +25%) - Seriös & Sonor",
        "vibe": "Aufbruch zur nächtlichen Ermittlung",
        "quote": "Ermittler, übernehmen Sie! Deine Jagd beginnt am Rathaus. Sichere Spuren an zwölf Stationen quer durch das nächtliche Hof...",
        "src": "assets/audio/story/intro_slide_4.mp3"
    },
    {
        "id": "story_suspect_herold",
        "name": "Rathaus-Abschluss • Valentin Herold",
        "role": "Tagesschau / Radiostimme (Erzähler)",
        "gender": "m",
        "category": "story",
        "age": "Radiosprecher",
        "avatar": "assets/suspect_herold.webp",
        "voiceDetails": "de-DE-Conrad (+1Hz, +25%) - Seriös & Sonor",
        "vibe": "Profil-Präsentation Hauptverdächtiger 1",
        "quote": "Hauptverdächtiger 1: Valentin Herold. Antiquitätenhändler und Kunstsammler. Er wollte die unschätzbaren Original-Urkunden des Bundes von 1823 an einen internationalen Schattenmarkt veräußern.",
        "src": "assets/audio/story/suspect_intro_herold.mp3"
    },
    {
        "id": "story_suspect_gipser",
        "name": "Rathaus-Abschluss • Katharina von Gipser",
        "role": "Tagesschau / Radiostimme (Erzähler)",
        "gender": "m",
        "category": "story",
        "age": "Radiosprecher",
        "avatar": "assets/suspect_gipser.webp",
        "voiceDetails": "de-DE-Conrad (+1Hz, +25%) - Seriös & Sonor",
        "vibe": "Profil-Präsentation Hauptverdächtige 2",
        "quote": "Hauptverdächtige 2: Katharina von Gipser. Kommunalpolitikerin und Immobilieninvestorin. Die uralten Erbrechte im Bundespakt hätten ihre millionenschweren Bauprojekte am Saaleufer auf der Stelle blockiert.",
        "src": "assets/audio/story/suspect_intro_gipser.mp3"
    },
    {
        "id": "story_suspect_heiden",
        "name": "Rathaus-Abschluss • Severin Heiden",
        "role": "Tagesschau / Radiostimme (Erzähler)",
        "gender": "m",
        "category": "story",
        "age": "Radiosprecher",
        "avatar": "assets/suspect_heiden.webp",
        "voiceDetails": "de-DE-Conrad (+1Hz, +25%) - Seriös & Sonor",
        "vibe": "Profil-Präsentation Hauptverdächtiger 3",
        "quote": "Hauptverdächtiger 3: Severin Heiden. Domorganist und Chorleiter an St. Michaelis. Ein fanatischer Traditionstreuer, der das Vermächtnis der Schlappen-Erben vor profaner Entweihung schützen wollte.",
        "src": "assets/audio/story/suspect_intro_heiden.mp3"
    },
    {
        "id": "story_outro_win",
        "name": "Outro • Die Falle schnappt zu (Sieg)",
        "role": "Tagesschau / Radiostimme (Erzähler)",
        "gender": "m",
        "category": "story",
        "age": "Radiosprecher",
        "avatar": "assets/diploma_banner.jpg",
        "voiceDetails": "de-DE-Conrad (+1Hz, +25%) - Seriös & Sonor",
        "vibe": "Überführung des wahren Mörders",
        "quote": "Die Falle schnappt zu! Mit wasserdichten Beweisen konfrontierst du den Verdächtigen. Unter der erdrückenden Last der Indizien bricht der Täter schließlich zusammen.",
        "src": "assets/audio/story/outro_win_ueberfuehrung.mp3"
    },
    {
        "id": "story_outro_confession_gipser",
        "name": "Outro • Geständnis Katharina von Gipser",
        "role": "Haupttäterin (Geständnis)",
        "gender": "f",
        "category": "story",
        "age": "46 Jahre",
        "avatar": "assets/suspect_gipser.webp",
        "voiceDetails": "KatjaNeural (+1Hz, +24%)",
        "vibe": "Verzweifeltes Geständnis im Finale",
        "quote": "Sie begreifen gar nichts! Mein Bauprojekt hätte Hof in die Zukunft katapultiert! Diese verstaubten Rechte von 1823 hätten alles blockiert. Ich musste dieses Archiv zum Schweigen bringen!",
        "src": "assets/audio/story/outro_confession_gipser.mp3"
    },
    {
        "id": "story_outro_fail",
        "name": "Outro • Ein fataler Irrtum (Niederlage)",
        "role": "Tagesschau / Radiostimme (Erzähler)",
        "gender": "m",
        "category": "story",
        "age": "Radiosprecher",
        "avatar": "assets/kommissar_stahl.jpg",
        "voiceDetails": "de-DE-Conrad (+1Hz, +25%) - Seriös & Sonor",
        "vibe": "Der Täter entkommt ungestraft",
        "quote": "Ein fataler Irrtum! Du hast den Falschen! Du konfrontierst die falsche Person. Doch sie lacht dich nur aus und weist jede Schuld souverän von sich. Deine Theorie bricht in sich zusammen.",
        "src": "assets/audio/story/outro_fail_irrtum.mp3"
    }
]

characters_data.extend(STORY_SHOWCASE)

html_content = f'''<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vollständiges Stimmen-Casting (22 Charaktere + Story) - Der Pakt der Schlappen-Erben</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap" rel="stylesheet">
  
  <style>
    :root {{
      --bg-dark: #0a0e17;
      --card-bg: rgba(18, 26, 43, 0.85);
      --card-border: rgba(212, 163, 89, 0.25);
      --card-hover-border: #d4a359;
      --gold: #d4a359;
      --gold-light: #f5d79e;
      --gold-glow: rgba(212, 163, 89, 0.35);
      --text-main: #f0f3f8;
      --text-muted: #94a3b8;
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}

    body {{
      background: radial-gradient(circle at 50% 20%, #151f33 0%, #080c14 100%);
      color: var(--text-main);
      font-family: 'Inter', -apple-system, sans-serif;
      min-height: 100vh;
      padding: 30px 15px 60px;
    }}

    .container {{ max-width: 950px; margin: 0 auto; }}

    header {{
      text-align: center;
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--card-border);
    }}

    .badge-top {{
      display: inline-block;
      padding: 5px 14px;
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid #10b981;
      color: #6ee7b7;
      border-radius: 20px;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
      font-weight: 700;
    }}

    h1 {{
      font-family: 'Playfair Display', serif;
      font-size: 2.3rem;
      color: #ffffff;
      margin-bottom: 8px;
    }}

    p.subtitle {{
      color: var(--text-muted);
      font-size: 1.05rem;
      max-width: 700px;
      margin: 0 auto 15px;
      line-height: 1.5;
    }}

    .filter-bar {{
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 25px;
      flex-wrap: wrap;
    }}

    .tab-btn {{
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.2);
      color: #cbd5e1;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }}
    .tab-btn:hover, .tab-btn.active {{
      background: var(--gold);
      color: #000;
      border-color: var(--gold);
    }}

    .bgm-bar {{
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      background: rgba(10, 14, 23, 0.7);
      padding: 10px 18px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      max-width: 600px;
      margin: 0 auto 25px;
      flex-wrap: wrap;
    }}

    .btn-toggle-bgm {{
      background: rgba(212, 163, 89, 0.2);
      border: 1px solid var(--gold);
      color: var(--gold-light);
      padding: 5px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }}
    .btn-toggle-bgm:hover, .btn-toggle-bgm.active {{
      background: var(--gold);
      color: #000;
    }}

    .grid {{
      display: flex;
      flex-direction: column;
      gap: 16px;
    }}

    .character-card {{
      background: var(--card-bg);
      backdrop-filter: blur(10px);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 18px 20px;
      display: flex;
      gap: 18px;
      align-items: center;
      transition: all 0.25s ease;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    }}

    .character-card:hover {{
      border-color: var(--card-hover-border);
      transform: translateY(-2px);
      box-shadow: 0 12px 30px var(--gold-glow);
    }}

    .character-card.is-playing {{
      border-color: var(--gold);
      background: rgba(24, 34, 56, 0.95);
      box-shadow: 0 0 25px var(--gold-glow);
    }}

    .avatar-wrapper {{
      position: relative;
      width: 78px;
      height: 78px;
      flex-shrink: 0;
    }}

    .avatar-img {{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      object-position: top;
      border: 2px solid var(--gold);
    }}

    .gender-badge {{
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      border: 2px solid var(--bg-dark);
      font-weight: bold;
    }}
    .gender-m {{ background: #0284c7; color: white; }}
    .gender-f {{ background: #e11d48; color: white; }}

    .char-info {{ flex-grow: 1; }}

    .char-header {{
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
      flex-wrap: wrap;
    }}

    .char-name {{
      font-family: 'Playfair Display', serif;
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
    }}

    .char-role {{
      font-size: 0.78rem;
      color: var(--gold-light);
      background: rgba(212, 163, 89, 0.15);
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid rgba(212, 163, 89, 0.3);
    }}

    .char-age {{
      font-size: 0.75rem;
      color: #94a3b8;
      background: rgba(255,255,255,0.06);
      padding: 2px 6px;
      border-radius: 4px;
    }}

    .voice-tag {{
      font-size: 0.75rem;
      color: #38bdf8;
      font-family: 'Courier Prime', monospace;
      margin-top: 2px;
    }}

    .vibe-tag {{
      font-size: 0.75rem;
      color: #a7f3d0;
      font-style: italic;
    }}

    .char-quote {{
      font-family: 'Courier Prime', monospace;
      color: #cbd5e1;
      font-size: 0.92rem;
      line-height: 1.45;
      margin-top: 8px;
      padding: 8px 12px;
      background: rgba(0, 0, 0, 0.35);
      border-left: 3px solid var(--gold);
      border-radius: 0 6px 6px 0;
    }}

    .audio-controls {{
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
      width: 75px;
    }}

    .play-btn {{
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gold) 0%, #b8860b 100%);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0a0e17;
      font-size: 1.4rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
      transition: all 0.2s ease;
    }}
    .play-btn:hover {{ transform: scale(1.08); box-shadow: 0 6px 20px var(--gold-glow); }}
    .play-btn:active {{ transform: scale(0.95); }}

    .play-status {{
      font-size: 0.72rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
    }}

    .action-bar {{
      margin-top: 35px;
      text-align: center;
      display: flex;
      justify-content: center;
      gap: 15px;
      flex-wrap: wrap;
    }}

    .btn-main {{
      background: var(--gold);
      color: #0a0e17;
      border: none;
      padding: 12px 24px;
      font-size: 0.95rem;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
    }}
    .btn-main:hover {{ background: var(--gold-light); transform: translateY(-2px); }}
  </style>
</head>
<body>

  <div class="container">
    <header>
      <div class="badge-top">✓ Alle 248 Dialog-Zeilen &amp; 17 Story-Audios vertont</div>
      <h1>Stimmen-Casting &amp; Hörproben</h1>
      <p class="subtitle">
        Jede Spielfigur besitzt eine maßgeschneiderte Charakterstimme (+25% Tempo). 
        Zusätzlich sind <strong>Intro, Hauptverdächtigen-Präsentation und Outro mit einer sonoren Tagesschau- / Radiostimme</strong> vertont!
      </p>

      <div class="filter-bar">
        <button class="tab-btn active" onclick="filterCategory('all')">Alle Stimmen</button>
        <button class="tab-btn" onclick="filterCategory('story')">📻 Tagesschau / Radiostimme (Intro &amp; Outro)</button>
        <button class="tab-btn" onclick="filterCategory('suspect')">Hauptverdächtige</button>
        <button class="tab-btn" onclick="filterCategory('investigation')">Polizei &amp; Presse</button>
        <button class="tab-btn" onclick="filterCategory('witness')">Hofer Zeugen</button>
      </div>

      <div class="bgm-bar">
        <span style="font-size: 0.85rem; color: var(--text-muted);">Atmosphärische Musik:</span>
        <button id="btn-bgm" class="btn-toggle-bgm" onclick="toggleBGM()">▶ Musik starten</button>

        <span style="font-size: 0.85rem; color: var(--text-muted); margin-left: 10px;">Zusätzliches Tempo:</span>
        <button class="btn-toggle-bgm speed-btn active" id="spd-100" onclick="setSpeed(1.0)">1.0x</button>
        <button class="btn-toggle-bgm speed-btn" id="spd-115" onclick="setSpeed(1.15)">1.15x</button>
        <button class="btn-toggle-bgm speed-btn" id="spd-125" onclick="setSpeed(1.25)">1.25x</button>
      </div>
    </header>

    <div class="grid" id="samples-container"></div>

    <div class="action-bar">
      <a href="index.html" class="btn-main">
        🎮 Hauptspiel starten &amp; Intro anhören
      </a>
    </div>
  </div>

  <audio id="audio-bgm" src="assets/soundtrack.mp3" loop></audio>

  <script>
    const CHARACTERS = {json.dumps(characters_data, ensure_ascii=False, indent=2)};

    let currentAudio = null;
    let currentPlayingId = null;
    let currentSpeed = 1.0;
    let currentFilter = 'all';
    const bgmAudio = document.getElementById('audio-bgm');
    let isBgmPlaying = false;

    function renderCards() {{
      const container = document.getElementById('samples-container');
      container.innerHTML = '';

      const filtered = CHARACTERS.filter(c => currentFilter === 'all' || c.category === currentFilter);

      filtered.forEach(c => {{
        const card = document.createElement('div');
        card.className = 'character-card';
        card.id = 'card-' + c.id;

        card.innerHTML = `
          <div class="avatar-wrapper">
            <img src="${{c.avatar}}" alt="${{c.name}}" class="avatar-img">
            <span class="gender-badge ${{c.gender === 'm' ? 'gender-m' : 'gender-f'}}">
              ${{c.gender === 'm' ? '♂' : '♀'}}
            </span>
          </div>

          <div class="char-info">
            <div class="char-header">
              <span class="char-name">${{c.name}}</span>
              <span class="char-role">${{c.role}}</span>
              <span class="char-age">${{c.age}}</span>
            </div>
            <div class="voice-tag">Stimme: ${{c.voiceDetails}}</div>
            <div class="vibe-tag">Charakter: ${{c.vibe}}</div>
            <div class="char-quote">„${{c.quote}}“</div>
          </div>

          <div class="audio-controls">
            <button class="play-btn" id="btn-${{c.id}}" onclick="togglePlay('${{c.id}}')">
              ▶
            </button>
            <span class="play-status" id="status-${{c.id}}">Hören</span>
          </div>
        `;
        container.appendChild(card);
      }});
    }}

    function filterCategory(cat) {{
      currentFilter = cat;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');
      renderCards();
    }}

    function togglePlay(id) {{
      if (currentPlayingId === id && currentAudio && !currentAudio.paused) {{
        stopCurrent();
        return;
      }}
      stopCurrent();

      const char = CHARACTERS.find(c => c.id === id);
      if (!char) return;

      currentAudio = new Audio(char.src + '?t=' + Date.now());
      currentAudio.playbackRate = currentSpeed;
      currentPlayingId = id;

      const card = document.getElementById('card-' + id);
      const btn = document.getElementById('btn-' + id);
      const status = document.getElementById('status-' + id);

      if (card) card.classList.add('is-playing');
      if (btn) btn.textContent = '⏸';
      if (status) status.textContent = 'Spielt';

      duckBGM(true);

      currentAudio.play().catch(e => console.error(e));
      currentAudio.onended = () => stopCurrent();
    }}

    function stopCurrent() {{
      if (currentAudio) {{
        currentAudio.pause();
        currentAudio = null;
      }}
      if (currentPlayingId) {{
        const card = document.getElementById('card-' + currentPlayingId);
        const btn = document.getElementById('btn-' + currentPlayingId);
        const status = document.getElementById('status-' + currentPlayingId);
        if (card) card.classList.remove('is-playing');
        if (btn) btn.textContent = '▶';
        if (status) status.textContent = 'Hören';
        currentPlayingId = null;
      }}
      duckBGM(false);
    }}

    function toggleBGM() {{
      const btn = document.getElementById('btn-bgm');
      if (isBgmPlaying) {{
        bgmAudio.pause();
        isBgmPlaying = false;
        btn.textContent = '▶ Musik starten';
      }} else {{
        bgmAudio.volume = 0.35;
        bgmAudio.play().then(() => {{
          isBgmPlaying = true;
          btn.textContent = '⏸ Musik pausieren';
        }}).catch(e => console.warn(e));
      }}
    }}

    function duckBGM(isDucking) {{
      if (!isBgmPlaying || !bgmAudio) return;
      bgmAudio.volume = isDucking ? 0.08 : 0.35;
    }}

    function setSpeed(spd) {{
      currentSpeed = spd;
      document.querySelectorAll('.speed-btn').forEach(b => {{
        b.classList.remove('active');
        b.style.background = '';
        b.style.color = '';
      }});
      const activeBtn = document.getElementById('spd-' + Math.round(spd * 100));
      if (activeBtn) {{
        activeBtn.classList.add('active');
        activeBtn.style.background = 'var(--gold)';
        activeBtn.style.color = '#000';
      }}
      if (currentAudio) {{
        currentAudio.playbackRate = spd;
      }}
    }}

    renderCards();
  </script>
</body>
</html>
'''

with open(r'c:\Users\flaem\Desktop\Krimi\audio_test.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("audio_test.html erfolgreich mit Story-Audios aktualisiert!")
