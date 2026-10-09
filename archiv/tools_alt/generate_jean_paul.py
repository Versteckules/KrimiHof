import asyncio
import edge_tts
import os
import re

VOICE = "de-DE-ConradNeural"
RATE = "+15%"
PITCH = "+3Hz"

dialogues = [
    (
        "assets/audio/dialogues/jean_paul_dialogue_start.mp3",
        "Sei gegrüßt im Reich der Schatten, Ermittler! Man nennt mich Jean Paul. Zweihundert Jahre wanderte ich durch diese Gassen. Du suchst die Wahrheit über den Pakt der Schlappen-Erben?"
    ),
    (
        "assets/audio/dialogues/jean_paul_dialogue_secret.mp3",
        "Die Zeit heilt keine Wunden, sie deckt sie nur mit Asche zu. Hüte dich vor dem, der das Feuer am Rathaus gelegt hat, nicht aus Wut, sondern aus kaltem Kalkül! Empfange meinen Segen, scharfsinniger Sucher."
    ),
    (
        "assets/audio/dialogues/jean_paul_dialogue_skeptic.mp3",
        "Haha! Ein wahrer Kriminalist zweifelt an allem, selbst an seinen eigenen Augen! Schwindel ist die Poesie des Raumes. Du gefällst mir, kühner Ermittler. Nimm diesen Rat mit in die Nacht."
    ),
    (
        "assets/audio/dialogues/jean_paul_dialogue_end_success.mp3",
        "Bringe das Licht der Gerechtigkeit nach Hof! Die Toten werden deinen Sieg besingen."
    )
]

base_dir = r"c:\Users\flaem\Desktop\Krimi"

async def generate():
    for rel_path, text in dialogues:
        full_p = os.path.join(base_dir, rel_path.replace("/", "\\"))
        print(f"Generiere: {rel_path}...")
        communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
        await communicate.save(full_p)
        print(f"  [OK] Gespeichert ({os.path.getsize(full_p)} Bytes)")

if __name__ == "__main__":
    asyncio.run(generate())
