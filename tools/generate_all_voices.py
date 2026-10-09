import asyncio
import json
import os
import re
import edge_tts

VOICE_CONFIG = {
    # Hauptverdächtige
    "Valentin Herold": {
        "voice": "de-DE-FlorianMultilingualNeural",
        "pitch": "-3Hz",
        "rate": "+20%",
        "desc": "Aristokratisch, zynisch, überlegen"
    },
    "Valentin Herold (Telefon)": {
        "voice": "de-DE-FlorianMultilingualNeural",
        "pitch": "-2Hz",
        "rate": "+22%",
        "desc": "Zynischer Anruf"
    },
    "Katharina von Gipser": {
        "voice": "de-DE-KatjaNeural",
        "pitch": "+1Hz",
        "rate": "+24%",
        "desc": "Kühl, geschäftsmäßig, autoritär"
    },
    "Katharina von Gipser (Telefon)": {
        "voice": "de-DE-KatjaNeural",
        "pitch": "+2Hz",
        "rate": "+26%",
        "desc": "Unterkühlt am Telefon"
    },
    "Severin Heiden": {
        "voice": "de-DE-ConradNeural",
        "pitch": "-9Hz",
        "rate": "+18%",
        "desc": "Düster, getragen, fanatisch"
    },
    "Severin Heiden (Telefon)": {
        "voice": "de-DE-ConradNeural",
        "pitch": "-8Hz",
        "rate": "+20%",
        "desc": "Unheilvoller Anruf"
    },

    # Polizei & Ermittlungsumfeld
    "Kommissar Stahl": {
        "voice": "de-DE-ConradNeural",
        "pitch": "-4Hz",
        "rate": "+25%",
        "desc": "Übermüdet, streng, polizeilich"
    },
    "Wachmann Rolf": {
        "voice": "de-DE-FlorianMultilingualNeural",
        "pitch": "-6Hz",
        "rate": "+24%",
        "desc": "Nervös, schuldbewusst, abwehrend"
    },
    "Archivgehilfe Max": {
        "voice": "de-DE-KillianNeural",
        "pitch": "+5Hz",
        "rate": "+28%",
        "desc": "Jung, hastig, verängstigt"
    },
    "Paul Stift": {
        "voice": "de-DE-KillianNeural",
        "pitch": "+1Hz",
        "rate": "+30%",
        "desc": "Forsch, sensationsgierig, zackig"
    },

    # Zeugen & Hofer Charaktere
    "Kurier Sepp": {
        "voice": "de-CH-JanNeural",
        "pitch": "-4Hz",
        "rate": "+25%",
        "desc": "Genervt, pragmatisch, brummig"
    },
    "Fischer Jan": {
        "voice": "de-DE-ConradNeural",
        "pitch": "-7Hz",
        "rate": "+22%",
        "desc": "Wettergegerbt, knorrig, misstrauisch"
    },
    "Käpt'n": {
        "voice": "de-DE-ConradNeural",
        "pitch": "-12Hz",
        "rate": "+20%",
        "desc": "Alter Seebär, bassig, knurrig"
    },
    "Wärschtlamo Karl": {
        "voice": "de-AT-JonasNeural",
        "pitch": "-5Hz",
        "rate": "+25%",
        "desc": "Fränkisch-gemütlich, volksnah, herzlich"
    },
    "Gärtner Huber": {
        "voice": "de-AT-JonasNeural",
        "pitch": "-9Hz",
        "rate": "+20%",
        "desc": "Mürrisch, einsilbig, tief"
    },
    "Pfarrer Klement": {
        "voice": "de-DE-FlorianMultilingualNeural",
        "pitch": "-7Hz",
        "rate": "+18%",
        "desc": "Würdevoll, väterlich, geistlich"
    },
    "Schattenhafter Bote": {
        "voice": "de-DE-ConradNeural",
        "pitch": "-14Hz",
        "rate": "+16%",
        "desc": "Gefährlich, unheimlich, abgründig"
    },
    "Schwester Maria": {
        "voice": "de-DE-AmalaNeural",
        "pitch": "+3Hz",
        "rate": "+22%",
        "desc": "Sanft, andächtig, gütig"
    },
    "Lisa": {
        "voice": "de-DE-SeraphinaMultilingualNeural",
        "pitch": "+4Hz",
        "rate": "+27%",
        "desc": "Jung, aufgeregt, lebendig"
    },
    "Dr. Blume": {
        "voice": "de-DE-KatjaNeural",
        "pitch": "-2Hz",
        "rate": "+25%",
        "desc": "Analytisch, unbestechlich, sachlich"
    },
    "Schankwirtin Erna": {
        "voice": "de-AT-IngridNeural",
        "pitch": "-3Hz",
        "rate": "+24%",
        "desc": "Kernig, warmherzig, resolut"
    },
    "Mesnerin Gertrud": {
        "voice": "de-AT-IngridNeural",
        "pitch": "-6Hz",
        "rate": "+20%",
        "desc": "Streng, älter, skeptisch"
    }
}

