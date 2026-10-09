# 📋 Anleitung: Ausführbare Dateien (.BAT & .EXE)

Diese Anleitung erklärt die im Projekt vorhandenen Stapelverarbeitungs- (**`.bat`**) und Programm-Dateien (**`.exe`**). Sie zeigt dir genau, welche Dateien du selbst per Doppelklick ausführen kannst, wofür sie da sind und welche du **nicht** anrühren solltest.

---

## 🟢 1. Dateien, die du selbst ausführen kannst & sollst

Diese drei `.bat`-Dateien befinden sich direkt im Hauptordner deines Projekts. Du kannst sie jederzeit gefahrlos per Doppelklick starten:

### 1️⃣ `START.bat`
* **Zweck:** Startet das Krimi-Spiel lokal.
* **Was passiert beim Klick?**
  1. Startet im Hintergrund den lokalen HTTP-Webserver auf Port 8080 (`http://localhost:8080`).
  2. Öffnet automatisch deinen Standard-Webbrowser mit dem Spiel.
* **Wann ausführen?**
  * Immer, wenn du das Spiel selbst spielen, testen oder jemandem vorführen möchtest.
* **Hinweis:** Das schwarze Konsolenfenster einfach im Hintergrund geöffnet lassen, solange du spielst. Zum Beenden das Konsolenfenster schließen.

---

### 2️⃣ `SPRACH_BACKUP_WIEDERHERSTELLEN.bat`
* **Zweck:** Stellt alle Dialoge, Texte und Audio-Verknüpfungen aus dem gesicherten Sprach-Backup wieder her.
* **Was passiert beim Klick?**
  1. Es öffnet sich ein Fenster mit einer Sicherheitsabfrage (`Möchten Sie das Sprach-Backup wiederherstellen? (J/N)`).
  2. Bei Eingabe von `J` (Ja) werden die sauberen Master-Dateien aus dem Ordner `backup/` 1:1 nach `data/` kopiert:
     * `data\story.json`
     * `data\stations.json`
     * `data\events.json`
     * `data\final.json`
  3. Bei Eingabe von `N` (Nein) wird der Vorgang ohne Änderungen abgebrochen.
* **Wann ausführen?**
  * Falls bei Bearbeitungen versehentlich Dialoge beschädigt wurden, Texte gelöscht wurden oder die Audio-Verknüpfungen verloren gegangen sind.
  * Dies ist dein **Sicherheitsnetz**: Es bringt das Spiel garantiert wieder auf den funktionierenden Stand des Betatests zurück.

---

### 3️⃣ `SPRACH_DATEIEN_AKTUALISIEREN.bat`
* **Zweck:** Generiert sämtliche MP3-Audiodateien (alle 248 Verhör-Dialogzeilen sowie Intro-, Verdächtigen- und Outro-Stimmen) vollautomatisch über die Neural-TTS-Engine neu.
* **Was passiert beim Klick?**
  1. Liest alle Texte aus `data\story.json`.
  2. Spricht jede Zeile mit der rollenspezifischen Charakterstimme (natürlich, mit +25% Sprechtempo).
  3. Speichert alle Dateien druckfrisch unter `assets\audio\dialogues\` und `assets\audio\story\`.
* **Wann ausführen?**
  * Nur nötig, wenn du in der Zukunft neue Dialogzeilen oder veränderte Texte in `story.json` geschrieben hast und diese mit neuer Sprachausgabe vertonen möchtest.
  * *Hinweis:* Für den aktuellen Betatest sind bereits alle 265 Audiodateien fertig generiert und geprüft – du musst dieses Skript jetzt also nicht zwingend ausführen.

---

## 📦 2. Archivierte Dateien (.EXE & alte Entwickler-Skripte)

Sämtliche älteren Hilfsprogramme und `.exe`-Dateien wurden sicher in den Unterordner **`archiv/`** verschoben. Sie stören dich im Hauptordner nicht mehr:

| Datei / Gruppe | Ordner | Hintergrund |
| :--- | :--- | :--- |
| **`fix_encoding.exe`** | Hauptordner | Reparatur-Werkzeug für Umlaute. Liegt griffbereit im Hauptordner, falls wider Erwarten Textkodierungen korrigiert werden müssen. |
| **`GenerateAllDialogues.exe`** | `archiv\tools_alt\` | Alter C#-Generator vor der Vertonung. Liegt sicher im Archiv, damit nicht versehentlich darauf geklickt wird. |
| **Alte Hilfsskripte** (`.cs`, `.ps1`) | `archiv\` & `archiv\tools_alt\` | Entwickler-Skripte aus der Aufbauphase. |

---

## 💡 Schnelle Übersicht für die Praxis

```text
Ich möchte das Spiel spielen / testen:
  👉 Doppelklick auf "START.bat"

Etwas ist an den Dialogen kaputtgegangen:
  👉 Doppelklick auf "SPRACH_BACKUP_WIEDERHERSTELLEN.bat" (Taste "J" drücken)

Ich habe neue Texte geschrieben und will neue MP3s generieren:
  👉 Doppelklick auf "SPRACH_DATEIEN_AKTUALISIEREN.bat"

Alle .exe Dateien:
  👉 Einfach ignorieren, keine Ausführung nötig.
```
