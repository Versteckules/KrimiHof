import asyncio
import os
import edge_tts

# Sprecher-Profile
NARRATOR_VOICE = {
    "voice": "de-DE-ConradNeural",
    "pitch": "+1Hz",
    "rate": "+25%",
    "desc": "Tagesschau / Radiosprecher (seriös, akzentfrei, sonor)"
}

SUSPECT_VOICES = {
    "herold": {
        "voice": "de-DE-FlorianMultilingualNeural",
        "pitch": "-3Hz",
        "rate": "+20%"
    },
    "gipser": {
        "voice": "de-DE-KatjaNeural",
        "pitch": "+1Hz",
        "rate": "+24%"
    },
    "heiden": {
        "voice": "de-DE-ConradNeural",
        "pitch": "-9Hz",
        "rate": "+18%"
    }
}

STORY_AUDIO_ITEMS = [
    # --- INTRO (4 Slides) ---
    {
        "id": "intro_slide_1",
        "speaker": "narrator",
        "text": "4. September 1823. Die Flammen von Hof. Ein verheerendes Feuer vernichtet über zweihundert Häuser der Hofer Altstadt. Was die Chroniken als tragisches Unglück verzeichneten, war in Wahrheit der Deckmantel für einen ruchlosen Geheimvertrag: Den Pakt der Schlappen-Erben. Einflussreiche Patrizier nutzten die Feuersbrunst, um sich heimlich wertvollste Ländereien und Privilegien anzueignen."
    },
    {
        "id": "intro_slide_2",
        "speaker": "narrator",
        "text": "Gestern Abend. Der Fund im Kellergewölbe. Zwei Jahrhunderte später stieß der Hofer Stadtarchivar Dr. Renger im Gewölbe unter dem Rathaus auf die originalen Urkunden des Pakts. Doch bevor er die Beweise vorlegen konnte, wurde sein Büro verwüstet, die Geheimakten geraubt, und von Dr. Renger fehlt jede Spur! Nur eine panische Sprachnachricht blieb auf deinem Anrufbeantworter."
    },
    {
        "id": "intro_slide_3",
        "speaker": "narrator",
        "text": "Heute Nacht. Tatort Rathaus. Feueralarm im Rathaus! Dichter Rauch quillt aus dem Portal, Blaulicht zerschneidet den Regen, Absperrband flattert im Wind. Brandbeschleuniger wurde am Eichenportal verschüttet! Jemand will um jeden Preis verhindern, dass die Wahrheit über die Schlappen-Erben ans Tageslicht gelangt."
    },
    {
        "id": "intro_slide_4",
        "speaker": "narrator",
        "text": "Ermittler, übernehmen Sie! Deine Jagd beginnt am Rathaus. Sichere Spuren an zwölf Stationen quer durch das nächtliche Hof, befrage Zeugen und konfrontiere die drei Hauptverdächtigen. Entlarve den wahren Täter vor dem Morgengrauen, bevor alle Spuren für immer verglimmen!"
    },

    # --- HAUPTVERDÄCHTIGE NACH DEM RATHAUS (3 Slides) ---
    {
        "id": "suspect_intro_herold",
        "speaker": "narrator",
        "text": "Hauptverdächtiger 1: Valentin Herold. Antiquitätenhändler und Kunstsammler. Er wollte die unschätzbaren Original-Urkunden des Bundes von 1823 an einen internationalen Schattenmarkt veräußern."
    },
    {
        "id": "suspect_intro_gipser",
        "speaker": "narrator",
        "text": "Hauptverdächtige 2: Katharina von Gipser. Kommunalpolitikerin und Immobilieninvestorin. Die uralten Erbrechte im Bundespakt hätten ihre millionenschweren Bauprojekte am Saaleufer auf der Stelle blockiert."
    },
    {
        "id": "suspect_intro_heiden",
        "speaker": "narrator",
        "text": "Hauptverdächtiger 3: Severin Heiden. Domorganist und Chorleiter an St. Michaelis. Ein fanatischer Traditionstreuer, der das Vermächtnis der Schlappen-Erben vor profaner Entweihung schützen wollte."
    },

    # --- OUTRO: ERFOLG (Sieg >= 75%) ---
    {
        "id": "outro_win_ueberfuehrung",
        "speaker": "narrator",
        "text": "Die Falle schnappt zu! Mit wasserdichten Beweisen konfrontierst du den Verdächtigen. Unter der erdrückenden Last der Indizien bricht der Täter schließlich zusammen."
    },
    {
        "id": "outro_confession_herold",
        "speaker": "herold",
        "text": "Verflucht noch mal! Ja, ich wollte die Urkunden! Sie gehören nicht in dieses feuchte Stadtarchiv, sie gehören in die Hände wahrer Kenner! Ich hätte Millionen dafür bekommen!"
    },
    {
        "id": "outro_confession_gipser",
        "speaker": "gipser",
        "text": "Sie begreifen gar nichts! Mein Bauprojekt hätte Hof in die Zukunft katapultiert! Diese verstaubten Rechte von 1823 hätten alles blockiert. Ich musste dieses Archiv zum Schweigen bringen!"
    },
    {
        "id": "outro_confession_heiden",
        "speaker": "heiden",
        "text": "Das Vermächtnis unserer Gründerväter ist heilig! Ihr wolltet es für billige Profite verschachern! Das Feuer war Gottes Wille und die gerechte Reinigung für diesen Frevel!"
    },
    {
        "id": "outro_win_abschluss",
        "speaker": "narrator",
        "text": "Fall gelöst! Hinter Gittern! Der Pakt der Schlappen-Erben ist endgültig zerschlagen! Der Drahtzieher wird dem Haftrichter vorgeführt und zu einer langen Freiheitsstrafe verurteilt. Die historischen Urkunden sind sichergestellt."
    },

    # --- OUTRO: FREISPRUCH (< 75%) ---
    {
        "id": "outro_insufficient_ueberfuehrung",
        "speaker": "narrator",
        "text": "Zu wenig Beweise! Du konfrontierst den Verdächtigen. Zwar bricht er unter dem Druck zusammen und gesteht die Tat..."
    },
    {
        "id": "outro_insufficient_abschluss",
        "speaker": "narrator",
        "text": "Mangel an Beweisen! Doch der Triumph ist von kurzer Dauer. Die Beweislast reicht nicht aus. Ein teurer Staranwalt erwirkt einen Freispruch auf Kaution. Der Fall ist gelöst, aber der Drahtzieher ist auf freiem Fuß."
    },

    # --- OUTRO: NIEDERLAGE (Falscher Täter) ---
    {
        "id": "outro_fail_irrtum",
        "speaker": "narrator",
        "text": "Ein fataler Irrtum! Du hast den Falschen! Du konfrontierst die falsche Person. Doch sie lacht dich nur aus und weist jede Schuld souverän von sich. Deine Theorie bricht in sich zusammen."
    },
    {
        "id": "outro_fail_chance",
        "speaker": "narrator",
        "text": "Eine verpasste Chance. Während du Zeit mit dem Falschen vergeudet hast, hat der wahre Drahtzieher die Gelegenheit genutzt, alle Spuren zu verwischen!"
    },
    {
        "id": "outro_fail_abschluss",
        "speaker": "narrator",
        "text": "Der Pakt triumphiert! Die Akte wird geschlossen. Die Urkunden sind verschwunden und der Pakt der Schlappen-Erben agiert weiter aus den Schatten. Du hast versagt!"
    }
]

async def generate():
    out_dir = r"c:\Users\flaem\Desktop\Krimi\assets\audio\story"
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"Generiere {len(STORY_AUDIO_ITEMS)} Story-Audios (Intro, Verdächtige, Outro)...")
    for item in STORY_AUDIO_ITEMS:
        sp = item["speaker"]
        cfg = SUSPECT_VOICES.get(sp, NARRATOR_VOICE)
        filename = f"{item['id']}.mp3"
        filepath = os.path.join(out_dir, filename)
        
        print(f"Generiere: {filename} mit Stimme {cfg['voice']} ({cfg['pitch']}, {cfg['rate']})...")
        communicate = edge_tts.Communicate(
            text=item["text"],
            voice=cfg["voice"],
            pitch=cfg["pitch"],
            rate=cfg["rate"]
        )
        await communicate.save(filepath)
        print(f"Fertig: {filename} ({os.path.getsize(filepath)} Bytes)")

if __name__ == "__main__":
    asyncio.run(generate())
