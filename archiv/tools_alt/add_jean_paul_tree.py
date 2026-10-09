import json

tree = [
    {
        "id": "start",
        "speaker": "Jean Pauls Geist",
        "avatar": "assets/avatar.jpg",
        "text": "Sei gegrüßt im Reich der Schatten, Ermittler {PLAYER_NAME}! Man nennt mich Jean Paul. Zweihundert Jahre wanderte ich durch diese Gassen... Du suchst die Wahrheit über den Pakt der Schlappen-Erben?",
        "audio": "assets/audio/dialogues/jean_paul_dialogue_start.mp3",
        "choices": [
            {
                "text": "Verehrter Meister! Welches Geheimnis verbirgt der Pakt?",
                "next": "secret"
            },
            {
                "text": "Ein Geist?! Ich glaube nur an handfeste Beweise!",
                "next": "skeptic"
            }
        ]
    },
    {
        "id": "secret",
        "speaker": "Jean Pauls Geist",
        "avatar": "assets/avatar.jpg",
        "text": "Die Zeit heilt keine Wunden, sie deckt sie nur mit Asche zu. Hüte dich vor dem, der das Feuer am Rathaus gelegt hat – nicht aus Wut, sondern aus kaltem Kalkül! Empfange meinen Segen, scharfsinniger Sucher.",
        "audio": "assets/audio/dialogues/jean_paul_dialogue_secret.mp3",
        "choices": [
            {
                "text": "Ich danke Euch, Dichterfürst! (Geistersegen annehmen)",
                "next": "end_success"
            }
        ]
    },
    {
        "id": "skeptic",
        "speaker": "Jean Pauls Geist",
        "avatar": "assets/avatar.jpg",
        "text": "Haha! Ein wahrer Kriminalist zweifelt an allem, selbst an seinen eigenen Augen! Schwindel ist die Poesie des Raumes. Du gefällst mir, kühner Ermittler. Nimm diesen Rat mit in die Nacht.",
        "audio": "assets/audio/dialogues/jean_paul_dialogue_skeptic.mp3",
        "choices": [
            {
                "text": "Verratet mir Euren Rat! (Geistersegen annehmen)",
                "next": "end_success"
            }
        ]
    },
    {
        "id": "end_success",
        "speaker": "Jean Pauls Geist",
        "avatar": "assets/avatar.jpg",
        "text": "(Der Geist verbeugt sich feierlich und löst sich in blauem Sternenstaub auf) 'Bringe das Licht der Gerechtigkeit nach Hof! Die Toten werden deinen Sieg besingen.' [EASTER EGG GELÖST: +50 DETEKTIV-PUNKTE]",
        "audio": "assets/audio/dialogues/jean_paul_dialogue_end_success.mp3",
        "isEnd": True,
        "outcome": "OUTCOME_A"
    }
]

for p in ["data/story.json", "backup/SPRACH_BACKUP_story_dialoge.json"]:
    with open(p, "r", encoding="utf-8") as f:
        data = json.load(f)
    data.setdefault("dialogueTrees", {})["jean_paul_dialogue"] = tree
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Erfolgreich jean_paul_dialogue in {p} gespeichert!")