DEFAULT_VOICE = {
    "voice": "de-DE-ConradNeural",
    "pitch": "-4Hz",
    "rate": "+25%",
    "desc": "Standardstimme"
}

def clean_speech_text(raw_text):
    if not raw_text:
        return ""
    # 1. Spieler-Platzhalter durch Ermittler ersetzen
    text = raw_text.replace("{PLAYER_NAME}", "Ermittler")
    # 2. Regieanweisungen in Klammern entfernen (z. B. "(Atmet tief durch)")
    text = re.sub(r'\(.*?\)', '', text)
    # 3. Anführungszeichen säubern
    text = text.replace('"', '').replace('\'', '').strip()
    # 4. Mehrfache Leerzeichen und Zeilenumbrüche säubern
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Falls nach Bereinigung nichts übrig blieb (reine Regieanweisung)
    if not text:
        text = raw_text.replace("{PLAYER_NAME}", "Ermittler").replace('(', '').replace(')', '').strip()
    return text

async def process_node(sem, tree_key, node, out_dir):
    node_id = node.get("id", "node")
    speaker = node.get("speaker", "Unbekannt")
    raw_text = node.get("text", "")
    
    clean_text = clean_speech_text(raw_text)
    if not clean_text:
        return None
    
    cfg = VOICE_CONFIG.get(speaker, DEFAULT_VOICE)
    safe_tree = re.sub(r'[^a-zA-Z0-9_]', '_', tree_key)
    safe_node = re.sub(r'[^a-zA-Z0-9_]', '_', node_id)
    filename = f"{safe_tree}_{safe_node}.mp3"
    filepath = os.path.join(out_dir, filename)
    
    async with sem:
        for attempt in range(3):
            try:
                communicate = edge_tts.Communicate(
                    text=clean_text,
                    voice=cfg["voice"],
                    pitch=cfg["pitch"],
                    rate=cfg["rate"]
                )
                await communicate.save(filepath)
                # Relativer Pfad fürs Web
                rel_path = f"assets/audio/dialogues/{filename}"
                node["audio"] = rel_path
                return filepath
            except Exception as e:
                if attempt == 2:
                    print(f"Fehler bei {filename} ({speaker}): {e}")
                    return None
                await asyncio.sleep(1.0)

async def main():
    base_dir = r"c:\Users\flaem\Desktop\Krimi"
    story_path = os.path.join(base_dir, "data", "story.json")
    out_dir = os.path.join(base_dir, "assets", "audio", "dialogues")
    os.makedirs(out_dir, exist_ok=True)
    
    with open(story_path, "r", encoding="utf-8") as f:
        story = json.load(f)
        
    trees = story.get("dialogueTrees", {})
    sem = asyncio.Semaphore(5)  # 5 gleichzeitige Requests
    tasks = []
    total_nodes = 0
    
    for tree_key, nodes in trees.items():
        for node in nodes:
            total_nodes += 1
            tasks.append(process_node(sem, tree_key, node, out_dir))
            
    print(f"Starte Generierung von {total_nodes} Dialog-Zeilen für 22 Charaktere...")
    results = await asyncio.gather(*tasks)
    
    success_count = sum(1 for r in results if r is not None)
    print(f"Erfolgreich generiert: {success_count} von {total_nodes} Audiodateien.")
    
    # Aktualisiertes story.json mit audio-Pfaden speichern
    with open(story_path, "w", encoding="utf-8") as f:
        json.dump(story, f, indent=2, ensure_ascii=False)
    print(f"data/story.json erfolgreich mit Audio-Referenzen aktualisiert!")

if __name__ == "__main__":
    asyncio.run(main())
