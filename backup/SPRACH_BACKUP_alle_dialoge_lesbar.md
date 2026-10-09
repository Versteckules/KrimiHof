# Der Pakt der Schlappen-Erben: Vollständiges Dialog- & Textbuch
**Generiert:** Stand Oktober 2026  
**Umfang:** 22 Dialogbäume, 248 Verhör-Knoten, 17 Story-Audios  

---

## 1. Prolog & Rahmenhandlung

### Die Asche von 1823
In der Nacht des 4. September 1823 vernichtete ein verheerendes Feuer fast die gesamte Hofer Altstadt. Über zweihundert Gebäude sanken in Schutt und Asche. Doch was die Chroniken als tragischen Unfall verzeichneten, verbirgt ein düsteres Geheimnis: Den 'Pakt der Schlappen-Erben'. Eine verschworene Gemeinschaft mächtiger Bürger nutzte die Katastrophe, um sich unermessliche Liegenschaften und Handwerksprivilegien anzueignen.

Heute, über zwei Jahrhunderte später, stieß der renommierte Hofer Stadtarchivar Dr. Renger auf die vergilbten Originalverträge im Gewölbe unter dem Rathaus. Seit gestern Abend fehlt von ihm jede Spur. Seine verwüstete Arbeitsstube und eine panische Sprachnachricht sind alles, was blieb.

Ermittler {PLAYER_NAME}, deine Aufgabe ist es, in den nächtlichen Straßen von Hof die Fäden zusammenzuführen, die Beweise auf deiner Pinnwand zu verknüpfen und den wahren Drahtzieher vor dem Morgengrauen zu entlarven!

## 2. Die 3 Hauptverdächtigen & Motive

### Valentin Herold (`herold`)
* **Rolle:** Antiquitätenhändler & Kunstsammler
* **Alter:** 58 Jahre | **Ort:** Altstadt / Lorenzberg (N 50° 19.362 E 011° 55.212)
* **Motiv:** Machtgier & historischer Wert: Wollte die unschätzbaren Original-Urkunden und Goldschmuck-Relikte des Bundes von 1823 an einen internationalen Schattenmarkt veräußern.
* **Schlüssel-Beweis:** Antiquitäten-Futteral & Brandkassette
* **Beschreibung:** Eloquenter, stets elegant gekleideter Kunsthändler mit Samtweste und Gehstock. Kennt jeden historischen Keller in Hof, zeigt sich zynisch und betont herablassend gegenüber Behörden.

### Katharina von Gipser (`gipser`)
* **Rolle:** Kommunalpolitikerin & Immobilieninvestorin
* **Alter:** 46 Jahre | **Ort:** Neustadt / Karolinenstraße (N 50° 19.313 E 011° 55.033)
* **Motiv:** Kommerzielle Vertuschung: Wollte das Saaleufer sanieren. Die uralten Erbrechte im Bundespakt hätten ihre millionenschweren Bauprojekte augenblicklich blockiert.
* **Schlüssel-Beweis:** Notarieller Vorvertrag & gefälschtes Grundbuch
* **Beschreibung:** Einflussreiche Stadträtin mit exzellenten Kontakten in Politik und Wirtschaft. Kühle Rhetorik, maßgeschneiderte Kostüme, scheut keine Skrupel beim Schutz ihrer Investitionen.

### Severin Heiden (`heiden`)
* **Rolle:** Domorganist & Chorleiter an St. Michaelis
* **Alter:** 62 Jahre | **Ort:** Kirchplatz St. Michaelis (N 50° 19.137 E 011° 55.066)
* **Motiv:** Fanatische Traditionstreue: Sah sich als rechtmäßiger Nachfahre der Gründerväter und wollte das Vermächtnis der Schlappen-Erben vor profaner Entweihung schützen.
* **Schlüssel-Beweis:** Chiffriertes Notenblatt & Geheimbund-Siegel
* **Beschreibung:** Dürrer, asketischer Mann mit durchdringendem Blick und langen grauen Haaren. Verbringt seine Nächte allein an den Kirchenorgeln von Hof, spricht in biblischen Metaphern.

## 3. Die Geständnisse im Finale (Endings)

### Geständnis von Valentin Herold:
> „„Bravo, Ermittler {PLAYER_NAME}. Sie haben mich tatsächlich bis hierher verfolgt. Sehen Sie sich diese Dokumente an! Wissen Sie, was eine originale Brandurkunde von 1823 mit dem echten Ratssiegel einbringt? Ein Vermögen! Dr. Renger wollte sie dem Stadtmuseum schenken – welch sentimentale Verschwendung! Ich habe ihn im alten Eiskeller unter dem Lorenzberg festgesetzt. Keine Sorge, er lebt... aber der Pakt gehört mir!““

### Geständnis von Katharina von Gipser:
> „„Sie verstehen gar nichts, {PLAYER_NAME}! Hof braucht Zukunft, moderne Architektur, Investoren! Das Saaleufer liegt seit einem Jahrhundert brach, nur weil diese verstaubten Schlappen-Erben ein unkündbares Vorkaufsrecht besitzen! Ich musste Renger aufhalten! Ich habe die Urkunden in der Saale versenken lassen – so dachte ich jedenfalls. Mein politischer Untergang ist besiegelt.““

### Geständnis von Severin Heiden:
> „„Die Glocken läuten für die Wahrheit, {PLAYER_NAME}! Der Pakt der Schlappen-Erben war kein Verbrechen, er war das heilige Versprechen unserer Ahnen! Renger wollte unser Erbe profanieren, es der Sensationslust der Massen zum Fraß vorwerfen! Ich habe ihn im Glockenstuhl verwahrt, damit er die Erhabenheit unseres Schwurs begreift! Doch Ihre Beharrlichkeit zeigt mir: Der Bund hat einen neuen würdigen Hüter gefunden.““

---

## 4. Sämtliche 22 Verhör- & Dialogbäume im Detail

### Dialogbaum 1: `event_call_herold` — Valentin Herold (Telefon)
*Knotenanzahl: 3*

#### 📍 Knoten `[start]` — **Valentin Herold (Telefon)**
> „Sie schnüffeln in meinen Geschäften! Ich habe nichts mit dem Brand zu tun! Jemand will mir das anhängen!“

* **Audio:** `assets/audio/dialogues/event_call_herold_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 Wer sollte Ihnen etwas anhängen wollen? *(führt zu `[node_2]`, Impact: herold +5%)*
  * 💬 Ihre Ausreden ziehen bei mir nicht, Herold. *(führt zu `[node_3]`, Impact: herold +15%)*

#### 📍 Knoten `[node_2]` — **Valentin Herold (Telefon)**
> „Frau von Gipser! Sie will die Urkunden vernichten und mir den schwarzen Peter zuschieben. Halten Sie sich fern von mir!“

* **Audio:** `assets/audio/dialogues/event_call_herold_node_2.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (Gesprächsende)

#### 📍 Knoten `[node_3]` — **Valentin Herold (Telefon)**
> „Sie begehen einen großen Fehler. Wir sind hier fertig!“

* **Audio:** `assets/audio/dialogues/event_call_herold_node_3.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (Gesprächsende)

---

### Dialogbaum 2: `event_call_gipser` — Katharina von Gipser (Telefon)
*Knotenanzahl: 3*

#### 📍 Knoten `[start]` — **Katharina von Gipser (Telefon)**
> „Ihre Ermittlungen stören unsere Bauprojekte. Hören Sie auf, Gespenster zu jagen!“

* **Audio:** `assets/audio/dialogues/event_call_gipser_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 Die Gespenster von 1823 holen Sie gerade ein, Frau Stadträtin. *(führt zu `[node_2]`, Impact: gipser +15%)*
  * 💬 Haben Sie etwas zu verbergen? *(führt zu `[node_3]`, Impact: gipser +5%)*

#### 📍 Knoten `[node_2]` — **Katharina von Gipser (Telefon)**
> „Pah! Meine Anwälte werden sich mit Ihnen in Verbindung setzen!“

* **Audio:** `assets/audio/dialogues/event_call_gipser_node_2.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (Gesprächsende)

#### 📍 Knoten `[node_3]` — **Katharina von Gipser (Telefon)**
> „Ich bin eine vielbeschäftigte Frau. Belästigen Sie mich nicht weiter.“

* **Audio:** `assets/audio/dialogues/event_call_gipser_node_3.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (Gesprächsende)

---

### Dialogbaum 3: `event_call_heiden` — Severin Heiden (Telefon)
*Knotenanzahl: 3*

#### 📍 Knoten `[start]` — **Severin Heiden (Telefon)**
> „Das Feuer reinigt, Ermittler. Die Erben wachen über Hof. Stellen Sie sich nicht gegen das Schicksal!“

* **Audio:** `assets/audio/dialogues/event_call_heiden_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 Sie haben den Brand gelegt, geben Sie es zu! *(führt zu `[node_2]`, Impact: heiden +15%)*
  * 💬 Wo halten Sie Dr. Renger fest? *(führt zu `[node_3]`, Impact: heiden +5%)*

#### 📍 Knoten `[node_2]` — **Severin Heiden (Telefon)**
> „Die Flammen werden uns alle richten...“

* **Audio:** `assets/audio/dialogues/event_call_heiden_node_2.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (Gesprächsende)

#### 📍 Knoten `[node_3]` — **Severin Heiden (Telefon)**
> „Er ist dort, wo die Schatten am tiefsten sind...“

* **Audio:** `assets/audio/dialogues/event_call_heiden_node_3.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (Gesprächsende)

---

### Dialogbaum 4: `rathaus_fire_polizist` — Kommissar Stahl
*Knotenanzahl: 13*

#### 📍 Knoten `[start]` — **Kommissar Stahl**
> „Ermittler {PLAYER_NAME}! Gut, dass Sie hier sind. Das Stadtarchiv steht unter Wasser und Schutt, von Dr. Renger fehlt jede Spur. Ich habe die Absperrungen dichtgemacht. Was ist Ihr Ermittlungsansatz?“

* **Audio:** `assets/audio/dialogues/rathaus_fire_polizist_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Empathisch] Sie wirken übermüdet, Herr Kollege. Was haben Ihre Männer bisher am Brandherd festgestellt? *(führt zu `[stahl_empathic]`)*
  * 💬 [Sachlich] Konnten Anzeichen für Brandbeschleuniger oder ein gewaltsames Eindringen gesichert werden? *(führt zu `[stahl_factual]`)*
  * 💬 [Konfrontativ] Warum brauchten Ihre Streifenwagen fast zwanzig Minuten zum Brandort? Wurde der Notruf verzögert? *(führt zu `[stahl_confront]`)*

#### 📍 Knoten `[stahl_empathic]` — **Kommissar Stahl**
> „Seit gestern Früh auf den Beinen. Das Feuer brach um 21:45 Uhr im Archivgewölbe aus. Dr. Renger hatte bis spät gearbeitet. Die Löschtrupps fanden seine Brille auf dem Boden, aber von ihm selbst keine Spur.“

* **Audio:** `assets/audio/dialogues/rathaus_fire_polizist_stahl_empathic.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Gab es Zeugen, die jemanden flüchten sahen? *(führt zu `[stahl_escape]`)*
  * 💬 [Beweis vorlegen] Ich habe hier die Brandakte von 1823. Gibt es Parallelen? *(führt zu `[stahl_archive_eval]`, Benötigt Beweis: `evidence_fire_dossier`)*

#### 📍 Knoten `[stahl_factual]` — **Kommissar Stahl**
> „Die Brandfahnder fanden Reste von hochreinem Petroleum an den Türzargen. Ein Profi. Und die Haupttür war von außen verriegelt. Renger sollte offenbar verbrennen.“

* **Audio:** `assets/audio/dialogues/rathaus_fire_polizist_stahl_factual.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Welche Fluchtwege kommen in Betracht? *(führt zu `[stahl_escape]`)*
  * 💬 [Widerspruch aufdecken] Vorhin hieß es noch, die Absperrung war lückenlos. Kam wirklich niemand vorbei? *(führt zu `[stahl_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*

#### 📍 Knoten `[stahl_confront]` — **Kommissar Stahl**
> „Hüten Sie Ihre Zunge! Wir hatten zeitgleich einen Notruf am Bahnhof – Randale. Ich musste zwei Wagen abziehen. Hier war für knapp zehn Minuten nur ein Streifenposten vor Ort.“

* **Audio:** `assets/audio/dialogues/rathaus_fire_polizist_stahl_confront.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Widerspruch aufdecken] Erst behaupten Sie lückenlose Absperrung, und jetzt gaben Sie zehn Minuten unbewachten Hinterhof zu? *(führt zu `[stahl_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*
  * 💬 [Sachlich] Konzentrieren wir uns auf die Fakten. Wer nutzte diese zehn Minuten? *(führt zu `[stahl_escape]`)*
  * 💬 [Konfrontativ] Das riecht nach absichtlicher Sabotage. Haben Sie Mittäter in den eigenen Reihen?! *(führt zu `[stahl_fail]`)*

#### 📍 Knoten `[stahl_contra]` — **Kommissar Stahl**
> „(Atmet tief durch) Verdammt... Sie haben recht. Wir wurden ausmanövriert. Der Notruf am Bahnhof war ein Ablenkungsmanöver. Jemand schlich durch den Ratskeller und zerrte Renger heraus.“

* **Audio:** `assets/audio/dialogues/rathaus_fire_polizist_stahl_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Haben Sie Merkmale der Täter? *(führt zu `[stahl_escape_deep]`)*
  * 💬 [Beweis vorlegen] Hier ist die Löschakte. Sehen Sie sich die Notizen an. *(führt zu `[stahl_archive_eval]`, Benötigt Beweis: `evidence_fire_dossier`)*

#### 📍 Knoten `[stahl_escape]` — **Kommissar Stahl**
> „Zwei Spuren: Ein Passant sah eine schwarze Limousine mit hoher Geschwindigkeit in Richtung Karolinenstraße rasen. Und drüben im Biengässchen hörte man klackernde Schritte.“

* **Audio:** `assets/audio/dialogues/rathaus_fire_polizist_stahl_escape.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Welche Schritte genau? *(führt zu `[stahl_escape_deep]`)*
  * 💬 [Beweis vorlegen] Stimmt das mit diesem Foto der Limousine überein? *(führt zu `[stahl_photo_check]`, Impact: gipser +15%, Benötigt Beweis: `foto_gipser_auto`)*

#### 📍 Knoten `[stahl_escape_deep]` — **Kommissar Stahl**
> „Ein ungleichmäßiger Schritt – als würde jemand humpeln oder einen Stock aufsetzen. Ich gebe Ihnen die interne Einsatzskizze. Finden Sie Renger, bevor es zu spät ist!“

* **Audio:** `assets/audio/dialogues/rathaus_fire_polizist_stahl_escape_deep.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Dank] Ich übernehme die Spur. *(führt zu `[end_stahl_a]`)*

#### 📍 Knoten `[stahl_archive_eval]` — **Kommissar Stahl**
> „(Studiert das Dokument) Unglaublich... genau dieselbe Vorgehensweise wie beim Stadtbrand vor 200 Jahren. Dieselben Gebäude, dieselben Verstecke. Das ist das Werk eines geschichtskundigen Täters!“

* **Audio:** `assets/audio/dialogues/rathaus_fire_polizist_stahl_archive_eval.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Jemand wiederholt die Historie von 1823. *(führt zu `[end_stahl_a]`)*

#### 📍 Knoten `[stahl_photo_check]` — **Kommissar Stahl**
> „Ein Treffer! Kennzeichen HO-KG 1823... Das ist die Limousine aus den Regierungskreisen. Das sprengt alle Dimensionen. Gehen Sie der Spur sofort nach!“

* **Audio:** `assets/audio/dialogues/rathaus_fire_polizist_stahl_photo_check.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Ermitteln] Ich verfolge die Limousine. *(führt zu `[end_stahl_a]`)*

#### 📍 Knoten `[stahl_fail]` — **Kommissar Stahl**
> „Reichen Sie Dienstaufsichtsbeschwerde ein, wenn Sie wollen! Aber unterstellen Sie meinen Beamten keine Korruption. Verlassen Sie sofort meinen Tatort!“

* **Audio:** `assets/audio/dialogues/rathaus_fire_polizist_stahl_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_stahl_a]` — **Kommissar Stahl**
> „Hier ist die Einsatzakte mit den Fluchtwegen. Möge der Himmel Ihnen beistehen. Melden Sie sich, wenn Sie Renger finden.“

* **Audio:** `assets/audio/dialogues/rathaus_fire_polizist_end_stahl_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A) | 🎁 Belohnung: `evidence_fire_dossier`

#### 📍 Knoten `[end_stahl_b]` — **Kommissar Stahl**
> „Ich lasse das Protokoll anpassen. Mehr kann ich Ihnen im Moment nicht sagen.“

* **Audio:** `assets/audio/dialogues/rathaus_fire_polizist_end_stahl_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_stahl_d]` — **Kommissar Stahl**
> „Die polizeiinternen Protokolle sind sauber. Konzentrieren Sie sich auf die Zivilisten in der Stadt.“

* **Audio:** `assets/audio/dialogues/rathaus_fire_polizist_end_stahl_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 5: `rathaus_fire_reporter` — Paul Stift
*Knotenanzahl: 11*

#### 📍 Knoten `[start]` — **Paul Stift**
> „(Hält ein langes Teleobjektiv bereit) Nicht schubsen! Die Frankenpost zahlt für das Exklusivfoto. 'Flammeninferno vernichtet Jahrhunderte-Geheimnis'. Großartige Schlagzeile, was meinen Sie?“

* **Audio:** `assets/audio/dialogues/rathaus_fire_reporter_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Empathisch] Sie riskieren viel für die Wahrheit, Herr Stift. Was hat Ihre Linse eingefangen? *(führt zu `[stift_empathic]`)*
  * 💬 [Sachlich] Sie waren vor der Feuerwehr hier. Was haben Sie in den ersten Minuten gesehen? *(führt zu `[stift_factual]`)*
  * 💬 [Konfrontativ] Treten Sie hinter die Absperrung zurück! Sie behindern eine Brandermittlung wegen schwerer Brandstiftung! *(führt zu `[stift_confront]`)*

#### 📍 Knoten `[stift_empathic]` — **Paul Stift**
> „Endlich mal jemand mit Respekt vor der Presse! Ich stand um 21:40 Uhr drüben am Brunnen, als es im Keller puffte. Eine dichte Rauchwolke stieg auf. Und dann rannte jemand aus dem Hintertor.“

* **Audio:** `assets/audio/dialogues/rathaus_fire_reporter_stift_empathic.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Konnten Sie Merkmale der Person erkennen? *(führt zu `[stift_details]`)*
  * 💬 [Widerspruch aufdecken] Eben prahlten Sie noch, Sie wären ganz nah dran gewesen. Am Brunnen waren es 50 Meter! *(führt zu `[stift_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*

#### 📍 Knoten `[stift_factual]` — **Paul Stift**
> „Es gab keinen lauten Knall – nur ein dumpfes Zischen, wie bei chemischem Brandbeschleuniger. Und kurz darauf schoss eine dunkle Limousine mit abgedunkelten Scheiben davon.“

* **Audio:** `assets/audio/dialogues/rathaus_fire_reporter_stift_factual.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Haben Sie ein Foto von diesem Fahrzeug? *(führt zu `[stift_photo]`)*
  * 💬 [Konfrontativ] Warum haben Sie nicht versucht, den Wagen aufzuhalten? *(führt zu `[stift_confront]`)*

#### 📍 Knoten `[stift_confront]` — **Paul Stift**
> „Ich bin Journalist, kein Polizist! Ich lasse mich von Ihnen nicht einschüchtern. Die Pressefreiheit ist im Grundgesetz verankert, Kollege!“

* **Audio:** `assets/audio/dialogues/rathaus_fire_reporter_stift_confront.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Einlenken] Verzeihung, die Nerven liegen blank. Haben Sie Aufnahmen der Flucht? *(führt zu `[stift_factual]`)*
  * 💬 [Druck erhöhen] Wenn Sie Beweismittel zurückhalten, lasse ich Ihre Kamera auf der Stelle beschlagnahmen! *(führt zu `[stift_fail]`)*

#### 📍 Knoten `[stift_contra]` — **Paul Stift**
> „(Grinst ertappt) Na gut, Sie verstehen Ihr Handwerk. Ich habe mich an die Hintertür herangepirscht, weil ich auf Dr. Renger gewartet hatte. Dabei drückte ich ab, als die Limousine anfuhr.“

* **Audio:** `assets/audio/dialogues/rathaus_fire_reporter_stift_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Zeigen Sie mir die Aufnahme. *(führt zu `[stift_photo]`)*

#### 📍 Knoten `[stift_details]` — **Paul Stift**
> „Es waren zwei verschiedene Personen! Eine Gestalt zu Fuß im langen Mantel mit Gehstock humpelte Richtung Biengässchen. Und eine elegante Gestalt stieg in die Limousine.“

* **Audio:** `assets/audio/dialogues/rathaus_fire_reporter_stift_details.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Zwei Täter mit unterschiedlichen Fluchtwegen. *(führt zu `[end_stift_b]`, Impact: herold +10%)*

#### 📍 Knoten `[stift_photo]` — **Paul Stift**
> „Hier, auf meinem Display: Schwarzer Audi, Kennzeichen HO-KG 1823. Auf dem Beifahrersitz sieht man die Silhouette einer Person im maßgeschneiderten Kostüm. Das Foto überlasse ich Ihnen gegen Exklusiv-Auskunft später!“

* **Audio:** `assets/audio/dialogues/rathaus_fire_reporter_stift_photo.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Beweis annehmen] Das Foto ist ein entscheidender Treffer. *(führt zu `[end_stift_a]`, Impact: gipser +15%)*

#### 📍 Knoten `[stift_fail]` — **Paul Stift**
> „Beschlagnahmen?! Das wird die Titelseite von morgen: 'Polizeiwilkür am Brandherd'! Ich sage kein einziges Wort mehr!“

* **Audio:** `assets/audio/dialogues/rathaus_fire_reporter_stift_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_stift_a]` — **Paul Stift**
> „Hier ist die Speicherkarte mit dem Limousinen-Foto. Bringen Sie den Kerl hinter Gitter!“

* **Audio:** `assets/audio/dialogues/rathaus_fire_reporter_end_stift_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A) | 🎁 Belohnung: `foto_gipser_auto`

#### 📍 Knoten `[end_stift_b]` — **Paul Stift**
> „Ich bleibe hier und halte die Augen offen. Notieren Sie sich die Gehstock-Spur!“

* **Audio:** `assets/audio/dialogues/rathaus_fire_reporter_end_stift_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_stift_d]` — **Paul Stift**
> „Meine Recherche zeigt: Es war kein Unglück, sondern eine geplante Tat von zwei Fraktionen.“

* **Audio:** `assets/audio/dialogues/rathaus_fire_reporter_end_stift_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 6: `post_kurier_sepp` — Kurier Sepp
*Knotenanzahl: 12*

#### 📍 Knoten `[start]` — **Kurier Sepp**
> „(Wuchtet schwer atmend Kisten auf die Ladefläche) Pst! Haben Sie keinen Feierabend? Um diese Zeit werden nur Eilaufträge verladen. Ich muss in zehn Minuten am Ufer sein, machen Sie den Weg frei!“

* **Audio:** `assets/audio/dialogues/post_kurier_sepp_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Empathisch] Spätschicht bei Nachtkälte ist kein Vergnügen. Was für eilige Fracht verladen Sie da? *(führt zu `[sepp_empathic]`)*
  * 💬 [Sachlich] Polizeiliche Kontrolle. Zeigen Sie mir die Frachtpapiere und den Absender dieser Kisten. *(führt zu `[sepp_factual]`)*
  * 💬 [Konfrontativ] Halt! Motor aus und Hände ans Fahrzeug! Diese Kisten stammen aus dem brennenden Rathaus! *(führt zu `[sepp_confront]`)*

#### 📍 Knoten `[sepp_empathic]` — **Kurier Sepp**
> „Kein Vergnügen, das können Sie laut sagen. Reiner Papiermüll zur Vernichtung, sagt der Auftraggeber. Aber gut bezahlt. Man fragt nicht, man fährt.“

* **Audio:** `assets/audio/dialogues/post_kurier_sepp_sepp_empathic.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Wer bezahlt Sie für diese nächtliche Räumung? *(führt zu `[sepp_who]`)*
  * 💬 [Widerspruch aufdecken] Papiermüll? Warum sind die Kisten mit schweren Messingschlössern gesichert? *(führt zu `[sepp_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*

#### 📍 Knoten `[sepp_factual]` — **Kurier Sepp**
> „Hier ist der Lieferschein. Offizieller Dienstauftrag zur 'Aktenauslagerung'. Alles abgestempelt vom Bauamt und der Stadtverwaltung.“

* **Audio:** `assets/audio/dialogues/post_kurier_sepp_sepp_factual.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Beweis vorlegen] Bauamt? Lassen Sie mich die Frachtpapiere genau prüfen. *(führt zu `[sepp_papers]`, Impact: gipser +15%, Benötigt Beweis: `beweis_frachtpapiere`)*
  * 💬 [Sachlich] Wohin soll die Fracht gebracht werden? *(führt zu `[sepp_dest]`)*

#### 📍 Knoten `[sepp_confront]` — **Kurier Sepp**
> „Was fällt Ihnen ein?! Ich bin ein ehrlicher Kraftfahrer! Wenn der Stadtrat mir einen Fahrauftrag gibt, führe ich ihn aus!“

* **Audio:** `assets/audio/dialogues/post_kurier_sepp_sepp_confront.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Beruhigen Sie sich. Welcher Stadtrat hat den Auftrag erteilt? *(führt zu `[sepp_who]`)*
  * 💬 [Druck erhöhen] Sie machen sich der Beihilfe zur schweren Brandstiftung schuldig, Sepp! *(führt zu `[sepp_fail]`)*

#### 📍 Knoten `[sepp_contra]` — **Kurier Sepp**
> „(Schluckt nervös) Verdammt... Sie haben Adleraugen. Der Herr am Telefon sagte: 'Wenn ein einziges Siegel bricht, fliegst du raus.' Es sind historische Originalakten aus dem Archivkeller.“

* **Audio:** `assets/audio/dialogues/post_kurier_sepp_sepp_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Wer war der Herr am Telefon? Oder war es eine Frau? *(führt zu `[sepp_who]`)*
  * 💬 [Sachlich] Wo ist der Übergabeort? *(führt zu `[sepp_dest]`)*

#### 📍 Knoten `[sepp_who]` — **Kurier Sepp**
> „Die Anweisung kam direkt aus dem Büro der Stadtentwicklung. Eine kühle Damenstimme. Sie sagte, die Akten müssten vor der Feuerwehr verschwinden.“

* **Audio:** `assets/audio/dialogues/post_kurier_sepp_sepp_who.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Die Stadtentwicklung will die Akten vernichten. *(führt zu `[end_sepp_b]`, Impact: gipser +10%)*

#### 📍 Knoten `[sepp_dest]` — **Kurier Sepp**
> „Am Saaleufer, unterhalb der Hospitalkirche. Dort wartet jemand mit einem Transporter. Ich gebe Ihnen die Lieferscheine, ich will damit nichts mehr zu tun haben!“

* **Audio:** `assets/audio/dialogues/post_kurier_sepp_sepp_dest.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Dokument annehmen] Das rettet Rengers Forschung. *(führt zu `[end_sepp_a]`, Impact: gipser +15%)*

#### 📍 Knoten `[sepp_papers]` — **Kurier Sepp**
> „Das Siegel auf den Papieren... es gehört Katharina von Gipsers Gesellschaft. Ich wusste nicht, worum es geht! Nehmen Sie die Papiere!“

* **Audio:** `assets/audio/dialogues/post_kurier_sepp_sepp_papers.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Beweis sichern] Vollständiger Nachweis der illegalen Räumung. *(führt zu `[end_sepp_a]`, Impact: gipser +20%)*

#### 📍 Knoten `[sepp_fail]` — **Kurier Sepp**
> „Reicht mir! Ich sage kein Wort mehr ohne Anwalt der Gewerkschaft! Verschwinden Sie von meiner Laderampe!“

* **Audio:** `assets/audio/dialogues/post_kurier_sepp_sepp_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_sepp_a]` — **Kurier Sepp**
> „Hier sind die Original-Frachtpapiere. Sagen Sie bloß nicht, dass Sie sie von mir haben!“

* **Audio:** `assets/audio/dialogues/post_kurier_sepp_end_sepp_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A) | 🎁 Belohnung: `beweis_frachtpapiere`

#### 📍 Knoten `[end_sepp_b]` — **Kurier Sepp**
> „Passen Sie auf sich auf am Fluss. Da drüben laufen finstere Gestalten herum.“

* **Audio:** `assets/audio/dialogues/post_kurier_sepp_end_sepp_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_sepp_d]` — **Kurier Sepp**
> „Ich bin nur der Fahrer. Meine Weste ist weiß, Herr Kommissar.“

* **Audio:** `assets/audio/dialogues/post_kurier_sepp_end_sepp_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 7: `obelisk_blume_blume` — Dr. Blume
*Knotenanzahl: 12*

#### 📍 Knoten `[start]` — **Dr. Blume**
> „(Verbirgt zitternd eine Mappe unter seinem Mantel) Wer schleicht da im Park? Sind Sie von den Erben geschickt worden? Ich schwöre Ihnen, ich habe Renger gewarnt! Diese Dokumente sind verflucht!“

* **Audio:** `assets/audio/dialogues/obelisk_blume_blume_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Empathisch] Beruhigen Sie sich, Herr Doktor. Ich bin Ermittler und will Renger helfen. Was fürchten Sie? *(führt zu `[blume_empathic]`)*
  * 💬 [Sachlich] Wir untersuchen Rengers Verschwinden. Welche Dokumente haben Sie und Renger entdeckt? *(führt zu `[blume_factual]`)*
  * 💬 [Konfrontativ] Hören Sie auf mit dem Theater! Sie treffen sich nachts im Park, während das Archiv brennt. Wo ist er?! *(führt zu `[blume_confront]`)*

#### 📍 Knoten `[blume_empathic]` — **Dr. Blume**
> „(Atmet zittrig aus) Ein Ermittler... Gott sei Dank. Renger stieß vor drei Tagen auf den Originalvertrag des Bundes von 1823. Er beweist, dass Hofs reichste Familien ihren Besitz durch Brandstiftung ergaunerten.“

* **Audio:** `assets/audio/dialogues/obelisk_blume_blume_blume_empathic.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Wer wusste noch von diesem Fund? *(führt zu `[blume_who]`)*
  * 💬 [Beweis vorlegen] Ist das die Chiffre, die im Koffer gefunden wurde? *(führt zu `[blume_cipher]`, Benötigt Beweis: `evidence_cipher_paper`)*

#### 📍 Knoten `[blume_factual]` — **Dr. Blume**
> „Wir haben Kopien in einem Aktenkoffer gesichert. Der Zahlencode war ein historisches Datum: 1823. Aber vorhin rief Renger mich in Panik an. Er sagte, der 'Domorganist' und die 'Baulöwin' seien hinter ihm her.“

* **Audio:** `assets/audio/dialogues/obelisk_blume_blume_blume_factual.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Widerspruch aufdecken] Vorhin sagten Sie noch, Sie hätten Renger gewarnt – wann sprachen Sie ihn zuletzt? *(führt zu `[blume_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*
  * 💬 [Sachlich] Was hat der Domorganist damit zu tun? *(führt zu `[blume_organist]`)*

#### 📍 Knoten `[blume_confront]` — **Dr. Blume**
> „Glauben Sie etwa, ich hätte etwas damit zu tun?! Ich habe mein Leben der Stadtgeschichte gewidmet! Ich lasse mich von Ihnen nicht bedrohen!“

* **Audio:** `assets/audio/dialogues/obelisk_blume_blume_blume_confront.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Einlenken] Entschuldigen Sie, Rengers Leben steht auf dem Spiel. Wer bedrohte ihn? *(führt zu `[blume_empathic]`)*
  * 💬 [Druck erhöhen] Entweder Sie reden jetzt, oder ich nehme Sie als Tatverdächtigen fest! *(führt zu `[blume_fail]`)*

#### 📍 Knoten `[blume_contra]` — **Dr. Blume**
> „Er rief mich aus einer Telefonzelle an, um Punkt 21:15 Uhr! Er klang völlig verstört. Er murmelte: 'Der Pakt verlangt ein Opfer, sie zünden das Rathaus an!'“

* **Audio:** `assets/audio/dialogues/obelisk_blume_blume_blume_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Nannte er konkrete Namen oder Merkmale? *(führt zu `[blume_who]`)*

#### 📍 Knoten `[blume_who]` — **Dr. Blume**
> „Drei Parteien wollten die Verträge: Ein Kunsthändler, der sie ins Ausland verkaufen will. Eine Investorin, deren Bauprojekte platzen würden. Und ein religiöser Fanatiker, der die Verträge als heiliges Erbe betrachtet.“

* **Audio:** `assets/audio/dialogues/obelisk_blume_blume_blume_who.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Ein Dreiecks-Konflikt um die Dokumente. *(führt zu `[end_blume_b]`)*

#### 📍 Knoten `[blume_organist]` — **Dr. Blume**
> „Der Organist Severin Heiden sieht sich als geistlicher Erbe des Bundes. Er glaubt, das Feuer von 1823 sei Gottes Wille gewesen und müsse erneuert werden. Er ist unberechenbar!“

* **Audio:** `assets/audio/dialogues/obelisk_blume_blume_blume_organist.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Heidens Motiv ist religiöser Wahn. *(führt zu `[end_blume_b]`, Impact: heiden +10%)*

#### 📍 Knoten `[blume_cipher]` — **Dr. Blume**
> „Das ist Rengers Chiffre! Die Zahlenkombination für das Geheimfach lautet 1-8-2-3. Darin befindet sich die Liste aller Besitztümer der Schlappen-Erben. Nehmen Sie diese Notiz!“

* **Audio:** `assets/audio/dialogues/obelisk_blume_blume_blume_cipher.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Chiffre annehmen] Schlüssel zum Fall gesichert. *(führt zu `[end_blume_a]`)*

#### 📍 Knoten `[blume_fail]` — **Dr. Blume**
> „(Weint vor Verzweiflung) Sie verstehen gar nichts! Ich sage kein Wort mehr!“

* **Audio:** `assets/audio/dialogues/obelisk_blume_blume_blume_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_blume_a]` — **Dr. Blume**
> „Hier ist die Entschlüsselung des Koffers. Retten Sie meinen Freund Dr. Renger!“

* **Audio:** `assets/audio/dialogues/obelisk_blume_blume_end_blume_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A) | 🎁 Belohnung: `evidence_cipher_paper`

#### 📍 Knoten `[end_blume_b]` — **Dr. Blume**
> „Ich verstecke mich in der Bibliothek. Seien Sie vorsichtig da draußen.“

* **Audio:** `assets/audio/dialogues/obelisk_blume_blume_end_blume_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_blume_d]` — **Dr. Blume**
> „Dr. Renger wollte die Wahrheit veröffentlichen, kein Geld erpressen. Seine Ehre ist rein.“

* **Audio:** `assets/audio/dialogues/obelisk_blume_blume_end_blume_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 8: `lorenz_klement_klement` — Pfarrer Klement
*Knotenanzahl: 12*

#### 📍 Knoten `[start]` — **Pfarrer Klement**
> „(Kniet am Altar, wendet sich langsam um) Der Friede sei mit Ihnen... auch wenn in dieser Nacht kein Friede über Hof liegt. Sie tragen Brandgeruch an Ihrer Kleidung. Was führt Sie zu dieser Stunde in St. Lorenz?“

* **Audio:** `assets/audio/dialogues/lorenz_klement_klement_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Empathisch] Ein Mensch schwebt in Lebensgefahr, Hochwürden. Dr. Renger suchte Schutz vor einem Bund. Gab es Hilferufe? *(führt zu `[klement_empathic]`)*
  * 💬 [Sachlich] In den historischen Spendenregistern von St. Lorenz tauchen Zahlungen des Bundes von 1823 auf. Was wissen Sie darüber? *(führt zu `[klement_factual]`)*
  * 💬 [Konfrontativ] Verstecken Sie sich nicht hinter Ihrer Kanzel! Jemand nutzt diese Gruft als konspirativen Übergabeort! *(führt zu `[klement_confront]`)*

#### 📍 Knoten `[klement_empathic]` — **Pfarrer Klement**
> „Renger war vor drei Tagen hier. Er zitterte. Er bat mich, die alte Gruft unter dem Altar aufzuschließen, um Relikte zu sichern. Doch ich verweigerte es ihm.“

* **Audio:** `assets/audio/dialogues/lorenz_klement_klement_klement_empathic.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Warum haben Sie es ihm verweigert? *(führt zu `[klement_who]`)*
  * 💬 [Beweis vorlegen] Wegen dieses Siegels, das zur Familie Richter gehört? *(führt zu `[klement_ring]`, Impact: heiden +15%, Benötigt Beweis: `beweis_pakt_ring`)*

#### 📍 Knoten `[klement_factual]` — **Pfarrer Klement**
> „Die Bürgerstiftung Rosina Richter stiftete 1823 große Summen für den Wiederaufbau. Doch das Geld stammte aus unsauberen Quellen. Wir haben dieses Schweigen über Generationen gehütet.“

* **Audio:** `assets/audio/dialogues/lorenz_klement_klement_klement_factual.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Widerspruch aufdecken] Sie sprachen von frommen Spenden – und nun geben Sie unsaubere Quellen zu? *(führt zu `[klement_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*
  * 💬 [Sachlich] Wer forderte dieses Erbe kürzlich zurück? *(führt zu `[klement_who]`)*

#### 📍 Knoten `[klement_confront]` — **Pfarrer Klement**
> „Mäßigen Sie Ihre Worte im Haus des Herrn! Das Beichtgeheimnis und der Frieden dieser Kirche stehen über weltlicher Neugier!“

* **Audio:** `assets/audio/dialogues/lorenz_klement_klement_klement_confront.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Einlenken] Verzeihen Sie, aber Renger könnte getötet werden. Helfen Sie mir, Leben zu retten. *(führt zu `[klement_empathic]`)*
  * 💬 [Druck erhöhen] Beichtgeheimnis schützt keine Brandstifter! Antworten Sie! *(führt zu `[klement_fail]`)*

#### 📍 Knoten `[klement_contra]` — **Pfarrer Klement**
> „(Senkt das Haupt) Gott vergebe mir. Der Domorganist Heiden kam heute Abend herab. Er verlangte den Siegelring der Stifterin Rosina Richter. Er sagte: 'Die Stunde der Reinigung ist da.'“

* **Audio:** `assets/audio/dialogues/lorenz_klement_klement_klement_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Was wollte er mit dem Ring? *(führt zu `[klement_ring_info]`)*

#### 📍 Knoten `[klement_who]` — **Pfarrer Klement**
> „Valentin Herold bot der Gemeinde eine halbe Million Euro für alte Stiftungsurkunden. Und Severin Heiden drohte mit Gottes Zorn, wenn wir sie herausgeben. Die Kirche stand zwischen zwei Feuern.“

* **Audio:** `assets/audio/dialogues/lorenz_klement_klement_klement_who.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Herold bot Schmiergeld, Heiden drohte mit Gewalt. *(führt zu `[end_klement_b]`, Impact: herold +10%)*

#### 📍 Knoten `[klement_ring_info]` — **Pfarrer Klement**
> „Der Siegelring öffnet das Kryptex an der Orgel von St. Michaelis. Ich habe mich geweigert, ihn Heiden zu geben. Ich übergebe ihn jetzt Ihnen – bringen Sie die Wahrheit ans Licht!“

* **Audio:** `assets/audio/dialogues/lorenz_klement_klement_klement_ring_info.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Ring annehmen] Ein entscheidender Fund. *(führt zu `[end_klement_a]`)*

#### 📍 Knoten `[klement_ring]` — **Pfarrer Klement**
> „Sie haben den Ring bereits?! Dann hat Klement Heiden verloren... Ja, das ist das Siegel des Bundes. Es beweist die geheime Bruderschaft von 1823.“

* **Audio:** `assets/audio/dialogues/lorenz_klement_klement_klement_ring.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Erkenntnis festhalten] Der Bund existiert schwarz auf weiß. *(führt zu `[end_klement_a]`)*

#### 📍 Knoten `[klement_fail]` — **Pfarrer Klement**
> „Ich werde mein Gelübde nicht brechen. Verlassen Sie dieses Gotteshaus sofort!“

* **Audio:** `assets/audio/dialogues/lorenz_klement_klement_klement_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_klement_a]` — **Pfarrer Klement**
> „Hier ist die Stiftungsurkunde und der Siegelring. Möge Gott Ihre Schritte lenken.“

* **Audio:** `assets/audio/dialogues/lorenz_klement_klement_end_klement_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A) | 🎁 Belohnung: `beweis_pakt_ring`

#### 📍 Knoten `[end_klement_b]` — **Pfarrer Klement**
> „Passen Sie auf sich auf. Der Organist ist fanatischer, als Sie ahnen.“

* **Audio:** `assets/audio/dialogues/lorenz_klement_klement_end_klement_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_klement_d]` — **Pfarrer Klement**
> „Die Gemeinde St. Lorenz war Opfer der Verschwörung, nicht Urheber.“

* **Audio:** `assets/audio/dialogues/lorenz_klement_klement_end_klement_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 9: `gasse_erna_erna` — Schankwirtin Erna
*Knotenanzahl: 12*

#### 📍 Knoten `[start]` — **Schankwirtin Erna**
> „(Wischt mit einem Lappen die Holztheke) Hier gibt's um diese Zeit kein Bier mehr, Herr Inspektor. Sperrstunde war um Mitternacht. Und wer in mein Kellerfenster starrt, kriegt den Wischlappen ins Gesicht!“

* **Audio:** `assets/audio/dialogues/gasse_erna_erna_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Empathisch] Keine Sorge, Frau Wirtin. Aber hier in der Gasse entgeht Ihnen kein Schritt. Haben Sie jemanden rennen gehört? *(führt zu `[erna_empathic]`)*
  * 💬 [Sachlich] Die Fluchtspur des Brandstifters führt hier durchs Biengässchen. Wen haben Sie bemerkt? *(führt zu `[erna_factual]`)*
  * 💬 [Konfrontativ] Frau Wirtin, ein zerbrochenes Kellerfenster und verdächtige Schuhabdrücke vor Ihrer Tür. Verstecken Sie jemanden? *(führt zu `[erna_confront]`)*

#### 📍 Knoten `[erna_empathic]` — **Schankwirtin Erna**
> „Hören? Bei dem Kopfsteinpflaster hört man jeden Pfennigabsatz! Vorhin hechtete einer vorbei wie vom Teufel gehetzt. Hat sogar was verloren im Spurt.“

* **Audio:** `assets/audio/dialogues/gasse_erna_erna_erna_empathic.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Was hat er verloren? *(führt zu `[erna_lost]`)*
  * 💬 [Sachlich] Wie sah der Mann aus? *(führt zu `[erna_look]`)*

#### 📍 Knoten `[erna_factual]` — **Schankwirtin Erna**
> „Um viertel nach zehn klapperten Lackschuhe durchs Pflaster. Einer hinkte leicht und stützte sich auf einen Spazierstock mit silbernem Knauf.“

* **Audio:** `assets/audio/dialogues/gasse_erna_erna_erna_factual.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Widerspruch aufdecken] Erst sagten Sie, Sie schauen nie raus – woher kennen Sie den Knauf? *(führt zu `[erna_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*
  * 💬 [Sachlich] Was für ein Knauf war das? *(führt zu `[erna_knauf]`)*

#### 📍 Knoten `[erna_confront]` — **Schankwirtin Erna**
> „Verstecken?! Ich bin eine ehrliche Wirtin seit vierzig Jahren! Unterstellen Sie mir keine Hehlerei, sonst fliegt der Schankkrug!“

* **Audio:** `assets/audio/dialogues/gasse_erna_erna_erna_confront.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Einlenken] Entschuldigen Sie. Was haben Sie denn auf der Gasse beobachtet? *(führt zu `[erna_factual]`)*
  * 💬 [Druck erhöhen] Machen Sie die Kellertür auf, oder ich hole einen Durchsuchungsbeschluss! *(führt zu `[erna_fail]`)*

#### 📍 Knoten `[erna_contra]` — **Schankwirtin Erna**
> „(Lacht heiser) Wenn so ein feiner Herr mit Samtweste fast in meine Mülltonne fliegt, guckt jede Wirtin hin! Ein Löwenkopf aus Messing war auf dem Stock, ganz sicher!“

* **Audio:** `assets/audio/dialogues/gasse_erna_erna_erna_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Löwenknauf und Samtweste – der Kunsthändler. *(führt zu `[end_erna_b]`, Impact: herold +15%)*

#### 📍 Knoten `[erna_lost]` — **Schankwirtin Erna**
> „Ein schwerer Siegelring fiel ihm aus der Tasche und rollte in den Gullischacht. Ich hab ihn mit dem Schürhaken rausgeangelt. Hier, glänzt wie Gold!“

* **Audio:** `assets/audio/dialogues/gasse_erna_erna_erna_lost.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Beweis annehmen] Hervorragende Beobachtung, Erna. *(führt zu `[end_erna_a]`)*

#### 📍 Knoten `[erna_look]` — **Schankwirtin Erna**
> „Teures Parfüm, englischer Tweedmantel, aber der Atem rasselte wie eine Dampflok. Er fluchte leise: 'Gipser wird dafür bezahlen!'“

* **Audio:** `assets/audio/dialogues/gasse_erna_erna_erna_look.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Herold flieht und beschuldigt Gipser. *(führt zu `[end_erna_b]`, Impact: herold +10%)*

#### 📍 Knoten `[erna_knauf]` — **Schankwirtin Erna**
> „Ein Löwenkopf mit Rubinaugen. Sehr antik. Der Mann stolperte und rannte weiter Richtung Schlossplatz.“

* **Audio:** `assets/audio/dialogues/gasse_erna_erna_erna_knauf.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Weg verfolgen] Ich nehme die Verfolgung auf. *(führt zu `[end_erna_b]`)*

#### 📍 Knoten `[erna_fail]` — **Schankwirtin Erna**
> „Raus aus meiner Stube! Sie kriegen hier keinen Tropfen und keine Antwort mehr!“

* **Audio:** `assets/audio/dialogues/gasse_erna_erna_erna_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_erna_a]` — **Schankwirtin Erna**
> „Hier ist der gefundene Ring. Und jetzt lassen Sie mich Feierabend machen!“

* **Audio:** `assets/audio/dialogues/gasse_erna_erna_end_erna_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A) | 🎁 Belohnung: `evidence_briefcase_lock`

#### 📍 Knoten `[end_erna_b]` — **Schankwirtin Erna**
> „Folgen Sie dem Parfümgeruch. Der Kerl stinkt nach teurem Lavendelwasser.“

* **Audio:** `assets/audio/dialogues/gasse_erna_erna_end_erna_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_erna_d]` — **Schankwirtin Erna**
> „Die Stammgäste meiner Schänke haben damit nichts zu tun. Nur die feinen Leute aus der Oberstadt.“

* **Audio:** `assets/audio/dialogues/gasse_erna_erna_end_erna_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 10: `ludwig_rolf_rolf` — Wachmann Rolf
*Knotenanzahl: 13*

#### 📍 Knoten `[start]` — **Wachmann Rolf**
> „(Spielt nervös mit seiner Taschenlampe) Was wollen Sie hier? Das Kanzleiarchiv ist strengstens versiegelt. In der Brandnacht war hier niemand, darauf gebe ich mein Ehrenwort!“

* **Audio:** `assets/audio/dialogues/ludwig_rolf_rolf_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Empathisch] Ein einsamer Dienst bei eisiger Kälte. Haben Sie draußen keinen Lärm bemerkt? *(führt zu `[rolf_empathic]`)*
  * 💬 [Sachlich] Wir untersuchen Diebstahl historischer Notariatsurkunden. Wo waren Sie zwischen 21:00 und 23:00 Uhr? *(führt zu `[rolf_factual]`)*
  * 💬 [Konfrontativ] Warum zittern Ihre Hände, Rolf? Sie haben Bestechungsgeld kassiert, um wegzusehen! *(führt zu `[rolf_confront]`)*

#### 📍 Knoten `[rolf_empathic]` — **Wachmann Rolf**
> „Eiskalt, ja... Ich war gerade auf dem Kontrollgang im Innenhof. Da hörte ich einen Wagen halten. Aber als ich nachsah, war niemand mehr da.“

* **Audio:** `assets/audio/dialogues/ludwig_rolf_rolf_rolf_empathic.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Was für ein Wagen war das? *(führt zu `[rolf_car]`)*
  * 💬 [Beweis vorlegen] Woher stammt dann diese goldene Taschenuhr an Ihrem Handgelenk? *(führt zu `[rolf_watch]`, Impact: herold +20%, Benötigt Beweis: `beweis_antike_uhr`)*

#### 📍 Knoten `[rolf_factual]` — **Wachmann Rolf**
> „Ich habe um 21:30 Uhr und um 22:30 Uhr vorschriftsmäßig gestempelt. Meine Stechuhr lügt nicht. Hier kam keine unbefugte Person herein.“

* **Audio:** `assets/audio/dialogues/ludwig_rolf_rolf_rolf_factual.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Widerspruch aufdecken] Ihre Stechuhr hat eine Lücke zwischen 21:45 und 22:15 Uhr – genau zur Brandzeit! *(führt zu `[rolf_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*
  * 💬 [Sachlich] Wurden Kisten aus dem Notariat transportiert? *(führt zu `[rolf_boxes]`)*

#### 📍 Knoten `[rolf_confront]` — **Wachmann Rolf**
> „(Wird kreidebleich) Bestechungsgeld?! Wer behauptet so etwas? Ich arbeite seit zwölf Jahren für den Wachdienst!“

* **Audio:** `assets/audio/dialogues/ludwig_rolf_rolf_rolf_confront.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Beweis vorlegen] Diese gravierte Taschenuhr mit den Initialen 'V. H.' wurde bei Ihnen sichergestellt! *(führt zu `[rolf_watch]`, Impact: herold +25%, Benötigt Beweis: `beweis_antike_uhr`)*
  * 💬 [Druck erhöhen] Beihilfe zur Brandstiftung bedeutet mindestens fünf Jahre Haft, Rolf! *(führt zu `[rolf_fail]`)*

#### 📍 Knoten `[rolf_contra]` — **Wachmann Rolf**
> „(Schluckt schwer) Ich... ich war kurz weg. Jemand steckte mir einen Umschlag zu. Ich sollte für eine halbe Stunde die Augen schließen und spazieren gehen.“

* **Audio:** `assets/audio/dialogues/ludwig_rolf_rolf_rolf_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Wer steckte Ihnen den Umschlag zu? *(führt zu `[rolf_confess]`)*

#### 📍 Knoten `[rolf_watch]` — **Wachmann Rolf**
> „(Bricht ein und stützt sich an der Wand ab) Herr Herold... Der Kunsthändler war es! Er kam mit einem Lederfutteral und gab mir die Uhr als 'Pfand'. Er wollte nur eine bestimmte Akte aus dem Safe holen!“

* **Audio:** `assets/audio/dialogues/ludwig_rolf_rolf_rolf_watch.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Geständnis sichern] Und kurz darauf brannte es im Rathaus. *(führt zu `[end_rolf_a]`, Impact: herold +20%)*

#### 📍 Knoten `[rolf_car]` — **Wachmann Rolf**
> „Eine dunkle Staatslimousine. Eine Frau im Hosenanzug stieg aus und herrschte Herold an: 'Wo bleiben die Verträge?!' Sie stritten heftig.“

* **Audio:** `assets/audio/dialogues/ludwig_rolf_rolf_rolf_car.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Gipser und Herold stritten um die Dokumente. *(führt zu `[end_rolf_b]`, Impact: gipser +15%)*

#### 📍 Knoten `[rolf_boxes]` — **Wachmann Rolf**
> „Zwei schwere Archivkästen wurden in den Kofferraum geladen. Dann fuhr der Wagen mit quietschenden Reifen davon.“

* **Audio:** `assets/audio/dialogues/ludwig_rolf_rolf_rolf_boxes.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Die Originalverträge wurden entwendet. *(führt zu `[end_rolf_b]`)*

#### 📍 Knoten `[rolf_confess]` — **Wachmann Rolf**
> „Ein Mann mit Gehstock und Samtweste. Er sagte, er tue der Stadt einen Gefallen. Ich wusste nicht, dass Renger entführt wird! Ich schwöre es!“

* **Audio:** `assets/audio/dialogues/ludwig_rolf_rolf_rolf_confess.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Aussage protokollieren] Herold ist schwer belastet. *(führt zu `[end_rolf_a]`)*

#### 📍 Knoten `[rolf_fail]` — **Wachmann Rolf**
> „Ich sage kein einziges Wort mehr ohne meinen Anwalt! Verhaften Sie mich doch!“

* **Audio:** `assets/audio/dialogues/ludwig_rolf_rolf_rolf_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_rolf_a]` — **Wachmann Rolf**
> „Hier ist die Quittung und die Taschenuhr. Ich sage vor Gericht gegen Herold aus!“

* **Audio:** `assets/audio/dialogues/ludwig_rolf_rolf_end_rolf_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A) | 🎁 Belohnung: `beweis_antike_uhr`

#### 📍 Knoten `[end_rolf_b]` — **Wachmann Rolf**
> „Passen Sie auf sich auf. Wenn Frau von Gipser erfährt, dass ich geredet habe, bin ich geliefert.“

* **Audio:** `assets/audio/dialogues/ludwig_rolf_rolf_end_rolf_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_rolf_d]` — **Wachmann Rolf**
> „Rolf hat das Feuer nicht selbst gelegt – er war nur das bestochene Werkzeug.“

* **Audio:** `assets/audio/dialogues/ludwig_rolf_rolf_end_rolf_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 11: `karo_kaeptn_kaeptn` — Käpt'n
*Knotenanzahl: 12*

#### 📍 Knoten `[start]` — **Käpt'n**
> „(Hockt im Windschatten der gelben Telefonzelle, nippt an einer Thermoskanne) Ahoi, Landratte. Wenn du telefonieren willst: Der Apparat schluckt nur noch Groschen und spuckt Flüche aus. Ansonsten lass einen Seemann in Ruh'.“

* **Audio:** `assets/audio/dialogues/karo_kaeptn_kaeptn_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Empathisch] Kalter Wind heute Nacht, Käpt'n. Hier, heißer Kaffee. Hat vorhin jemand in der Zelle telefoniert? *(führt zu `[kaeptn_empathic]`)*
  * 💬 [Sachlich] Wir untersuchen einen Notruf von dieser Zelle. Wer hat den Hörer vor einer halben Stunde benutzt? *(führt zu `[kaeptn_factual]`)*
  * 💬 [Konfrontativ] Stehen Sie auf! Sie lungern an einem Tatort herum. Entweder Sie reden, oder ich nehme Sie mit! *(führt zu `[kaeptn_confront]`)*

#### 📍 Knoten `[kaeptn_empathic]` — **Käpt'n**
> „Danke für den Schluck, das wärmt die alten Knochen. Ja, hier war Betrieb wie im Hamburger Hafen! Zwei Leute haben sich fast um den Hörer geprügelt.“

* **Audio:** `assets/audio/dialogues/karo_kaeptn_kaeptn_kaeptn_empathic.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Beschreiben Sie die beiden Personen. *(führt zu `[kaeptn_persons]`)*
  * 💬 [Widerspruch aufdecken] Vorhin sagten Sie noch, der Apparat sei kaputt – wie konnten sie dann telefonieren? *(führt zu `[kaeptn_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*

#### 📍 Knoten `[kaeptn_factual]` — **Käpt'n**
> „Um 21:15 Uhr war zuerst der Archivar da – Dr. Renger. Er hat gezittert und panisch eine Nummer gewählt. Er schrie ins Telefon: 'Blume, sie haben das Archiv umstellt!'“

* **Audio:** `assets/audio/dialogues/karo_kaeptn_kaeptn_kaeptn_factual.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Und wer kam danach? *(führt zu `[kaeptn_second]`)*
  * 💬 [Beweis vorlegen] Stammt dieses Tonband von dem Anruf? *(führt zu `[kaeptn_tape]`, Benötigt Beweis: `evidence_phone_warning`)*

#### 📍 Knoten `[kaeptn_confront]` — **Käpt'n**
> „Mitnehmen?! Der Käpt'n saß schon in Singapur im Kerker, da haben Sie noch in die Windeln gemacht! Ich weiß gar nichts!“

* **Audio:** `assets/audio/dialogues/karo_kaeptn_kaeptn_kaeptn_confront.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Einlenken] Schon gut, alter Seemann. Ich brauche Ihre Hilfe, um ein Verbrechen aufzuklären. *(führt zu `[kaeptn_empathic]`)*
  * 💬 [Druck erhöhen] Abmarsch zur Wache wegen Behinderung der Justiz! *(führt zu `[kaeptn_fail]`)*

#### 📍 Knoten `[kaeptn_contra]` — **Käpt'n**
> „(Grinst zahnlos) Kaputt ist der Münzschlitz! Aber wer eine Telefonkarte hat, kommt durch. Die feine Dame hatte so ein goldenes Kärtchen.“

* **Audio:** `assets/audio/dialogues/karo_kaeptn_kaeptn_kaeptn_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Was hat die Dame gesagt? *(führt zu `[kaeptn_second]`)*

#### 📍 Knoten `[kaeptn_persons]` — **Käpt'n**
> „Zuerst der magere Gelehrte mit Hornbrille. Danach eine Frau im Pelzmantel. Sie wählte eine Direktnummer und zischte: 'Renger ist gefasst. Schafft ihn zum Alten Spital!'“

* **Audio:** `assets/audio/dialogues/karo_kaeptn_kaeptn_kaeptn_persons.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Renger wird im Alten Spital gefangen gehalten. *(führt zu `[end_kaeptn_a]`, Impact: gipser +15%)*

#### 📍 Knoten `[kaeptn_second]` — **Käpt'n**
> „Sie sagte: 'Planieren Sie das Saaleufer, egal was die alten Verträge sagen. Und sagt Herold, er soll die Fresse halten.' Eiskalt war die.“

* **Audio:** `assets/audio/dialogues/karo_kaeptn_kaeptn_kaeptn_second.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Katharina von Gipser zieht die Fäden. *(führt zu `[end_kaeptn_a]`, Impact: gipser +20%)*

#### 📍 Knoten `[kaeptn_tape]` — **Käpt'n**
> „Genau diese Aufnahme! Renger hat im Eifer seine Notizmappe in der Zelle vergessen. Ich hab sie für Sie aufgehoben.“

* **Audio:** `assets/audio/dialogues/karo_kaeptn_kaeptn_kaeptn_tape.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Beweis annehmen] Hervorragend, Käpt'n. *(führt zu `[end_kaeptn_a]`)*

#### 📍 Knoten `[kaeptn_fail]` — **Käpt'n**
> „Ich singe jetzt Shanties, Kollege. 'What shall we do with a drunken sailor...' Kein Wort mehr!“

* **Audio:** `assets/audio/dialogues/karo_kaeptn_kaeptn_kaeptn_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_kaeptn_a]` — **Käpt'n**
> „Hier ist die Notiz aus der Telefonzelle. Bringen Sie den Gelehrten heil nach Hause!“

* **Audio:** `assets/audio/dialogues/karo_kaeptn_kaeptn_end_kaeptn_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A) | 🎁 Belohnung: `evidence_phone_warning`

#### 📍 Knoten `[end_kaeptn_b]` — **Käpt'n**
> „Halten Sie sich von der Limousine fern. Der Chauffeur versteht keinen Spaß.“

* **Audio:** `assets/audio/dialogues/karo_kaeptn_kaeptn_end_kaeptn_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_kaeptn_d]` — **Käpt'n**
> „Käpt'n bestätigt: Dr. Renger war das Opfer der Entführung, kein Erpresser.“

* **Audio:** `assets/audio/dialogues/karo_kaeptn_kaeptn_end_kaeptn_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 12: `schloss_lisa_lisa` — Lisa
*Knotenanzahl: 12*

#### 📍 Knoten `[start]` — **Lisa**
> „(Blättert in Stadtplänen unter der Laterne) Ein nächtlicher Besucher auf dem Schlossplatz. Suchen Sie die Spuren der Markgrafen oder das dunkle Geheimnis des Brandes von 1823?“

* **Audio:** `assets/audio/dialogues/schloss_lisa_lisa_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Empathisch] Ihre Liebe zu Hofs Geschichte ehrt Sie, Lisa. Dr. Renger forschte daran – und ist verschwunden. *(führt zu `[lisa_empathic]`)*
  * 💬 [Sachlich] Als Stadtführerin kennen Sie jeden Gewölbegang. Gab es kürzlich Begehungen der Residenzkeller? *(führt zu `[lisa_factual]`)*
  * 💬 [Konfrontativ] Was sucht eine Stadtführerin mitten in der Nacht hier? Treffen Sie Ihre Hintermänner? *(führt zu `[lisa_confront]`)*

#### 📍 Knoten `[lisa_empathic]` — **Lisa**
> „Renger war mein Dozent an der Uni! Er hat mir vor einer Woche von den Geheimklauseln des Pakts erzählt. Er hatte Angst vor den Nachfahren der Patrizier.“

* **Audio:** `assets/audio/dialogues/schloss_lisa_lisa_lisa_empathic.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Wer sind diese Nachfahren heute? *(führt zu `[lisa_families]`)*
  * 💬 [Beweis vorlegen] Erkennen Sie dieses Ambigramm-Dokument wieder? *(führt zu `[lisa_ambigram]`, Benötigt Beweis: `evidence_ambigram_mirror`)*

#### 📍 Knoten `[lisa_factual]` — **Lisa**
> „Die Schlosskeller sind offiziell gesperrt. Aber vorhin parkte ein schwarzer Wagen am Hintertor. Leute vom Bauamt gingen mit Plänen hinunter.“

* **Audio:** `assets/audio/dialogues/schloss_lisa_lisa_lisa_factual.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Widerspruch aufdecken] Gesperrt, aber Leute vom Bauamt gehen mitten in der Nacht hinunter? *(führt zu `[lisa_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*
  * 💬 [Sachlich] Was suchten die Leute da unten? *(führt zu `[lisa_vault]`)*

#### 📍 Knoten `[lisa_confront]` — **Lisa**
> „Unverschämtheit! Ich bereite die morgendliche Stadtführung vor! Wenn Sie so mit Zeugen umgehen, finden Sie Renger nie!“

* **Audio:** `assets/audio/dialogues/schloss_lisa_lisa_lisa_confront.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Einlenken] Verzeihung. Rengers Leben steht auf dem Spiel. Wer war hier? *(führt zu `[lisa_factual]`)*
  * 💬 [Druck erhöhen] Keine Ausreden! Zur Wache zur Vernehmung! *(führt zu `[lisa_fail]`)*

#### 📍 Knoten `[lisa_contra]` — **Lisa**
> „(Wird nervös) Frau von Gipser persönlich beaufsichtigte die Vermessung. Sie sagte laut: 'Wenn der Schlossplatz saniert wird, tilgen wir alle alten Erbrechte.'“

* **Audio:** `assets/audio/dialogues/schloss_lisa_lisa_lisa_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Gipser will die Erbrechte vernichten. *(führt zu `[end_lisa_b]`, Impact: gipser +15%)*

#### 📍 Knoten `[lisa_families]` — **Lisa**
> „Drei Familien unterzeichneten 1823: Die Familie Herold (Handel), die Familie Gipser (Liegenschaften) und die Linie Heiden (Kirchenvogt). Es war ein Pakt zur Aufteilung der Stadt!“

* **Audio:** `assets/audio/dialogues/schloss_lisa_lisa_lisa_families.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Die drei Verdächtigen sind die Bluts-Erben des Pakts. *(führt zu `[end_lisa_a]`, Impact: herold +10%)*

#### 📍 Knoten `[lisa_vault]` — **Lisa**
> „Sie suchten nach dem verschollenen Fundationsbrief. Dr. Renger hatte ihn aber vor ihren Augen versteckt – in einem Ambigramm-Pergament codiert!“

* **Audio:** `assets/audio/dialogues/schloss_lisa_lisa_lisa_vault.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Beweis sichern] Das Ambigramm birgt den Schlüssel. *(führt zu `[end_lisa_a]`)*

#### 📍 Knoten `[lisa_ambigram]` — **Lisa**
> „Genau dieses Pergament! Drehen Sie es um 180 Grad – dann offenbart sich das geheime Kennwort 'PAKT 1823'. Nehmen Sie meine Lupe!“

* **Audio:** `assets/audio/dialogues/schloss_lisa_lisa_lisa_ambigram.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Hinweis notieren] Der Code ist entschlüsselt. *(führt zu `[end_lisa_a]`)*

#### 📍 Knoten `[lisa_fail]` — **Lisa**
> „Ich rede mit Ihnen nicht weiter. Wenden Sie sich an das Kulturamt!“

* **Audio:** `assets/audio/dialogues/schloss_lisa_lisa_lisa_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_lisa_a]` — **Lisa**
> „Hier ist das entschlüsselte Ambigramm-Dokument. Viel Erfolg!“

* **Audio:** `assets/audio/dialogues/schloss_lisa_lisa_end_lisa_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A) | 🎁 Belohnung: `evidence_ambigram_mirror`

#### 📍 Knoten `[end_lisa_b]` — **Lisa**
> „Achten Sie auf Frau von Gipser. Sie scheut vor nichts zurück.“

* **Audio:** `assets/audio/dialogues/schloss_lisa_lisa_end_lisa_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_lisa_d]` — **Lisa**
> „Historische Aufklärung: Die Zünfte waren unschuldig am großen Brand.“

* **Audio:** `assets/audio/dialogues/schloss_lisa_lisa_end_lisa_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 13: `sonne_karl_karl` — Wärschtlamo Karl
*Knotenanzahl: 12*

#### 📍 Knoten `[start]` — **Wärschtlamo Karl**
> „(Dampf steigt aus dem Messingkessel) 'Wärschtla, haaß aus'n Kessel!' Grüß Gott, Herr Kommissar! Senf oder Kren? Wer nachts ermittelt, braucht was Warmes im Bauch.“

* **Audio:** `assets/audio/dialogues/sonne_karl_karl_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Empathisch] Zwei Paar mit Senf, Karl. Sie stehen mitten in Hof – wer ist Ihnen heute Nacht aufgefallen? *(führt zu `[karl_empathic]`)*
  * 💬 [Sachlich] Karl, polizeiliche Ermittlung. Wer ist zwischen 21:30 und 23:00 Uhr über den Sonnenplatz gerannt? *(führt zu `[karl_factual]`)*
  * 💬 [Konfrontativ] Machen Sie den Kessel zu, Karl. Es geht um schwere Brandstiftung! Haben Sie Schmiere gestanden? *(führt zu `[karl_confront]`)*

#### 📍 Knoten `[karl_empathic]` — **Wärschtlamo Karl**
> „Hier, bitteschön, knackig und heiß! Aufgefallen? Um viertel nach zehn kam der Domorganist Heiden vorbei. Völlig außer Atem, bleich wie eine Wand.“

* **Audio:** `assets/audio/dialogues/sonne_karl_karl_karl_empathic.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Was wollte Heiden um diese Zeit? *(führt zu `[karl_heiden]`)*
  * 💬 [Beweis vorlegen] Hatte er diesen Notizzettel mit lateinischen Gesängen bei sich? *(führt zu `[karl_note]`, Impact: heiden +15%, Benötigt Beweis: `beweis_chorknaben_notiz`)*

#### 📍 Knoten `[karl_factual]` — **Wärschtlamo Karl**
> „Hier kamen zwei vorbei. Erst der Organist mit langen grauen Haaren, murmelte Bibelverse. Eine halbe Stunde später die feine Stadträtin im Hosenanzug mit ihrem Chauffeur.“

* **Audio:** `assets/audio/dialogues/sonne_karl_karl_karl_factual.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Widerspruch aufdecken] Heidens Alibi behauptet, er war bis Mitternacht in der Marienkirche. Haben Sie ihn hier gesehen? *(führt zu `[karl_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*
  * 💬 [Sachlich] Haben die beiden miteinander gesprochen? *(führt zu `[karl_talk]`)*

#### 📍 Knoten `[karl_confront]` — **Wärschtlamo Karl**
> „Schmiere gestanden?! Ich bin der Wärschtlamo, ein Hofer Wahrzeichen! Respektieren Sie das Handwerk, Herr Wachtmeister!“

* **Audio:** `assets/audio/dialogues/sonne_karl_karl_karl_confront.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Einlenken] Verzeihung, Karl. Ein Mensch wurde entführt. Wer war hier am Platz? *(führt zu `[karl_factual]`)*
  * 💬 [Druck erhöhen] Reden Sie, oder ich mache Ihren Stand dicht! *(führt zu `[karl_fail]`)*

#### 📍 Knoten `[karl_contra]` — **Wärschtlamo Karl**
> „In der Marienkirche?! Niemals! Er stand um 22:15 Uhr genau vor meinem Kessel, hat zwei Paar Würste verschlungen und gezittert. Seine Finger waren voller Ruß!“

* **Audio:** `assets/audio/dialogues/sonne_karl_karl_karl_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Heidens Alibi ist zertrümmert. Finger voller Ruß. *(führt zu `[end_karl_a]`, Impact: heiden +20%)*

#### 📍 Knoten `[karl_heiden]` — **Wärschtlamo Karl**
> „Er murmelte: 'Das Fegefeuer brennt am Rathaus, nun muss der Turm von Michaelis versiegelt werden.' Dann ließ er seinen Notizblock auf meiner Bank liegen.“

* **Audio:** `assets/audio/dialogues/sonne_karl_karl_karl_heiden.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Beweis sichern] Karls Fund belegt Heidens Schuld. *(führt zu `[end_karl_a]`, Impact: heiden +20%)*

#### 📍 Knoten `[karl_talk]` — **Wärschtlamo Karl**
> „Sie haben sich angeschrien! Frau von Gipser sagte: 'Severin, du hast den Verstand verloren! Wir wollten die Verträge, nicht das ganze Rathaus abfackeln!'“

* **Audio:** `assets/audio/dialogues/sonne_karl_karl_karl_talk.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Gipser und Heiden als zerstrittene Mittäter. *(führt zu `[end_karl_b]`, Impact: gipser +15%)*

#### 📍 Knoten `[karl_note]` — **Wärschtlamo Karl**
> „Genau der Zettel mit meinem Senffleck drauf! Heiden hat ihn verloren, als er panisch Richtung St. Michaelis rannte.“

* **Audio:** `assets/audio/dialogues/sonne_karl_karl_karl_note.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Beweis zuordnen] Eindeutiger Sachbeweis. *(führt zu `[end_karl_a]`)*

#### 📍 Knoten `[karl_fail]` — **Wärschtlamo Karl**
> „Deckel zu! Ich sag gar nix mehr. Gehen Sie woanders ermitteln!“

* **Audio:** `assets/audio/dialogues/sonne_karl_karl_karl_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_karl_a]` — **Wärschtlamo Karl**
> „Hier ist Heidens Notizblock mit den Chornotizen. Bringen Sie ihn zur Vernunft!“

* **Audio:** `assets/audio/dialogues/sonne_karl_karl_end_karl_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A) | 🎁 Belohnung: `beweis_chorknaben_notiz`

#### 📍 Knoten `[end_karl_b]` — **Wärschtlamo Karl**
> „Passen Sie auf sich auf. Der Heiden sah aus, als würde er gleich explodieren.“

* **Audio:** `assets/audio/dialogues/sonne_karl_karl_end_karl_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_karl_d]` — **Wärschtlamo Karl**
> „Karl bezeugt: Keine Schlägertrupps am Sonnenplatz, nur die Verdächtigen selbst.“

* **Audio:** `assets/audio/dialogues/sonne_karl_karl_end_karl_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 14: `marien_gertrud_gertrud` — Mesnerin Gertrud
*Knotenanzahl: 12*

#### 📍 Knoten `[start]` — **Mesnerin Gertrud**
> „(Schließt mit großem Schlüsselbund das Seitenportal auf) Was suchen Sie im Gotteshaus zur Unzeit? Die Andacht ist vorbei, die Lichter gelöscht. Stören Sie nicht den Frieden des Herrn.“

* **Audio:** `assets/audio/dialogues/marien_gertrud_gertrud_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Empathisch] Verzeihen Sie die Störung, Frau Gertrud. Aber der Brand am Rathaus bedroht ganz Hof. Fand hier eine späte Zusammenkunft statt? *(führt zu `[gertrud_empathic]`)*
  * 💬 [Sachlich] Mesnerin Gertrud, wir überprüfen das Alibi des Domorganisten Heiden. War er heute Abend hier anwesend? *(führt zu `[gertrud_factual]`)*
  * 💬 [Konfrontativ] Versuchen Sie nicht, die Türen zu verriegeln! Wir wissen, dass hier Beweise versteckt wurden! *(führt zu `[gertrud_confront]`)*

#### 📍 Knoten `[gertrud_empathic]` — **Mesnerin Gertrud**
> „Herr Heiden hielt eine Sonderandacht für den Chor. Aber er war seltsam verändert. Er sprach nicht von Vergebung, sondern von göttlichem Strafgericht über die Stadt Hof.“

* **Audio:** `assets/audio/dialogues/marien_gertrud_gertrud_gertrud_empathic.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Wann hat er die Marienkirche verlassen? *(führt zu `[gertrud_time]`)*
  * 💬 [Beweis vorlegen] Gehört dieses Abhörprotokoll zu seinen Äußerungen? *(führt zu `[gertrud_wiretap]`, Impact: heiden +15%, Benötigt Beweis: `evidence_wiretap_log`)*

#### 📍 Knoten `[gertrud_factual]` — **Mesnerin Gertrud**
> „Er behauptet, er sei bis Mitternacht im Gebet versunken gewesen. Als Mesnerin muss ich die Kirche um 21:30 Uhr zusperren. Ich habe ihn persönlich vor die Tür gebeten.“

* **Audio:** `assets/audio/dialogues/marien_gertrud_gertrud_gertrud_factual.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Widerspruch aufdecken] Also hat Heiden gelogen! Er war um 21:45 Uhr gar nicht mehr in der Kirche! *(führt zu `[gertrud_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*
  * 💬 [Sachlich] Wohin ging er nach 21:30 Uhr? *(führt zu `[gertrud_time]`)*

#### 📍 Knoten `[gertrud_confront]` — **Mesnerin Gertrud**
> „Unverschämtheit! Dies ist eine geweihte Stätte! Ich lasse mich von weltlichen Schnüfflern nicht beschuldigen!“

* **Audio:** `assets/audio/dialogues/marien_gertrud_gertrud_gertrud_confront.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Einlenken] Rengers Leben steht auf dem Spiel. Wir müssen wissen, ob Heiden die Kirche verließ. *(führt zu `[gertrud_factual]`)*
  * 💬 [Druck erhöhen] Wer einen Verbrecher deckt, macht sich strafbar! *(führt zu `[gertrud_fail]`)*

#### 📍 Knoten `[gertrud_contra]` — **Mesnerin Gertrud**
> „(Senkt bestürzt den Blick) Ja... er hat gelogen. Er rannte um 21:35 Uhr eilig hinaus. Er trug eine lange Metallstange und ein altes Buch unter dem Arm.“

* **Audio:** `assets/audio/dialogues/marien_gertrud_gertrud_gertrud_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Welches Buch? *(führt zu `[gertrud_book]`)*

#### 📍 Knoten `[gertrud_time]` — **Mesnerin Gertrud**
> „Er lief in Richtung St. Michaelis und rief: 'Die Pforte muss versiegelt werden vor den Heidenkindern!'“

* **Audio:** `assets/audio/dialogues/marien_gertrud_gertrud_gertrud_time.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Heiden blockierte St. Michaelis. *(führt zu `[end_gertrud_a]`, Impact: heiden +20%)*

#### 📍 Knoten `[gertrud_book]` — **Mesnerin Gertrud**
> „Das historische Chorbuch von 1823 mit den verschlüsselten Partituren. Er murmelte ständig die Notenfolge B-A-C-H.“

* **Audio:** `assets/audio/dialogues/marien_gertrud_gertrud_gertrud_book.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] B-A-C-H ist Heidens Chiffre. *(führt zu `[end_gertrud_a]`, Impact: heiden +15%)*

#### 📍 Knoten `[gertrud_wiretap]` — **Mesnerin Gertrud**
> „Herrje... die Aufnahme ist eindeutig. Seine Stimme, wie er den Pakt beschwört. Ich händige Ihnen seine Notizen aus, die er auf der Orgelbank vergaß.“

* **Audio:** `assets/audio/dialogues/marien_gertrud_gertrud_gertrud_wiretap.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Beweis sichern] Belastendes Material gegen Heiden. *(führt zu `[end_gertrud_a]`)*

#### 📍 Knoten `[gertrud_fail]` — **Mesnerin Gertrud**
> „Verschwinden Sie aus dem Gotteshaus! Ich verweigere jede Aussage!“

* **Audio:** `assets/audio/dialogues/marien_gertrud_gertrud_gertrud_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_gertrud_a]` — **Mesnerin Gertrud**
> „Hier ist das Abhörprotokoll und Heidens Notenblatt. Bringen Sie ihn zur Besinnung.“

* **Audio:** `assets/audio/dialogues/marien_gertrud_gertrud_end_gertrud_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A) | 🎁 Belohnung: `evidence_wiretap_log`

#### 📍 Knoten `[end_gertrud_b]` — **Mesnerin Gertrud**
> „Beten Sie für die Stadt Hof. Dunkle Wolken ziehen auf.“

* **Audio:** `assets/audio/dialogues/marien_gertrud_gertrud_end_gertrud_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_gertrud_d]` — **Mesnerin Gertrud**
> „Die Gemeinde St. Marien distanziert sich von Heidens Taten.“

* **Audio:** `assets/audio/dialogues/marien_gertrud_gertrud_end_gertrud_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 15: `michael_huber_huber` — Gärtner Huber
*Knotenanzahl: 12*

#### 📍 Knoten `[start]` — **Gärtner Huber**
> „(Zuckt erschrocken zusammen, lässt die Schere fallen) Herr im Himmel! Schleichen Sie nicht so herum wie ein Gespenst! Was treibt Sie um diese Zeit auf den Friedhof von St. Michaelis?“

* **Audio:** `assets/audio/dialogues/michael_huber_huber_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Empathisch] Keine Sorge, Herr Huber. Niemand will Ihnen etwas tun. Sie wirken verängstigt. Was ist hier vorgefallen? *(führt zu `[huber_empathic]`)*
  * 💬 [Sachlich] Herr Huber, das Messingrad an der Friedhofspforte wurde blockiert. Wer hat daran manipuliert? *(führt zu `[huber_factual]`)*
  * 💬 [Konfrontativ] Hände hoch, Huber! Wer nachts um Gräber schleicht, während das Rathaus brennt, hat Dreck am Stecken! *(führt zu `[huber_confront]`)*

#### 📍 Knoten `[huber_empathic]` — **Gärtner Huber**
> „(Atmet keuchend auf) Verängstigt? Zu Tode erschrocken bin ich! Wissen Sie, wer vor einer halben Stunde hier oben herumbrüllte? Der Domorganist! Völlig von Sinnen!“

* **Audio:** `assets/audio/dialogues/michael_huber_huber_huber_empathic.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Was genau hat der Organist getan? *(führt zu `[huber_details]`)*
  * 💬 [Beweis vorlegen] Hat er versucht, dieses Kryptorad mit Gewalt zu verriegeln? *(führt zu `[huber_wheel]`, Impact: heiden +20%, Benötigt Beweis: `evidence_brass_wheel`)*

#### 📍 Knoten `[huber_factual]` — **Gärtner Huber**
> „Ich kümmere mich nur um die Rosen und den Rasen. Heiden kam mit einem langen Brecheisen und einem alten Schlüssel. Er schob den Riegel am Turm vor und brach den Schlüssel ab!“

* **Audio:** `assets/audio/dialogues/michael_huber_huber_huber_factual.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Widerspruch aufdecken] Vorhin sagten Sie noch, Sie wüssten von nichts – nun haben Sie den abgebrochenen Schlüssel gesehen? *(führt zu `[huber_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*
  * 💬 [Sachlich] Warum hat er den Turm verriegelt? *(führt zu `[huber_why]`)*

#### 📍 Knoten `[huber_confront]` — **Gärtner Huber**
> „Dreck am Stecken?! Ich bin Friedhofsgärtner in der dritten Generation! Ich lasse mich von Ihnen nicht wie einen Grabräuber behandeln!“

* **Audio:** `assets/audio/dialogues/michael_huber_huber_huber_confront.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Einlenken] Entschuldigen Sie meine Schärfe. Renger könnte da oben im Turm gefangen sein! *(führt zu `[huber_empathic]`)*
  * 💬 [Druck erhöhen] Entweder Sie öffnen jetzt, oder Sie wandern in Untersuchungshaft! *(führt zu `[huber_fail]`)*

#### 📍 Knoten `[huber_contra]` — **Gärtner Huber**
> „(Zittert am ganzen Leib) Ich wollte mich doch nur schützen! Heiden hat gedroht: 'Wer den Turm betritt, bevor das Werk vollendet ist, wird mit Feuer gerichtet!' Er hat Renger da oben eingesperrt!“

* **Audio:** `assets/audio/dialogues/michael_huber_huber_huber_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Dr. Renger ist im Südturm gefangen! *(führt zu `[end_huber_a]`, Impact: heiden +25%)*

#### 📍 Knoten `[huber_details]` — **Gärtner Huber**
> „Er murmelte, dass die 'Akte von 1823 gereinigt' werden müsse. Er hatte einen Kanister Petroleum bei sich! Er will den Turm anzünden, wenn jemand kommt!“

* **Audio:** `assets/audio/dialogues/michael_huber_huber_huber_details.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Höchste Gefahr: Geiselnahme und Brandgefahr. *(führt zu `[end_huber_a]`, Impact: heiden +20%)*

#### 📍 Knoten `[huber_why]` — **Gärtner Huber**
> „Weil das Kryptorad den Turmzugang schützt. Nur wer die Losung 'ORDO SCHLAPPIS 1823' kennt, kann das Messingrad drehen und die Pforte entriegeln.“

* **Audio:** `assets/audio/dialogues/michael_huber_huber_huber_why.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Code sichern] Der Türcode ist 'ORDO SCHLAPPIS 1823'. *(führt zu `[end_huber_a]`)*

#### 📍 Knoten `[huber_wheel]` — **Gärtner Huber**
> „Ja! Das ist das Rad! Er hat den Mechanismus blockiert. Mit Ihrer Entschlüsselung können wir die Sperre überwinden. Nehmen Sie meinen Schmierstoff und den Zweitschlüssel!“

* **Audio:** `assets/audio/dialogues/michael_huber_huber_huber_wheel.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlüssel annehmen] Zugang zum Turm frei. *(führt zu `[end_huber_a]`)*

#### 📍 Knoten `[huber_fail]` — **Gärtner Huber**
> „(Verbarrikadiert sich im Wärterhäuschen) Lassen Sie mich in Ruhe! Ich sage kein Wort mehr!“

* **Audio:** `assets/audio/dialogues/michael_huber_huber_huber_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_huber_a]` — **Gärtner Huber**
> „Hier ist die Lösung für das Kryptorad. Retten Sie den Mann da oben im Turm!“

* **Audio:** `assets/audio/dialogues/michael_huber_huber_end_huber_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A) | 🎁 Belohnung: `evidence_brass_wheel`

#### 📍 Knoten `[end_huber_b]` — **Gärtner Huber**
> „Seien Sie leise beim Aufstieg. Heiden ist bis an die Zähne bewaffnet.“

* **Audio:** `assets/audio/dialogues/michael_huber_huber_end_huber_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_huber_d]` — **Gärtner Huber**
> „Huber hat keine Schuld: Er wurde von Heiden mit dem Tod bedroht.“

* **Audio:** `assets/audio/dialogues/michael_huber_huber_end_huber_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 16: `hospital_maria_maria` — Schwester Maria
*Knotenanzahl: 12*

#### 📍 Knoten `[start]` — **Schwester Maria**
> „(Hält sich den Finger an die Lippen) Pst! Bitte leise sprechen. Die Kranken im alten Spital schlafen unruhig. Durch die Fenster dringt schon genug Lärm vom Saaleufer herauf. Was führt die Polizei hierher?“

* **Audio:** `assets/audio/dialogues/hospital_maria_maria_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Empathisch] Verzeihen Sie die späte Störung, Schwester. Wir suchen nach Hinweisen zu einer geheimen Übergabe. Haben Sie draußen jemanden gesehen? *(führt zu `[maria_empathic]`)*
  * 💬 [Sachlich] Schwester Maria, wir verfolgen Spuren zum Ufer der Hospitalkirche. Gab es hier vorhin verdächtige Vorgänge? *(führt zu `[maria_factual]`)*
  * 💬 [Konfrontativ] Schwester, machen Sie das Fenster ganz auf! Ein Zeuge sah, wie von hier Lichtsignale an den Fluss gegeben wurden! *(führt zu `[maria_confront]`)*

#### 📍 Knoten `[maria_empathic]` — **Schwester Maria**
> „Ich bin seit zehn Uhr auf den Beinen. Vorhin schaute ich aus dem Erker. Ein feiner Herr im dunklen Mantel mit Gehstock stand unten am Kirchenportal und wartete nervös.“

* **Audio:** `assets/audio/dialogues/hospital_maria_maria_maria_empathic.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Hat der Mann auf jemanden gewartet? *(führt zu `[maria_waiting]`)*
  * 💬 [Beweis vorlegen] Hat er diese fluoreszierende Formel an die Pforte gemalt? *(führt zu `[maria_formula]`, Impact: herold +15%, Benötigt Beweis: `evidence_uv_formula`)*

#### 📍 Knoten `[maria_factual]` — **Schwester Maria**
> „Unten an der Saale legte kurz ein Motorboot an. Der Mann mit dem Gehstock stritt mit der Person im Boot. Dann strich er mit einer seltsamen Flüssigkeit über den Steinbogen.“

* **Audio:** `assets/audio/dialogues/hospital_maria_maria_maria_factual.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Widerspruch aufdecken] Zuerst hieß es, Sie blieben drinnen bei den Kranken – wie konnten Sie das Boot im Nebel sehen? *(führt zu `[maria_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*
  * 💬 [Sachlich] Wie sah die Person im Boot aus? *(führt zu `[maria_boat]`)*

#### 📍 Knoten `[maria_confront]` — **Schwester Maria**
> „Lichtsignale?! Ich bin eine Diakonisse, kein Spion! Wie können Sie es wagen, den Krankenbereich mit solchen Unterstellungen zu stören!“

* **Audio:** `assets/audio/dialogues/hospital_maria_maria_maria_confront.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Einlenken] Entschuldigen Sie, die Nerven liegen blank. Was sahen Sie am Kirchenportal? *(führt zu `[maria_empathic]`)*
  * 💬 [Druck erhöhen] Behindern Sie keine Mordermittlung, Schwester! *(führt zu `[maria_fail]`)*

#### 📍 Knoten `[maria_contra]` — **Schwester Maria**
> „(Wird rot) Ich... ich war draußen, um Kräutertee für einen Patienten zu kühlen. Da sah ich ihn aus nächster Nähe. Er trug eine kostbare Samtweste und stützte sich auf einen Spazierstock mit Löwenknauf.“

* **Audio:** `assets/audio/dialogues/hospital_maria_maria_maria_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Valentin Herold war persönlich an der Hospitalkirche. *(führt zu `[end_maria_b]`, Impact: herold +15%)*

#### 📍 Knoten `[maria_waiting]` — **Schwester Maria**
> „Er markierte die Saaleseite der Einfriedung mit einer unsichtbaren Schrift, die man nur unter violettem Schwarzlicht erkennen kann. Er sagte: 'Für den Boten!'“

* **Audio:** `assets/audio/dialogues/hospital_maria_maria_maria_waiting.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Beweis sichern] UV-Markierung am Kirchenportal. *(führt zu `[end_maria_a]`)*

#### 📍 Knoten `[maria_boat]` — **Schwester Maria**
> „Es war ein Mann im Ölmantel. Er nahm eine schwere Dokumentenmappe entgegen und warf dem Hinkenden einen Sack Münzen zu. Dann fuhr das Boot flussabwärts.“

* **Audio:** `assets/audio/dialogues/hospital_maria_maria_maria_boat.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Dokumenten-Übergabe gegen Bargeld. *(führt zu `[end_maria_b]`, Impact: herold +15%)*

#### 📍 Knoten `[maria_formula]` — **Schwester Maria**
> „Genau dieses Leuchten! Mit Ihrer UV-Lampe wird die Schrift sichtbar: 'PAKTUS VERSTELLUS 1823'. Sie verweist auf das alte Spitalarchiv!“

* **Audio:** `assets/audio/dialogues/hospital_maria_maria_maria_formula.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Hinweis notieren] Versteck im Spitalarchiv offenbart. *(führt zu `[end_maria_a]`)*

#### 📍 Knoten `[maria_fail]` — **Schwester Maria**
> „(Schließt das Fenster energisch) Ich sage Ihnen gar nichts mehr. Sie stören die Nachtruhe!“

* **Audio:** `assets/audio/dialogues/hospital_maria_maria_maria_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_maria_a]` — **Schwester Maria**
> „Hier ist die Skizze der UV-Markierung. Seien Sie vorsichtig am Flussufer.“

* **Audio:** `assets/audio/dialogues/hospital_maria_maria_end_maria_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A) | 🎁 Belohnung: `evidence_uv_formula`

#### 📍 Knoten `[end_maria_b]` — **Schwester Maria**
> „Der Mann mit dem Gehstock war sehr nervös. Er ist Richtung Altstadt geflohen.“

* **Audio:** `assets/audio/dialogues/hospital_maria_maria_end_maria_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_maria_d]` — **Schwester Maria**
> „Das Spitalpersonal ist über jeden Verdacht erhaben.“

* **Audio:** `assets/audio/dialogues/hospital_maria_maria_end_maria_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 17: `saale_jan_jan` — Fischer Jan
*Knotenanzahl: 12*

#### 📍 Knoten `[start]` — **Fischer Jan**
> „(Kaut auf einer kalten Tabakspfeife, starrt ins Wasser) Petri Heil. Wenn du mir die Forellen verscheuchst mit deinen Stiefeln, fliegst du in die Saale. Was willst du am Fluss?“

* **Audio:** `assets/audio/dialogues/saale_jan_jan_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Empathisch] Ruhige Nacht zum Angeln, Jan. Die Strömung treibt heute einiges mit sich. Haben Sie etwas Ungewöhnliches im Wasser bemerkt? *(führt zu `[jan_empathic]`)*
  * 💬 [Sachlich] Kriminalpolizei. Wir suchen nach vernichteten Urkunden, die flussabwärts getrieben wurden. *(führt zu `[jan_factual]`)*
  * 💬 [Konfrontativ] Schluss mit dem Angeln! Hier verläuft eine Schmugglerroute. Was haben Sie in Ihrem Fangnetz versteckt?! *(führt zu `[jan_confront]`)*

#### 📍 Knoten `[jan_empathic]` — **Fischer Jan**
> „Ungewöhnlich? Vor einer halben Stunde trieben zerrissene Papierfetzen mit roten Wachssiegeln direkt an meiner Pose vorbei. Hab ein paar mit dem Kescher rausgefischt.“

* **Audio:** `assets/audio/dialogues/saale_jan_jan_jan_empathic.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Zeigen Sie mir die Papierfetzen. *(führt zu `[jan_letters]`)*
  * 💬 [Sachlich] Stand jemand am Ufer, als die Papiere trieben? *(führt zu `[jan_person]`)*

#### 📍 Knoten `[jan_factual]` — **Fischer Jan**
> „Am Ufer stand eine Frau im Hosenanzug und zerriss wütend ein Dokument in tausend Stücke. Sie warf es in die Strömung und rief: 'Niemand beweist mir den Pakt!'“

* **Audio:** `assets/audio/dialogues/saale_jan_jan_jan_factual.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Widerspruch aufdecken] Erst sagten Sie, am Fluss sei tote Hose – woher wissen Sie, was sie rief? *(führt zu `[jan_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*
  * 💬 [Beweis vorlegen] Erkennen Sie diesen zerrissenen Drohbrief? *(führt zu `[jan_torn_proof]`, Impact: gipser +15%, Benötigt Beweis: `evidence_torn_letter`)*

#### 📍 Knoten `[jan_confront]` — **Fischer Jan**
> „Fangnetz?! Willst du meine Forellen beschlagnahmen, du Witzbold? Zieh Leine, bevor ich ungemütlich werde!“

* **Audio:** `assets/audio/dialogues/saale_jan_jan_jan_confront.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Einlenken] Entschuldige, Jan. Es geht um einen Großbrand und eine Entführung. *(führt zu `[jan_empathic]`)*
  * 💬 [Druck erhöhen] Du wanderst wegen Hehlerei in die Zelle! *(führt zu `[jan_fail]`)*

#### 📍 Knoten `[jan_contra]` — **Fischer Jan**
> „(Schmunzelt grimmig) Wenn einer nachts am Ufer schreit, hallt das über das ganze Wasser! Eine schwarze Limousine wartete mit laufendem Motor auf sie.“

* **Audio:** `assets/audio/dialogues/saale_jan_jan_jan_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Katharina von Gipser vernichtete Beweise persönlich. *(führt zu `[end_jan_b]`, Impact: gipser +20%)*

#### 📍 Knoten `[jan_letters]` — **Fischer Jan**
> „Hier, ich hab die Schnipsel auf Zeitungspapier getrocknet. Wenn man sie zusammensetzt, liest man eine handfeste Drohung an Dr. Renger!“

* **Audio:** `assets/audio/dialogues/saale_jan_jan_jan_letters.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Beweis sichern] Zerrissener Drohbrief geborgen. *(führt zu `[end_jan_a]`)*

#### 📍 Knoten `[jan_person]` — **Fischer Jan**
> „Es war die Stadträtin Gipser, ganz sicher. Ihre Stimme kenne ich aus dem Lokalfernsehen. Sie war außer sich vor Wut.“

* **Audio:** `assets/audio/dialogues/saale_jan_jan_jan_person.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Aussage sichern] Zeuge bestätigt Gipsers Anwesenheit. *(führt zu `[end_jan_a]`, Impact: gipser +20%)*

#### 📍 Knoten `[jan_torn_proof]` — **Fischer Jan**
> „Genau dieses Schriftstück! Sie hat es in Stücke gerissen. Nehmen Sie die restlichen Teile aus meinem Eimer!“

* **Audio:** `assets/audio/dialogues/saale_jan_jan_jan_torn_proof.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Puzzleteile annehmen] Vollständiger Drohbrief gesichert. *(führt zu `[end_jan_a]`)*

#### 📍 Knoten `[jan_fail]` — **Fischer Jan**
> „Schleich dich! Mit Schnüfflern rede ich nicht!“

* **Audio:** `assets/audio/dialogues/saale_jan_jan_jan_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_jan_a]` — **Fischer Jan**
> „Hier sind die zerrissenen Briefteile. Bringen Sie der Dame Manieren bei!“

* **Audio:** `assets/audio/dialogues/saale_jan_jan_end_jan_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A) | 🎁 Belohnung: `evidence_torn_letter`

#### 📍 Knoten `[end_jan_b]` — **Fischer Jan**
> „Sie ist stromaufwärts gerannt. Sie wirkte wie eine Furie.“

* **Audio:** `assets/audio/dialogues/saale_jan_jan_end_jan_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_jan_d]` — **Fischer Jan**
> „Der Saale-Fischereiverein hat mit den Machenschaften nichts am Hut.“

* **Audio:** `assets/audio/dialogues/saale_jan_jan_end_jan_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 18: `spital_max_max` — Archivgehilfe Max
*Knotenanzahl: 13*

#### 📍 Knoten `[start]` — **Archivgehilfe Max**
> „(Kniet zitternd zwischen verstaubten Folianten im Keller) Wer ist da?! Kommen Sie nicht näher! Ich habe die Gründungsurkunde von 1432 gesichert... Sie dürfen sie nicht verbrennen!“

* **Audio:** `assets/audio/dialogues/spital_max_max_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Empathisch] Ganz ruhig, Max. Ich bin von der Kriminalpolizei. Dr. Renger wollte, dass die Urkunde sicher ist. Ich beschütze Sie. *(führt zu `[max_empathic]`)*
  * 💬 [Sachlich] Max, Sie sind Rengers Assistent. Warum verstecken Sie sich im Gewölbe, statt zur Polizei zu gehen? *(führt zu `[max_factual]`)*
  * 💬 [Konfrontativ] Hände hoch! Sie haben Akten aus dem Archiv gestohlen, bevor das Feuer ausbrach! Sie stehen unter Verdacht! *(führt zu `[max_confront]`)*

#### 📍 Knoten `[max_empathic]` — **Archivgehilfe Max**
> „(Weint vor Erleichterung) Gott sei Dank... Ich dachte, Gipsers Schläger hätten mich gefunden! Renger sagte, wenn ihm etwas zustößt, soll ich die Urkunde von 1432 hierher bringen.“

* **Audio:** `assets/audio/dialogues/spital_max_max_max_empathic.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Warum ist diese Urkunde von 1432 so gefährlich? *(führt zu `[max_why]`)*
  * 💬 [Beweis vorlegen] Gehört dieses Fragment zur Bundessatzung? *(führt zu `[max_charter]`, Benötigt Beweis: `evidence_charter_1432`)*

#### 📍 Knoten `[max_factual]` — **Archivgehilfe Max**
> „Weil der Polizeifunk manipuliert war! Ich hörte vorhin, wie jemand den Notruf am Bahnhof fingierte. Da wusste ich: Niemand ist sicher.“

* **Audio:** `assets/audio/dialogues/spital_max_max_max_factual.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Widerspruch aufdecken] Woher haben Sie Zugriff auf den Polizeifunk? *(führt zu `[max_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*
  * 💬 [Sachlich] Wo ist Dr. Renger jetzt? *(führt zu `[max_renger]`)*

#### 📍 Knoten `[max_confront]` — **Archivgehilfe Max**
> „Gestohlen?! Ich habe das Hofer Kulturerbe vor den Flammen gerettet! Wenn Sie mich verhaften, verbrennen die Erben alles!“

* **Audio:** `assets/audio/dialogues/spital_max_max_max_confront.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Einlenken] Beruhigen Sie sich. Woher wussten Sie vom Brand? *(führt zu `[max_empathic]`)*
  * 💬 [Druck erhöhen] Sie beantworten meine Fragen, oder ich lege Ihnen Handschellen an! *(führt zu `[max_fail]`)*

#### 📍 Knoten `[max_contra]` — **Archivgehilfe Max**
> „Renger hatte einen Scanner in der Stube! Er wusste, dass man ihn abhört. Er sagte mir vor seiner Verschleppung noch das Versteck im Bunker!“

* **Audio:** `assets/audio/dialogues/spital_max_max_max_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Welcher Bunker? *(führt zu `[max_bunker]`)*

#### 📍 Knoten `[max_why]` — **Archivgehilfe Max**
> „Die Satzung von 1432 beweist, dass die Handwerkerprivilegien unkündbar sind. Wenn dieses Dokument öffentlich wird, verliert Katharina von Gipser alle Baugenehmigungen und Herold seine Kunstprivilegien!“

* **Audio:** `assets/audio/dialogues/spital_max_max_max_why.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Die Urkunde entzieht den Verdächtigen die Existenz. *(führt zu `[end_max_a]`, Impact: gipser +15%)*

#### 📍 Knoten `[max_renger]` — **Archivgehilfe Max**
> „Heiden hat ihn verschleppt! Er brachte ihn zum Turm von St. Michaelis. Er will ihn zwingen, den Pakt vor Gott zu erneuern!“

* **Audio:** `assets/audio/dialogues/spital_max_max_max_renger.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Renger ist im Turm von St. Michaelis. *(führt zu `[end_max_a]`, Impact: heiden +20%)*

#### 📍 Knoten `[max_bunker]` — **Archivgehilfe Max**
> „Das Schlappen-Versteck in der Unteren Vorstadt. Dort lagert der Pakt-Tresor. Ein Bote bewacht den Zugang.“

* **Audio:** `assets/audio/dialogues/spital_max_max_max_bunker.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Hinweis notieren] Bunker als Zielort identifiziert. *(führt zu `[end_max_a]`)*

#### 📍 Knoten `[max_charter]` — **Archivgehilfe Max**
> „Das ist das Originalsiegel! Nehmen Sie die Satzung von 1432. Damit haben Sie die unumstößliche Wahrheit in den Händen!“

* **Audio:** `assets/audio/dialogues/spital_max_max_max_charter.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Urkunde annehmen] Das Kronjuwel der Beweisführung. *(führt zu `[end_max_a]`)*

#### 📍 Knoten `[max_fail]` — **Archivgehilfe Max**
> „(Versteckt sich in einer Mauernische) Ich traue niemandem mehr! Verschwinden Sie!“

* **Audio:** `assets/audio/dialogues/spital_max_max_max_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_max_a]` — **Archivgehilfe Max**
> „Hier ist die Bundessatzung von 1432. Retten Sie Dr. Renger und Hofs Ehre!“

* **Audio:** `assets/audio/dialogues/spital_max_max_end_max_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A) | 🎁 Belohnung: `evidence_charter_1432`

#### 📍 Knoten `[end_max_b]` — **Archivgehilfe Max**
> „Beeilen Sie sich. Wenn Heiden das Feuer im Turm legt, ist alles verloren.“

* **Audio:** `assets/audio/dialogues/spital_max_max_end_max_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_max_d]` — **Archivgehilfe Max**
> „Max ist der Retter der Urkunden, kein Brandstifter.“

* **Audio:** `assets/audio/dialogues/spital_max_max_end_max_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 19: `versteck_bote_bote` — Schattenhafter Bote
*Knotenanzahl: 12*

#### 📍 Knoten `[start]` — **Schattenhafter Bote**
> „(Steht vermummt im Schutz des Bunkers, Hand an der Jackentasche) Sie haben die Fährte bis hierher verfolgt, Ermittler. Aber der Pakt von 1823 überdauert Jahrhunderte. Sie kommen zu spät, um die Verträge zu retten.“

* **Audio:** `assets/audio/dialogues/versteck_bote_bote_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Empathisch / Subtil] Der Pakt bricht bereits auseinander. Ihre Auftraggeber beschuldigen sich gegenseitig. Wollen Sie für fremde Verbrechen büßen? *(führt zu `[bote_empathic]`)*
  * 💬 [Sachlich] Nennen Sie das Codewort und treten Sie vom Tresor zurück. Der Bunker ist umstellt. *(führt zu `[bote_factual]`)*
  * 💬 [Konfrontativ] Keine Bewegung! Hände an die Wand! Ihr Geheimbund ist aufgeflogen, Sie sind verhaftet! *(führt zu `[bote_confront]`)*

#### 📍 Knoten `[bote_empathic]` — **Schattenhafter Bote**
> „(Zögert) Gegenseitig beschuldigt? Gipser und Herold? Ich sollte nur die letzte Kassette sichern und auf das Boot warten.“

* **Audio:** `assets/audio/dialogues/versteck_bote_bote_bote_empathic.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Wer hat Ihnen den Schlüssel für den Tresor gegeben? *(führt zu `[bote_key]`)*
  * 💬 [Widerspruch aufdecken] Eben schworen Sie noch ewige Treue zum Bund – und jetzt zweifeln Sie? *(führt zu `[bote_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*

#### 📍 Knoten `[bote_factual]` — **Schattenhafter Bote**
> „Der Tresor öffnet sich nur mit dem Scanner oder dem Siegelring der Schlappen-Erben. Ohne das Siegel bleibt das Geheimnis für immer im Stahl verwahrt.“

* **Audio:** `assets/audio/dialogues/versteck_bote_bote_bote_factual.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Beweis vorlegen] Meinen Sie diesen Sekten-Siegelring? *(führt zu `[bote_ring_check]`, Benötigt Beweis: `beweis_pakt_ring`)*
  * 💬 [Sachlich] Was befindet sich im Tresor? *(führt zu `[bote_inside]`)*

#### 📍 Knoten `[bote_confront]` — **Schattenhafter Bote**
> „Verhaftet?! Keiner nimmt einen Boten des Pakts lebend! Ich lasse den Bunker sprengen, wenn Sie näherkommen!“

* **Audio:** `assets/audio/dialogues/versteck_bote_bote_bote_confront.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Einlenken] Beruhigen Sie sich. Es geht um Dr. Renger. Wo ist er? *(führt zu `[bote_empathic]`)*
  * 💬 [Druck erhöhen] Wagen Sie es nicht! Zugriff! *(führt zu `[bote_fail]`)*

#### 📍 Knoten `[bote_contra]` — **Schattenhafter Bote**
> „Wenn Herold und Gipser mich verraten haben, warum sollte ich für sie sterben?! Herold hat die Schatulle geplündert und Heiden hat den Archivar entführt!“

* **Audio:** `assets/audio/dialogues/versteck_bote_bote_bote_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Geständnis sichern] Die Schuldigen sind entlarvt. *(führt zu `[end_bote_a]`, Impact: herold +20%)*

#### 📍 Knoten `[bote_key]` — **Schattenhafter Bote**
> „Valentin Herold gab mir den Auftrag. Er wollte die letzte Brandkassette vor den Baggern der Gipser retten. Hier ist der Tresorschlüssel!“

* **Audio:** `assets/audio/dialogues/versteck_bote_bote_bote_key.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlüssel annehmen] Tresorschlüssel gesichert. *(führt zu `[end_bote_a]`, Impact: herold +20%)*

#### 📍 Knoten `[bote_inside]` — **Schattenhafter Bote**
> „Die originalen Namenslisten aller Erben seit 1823 mit ihren Unterschriften und den gezahlten Bestechungsgeldern.“

* **Audio:** `assets/audio/dialogues/versteck_bote_bote_bote_inside.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Das lückenlose Sündenregister des Pakts. *(führt zu `[end_bote_a]`)*

#### 📍 Knoten `[bote_ring_check]` — **Schattenhafter Bote**
> „Das Siegel der Meister... Sie tragen den Ring. Dann trete ich beiseite. Nehmen Sie die Papiere aus dem Tresor.“

* **Audio:** `assets/audio/dialogues/versteck_bote_bote_bote_ring_check.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Tresor öffnen] Das finale Dokumentenkonvolut erbeutet. *(führt zu `[end_bote_a]`)*

#### 📍 Knoten `[bote_fail]` — **Schattenhafter Bote**
> „(Wirft eine Rauchgranate) Der Pakt wird niemals sterben! (Entkommt durch die Notluke)“

* **Audio:** `assets/audio/dialogues/versteck_bote_bote_bote_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_bote_a]` — **Schattenhafter Bote**
> „Hier ist der geheime Tresorschlüssel. Bringen Sie den Fall zu Ende.“

* **Audio:** `assets/audio/dialogues/versteck_bote_bote_end_bote_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A) | 🎁 Belohnung: `evidence_charter_1432`

#### 📍 Knoten `[end_bote_b]` — **Schattenhafter Bote**
> „Dr. Renger lebt noch. Suchen Sie ihn im Turm von St. Michaelis!“

* **Audio:** `assets/audio/dialogues/versteck_bote_bote_end_bote_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_bote_d]` — **Schattenhafter Bote**
> „Der Bote war nur bezahlter Handlanger ohne eigene Schuld am Brand.“

* **Audio:** `assets/audio/dialogues/versteck_bote_bote_end_bote_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 20: `interrogate_herold` — Valentin Herold
*Knotenanzahl: 15*

#### 📍 Knoten `[start]` — **Valentin Herold**
> „(Sitzt im Ohrensessel, nippt an einem Cognac, stützt sich auf seinen Gehstock mit Löwenknauf) Ein Schnüffler um diese nachtschlafende Zeit? Wenn Sie antike Hofer Fayencen erwerben wollen, beehren Sie mich morgen zu den Geschäftszeiten. Was wollen Sie?“

* **Audio:** `assets/audio/dialogues/interrogate_herold_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Subtil] Herr Herold, die Altstadt steht unter Schock. Ein Spaziergänger mit einem markanten Löwen-Gehstock wurde am Brandherd gesehen. *(führt zu `[herold_subtle]`)*
  * 💬 [Sachlich] Wo waren Sie zwischen 21:30 und 23:00 Uhr? Ihr Name taucht in den alten Verträgen von 1823 auf. *(führt zu `[herold_direct]`)*
  * 💬 [Konfrontativ] Sparen Sie sich das Schauspiel! Ihr Futteral wurde am Bahnhof gesehen. Sie haben das Archiv geplündert! *(führt zu `[herold_aggress]`)*

#### 📍 Knoten `[herold_subtle]` — **Valentin Herold**
> „Brandherd? Bedauerlich für die historische Bausubstanz, aber meine Sammlungen ruhen sicher in meinem Gewölbe. Jeder zweite Herr in meinem Alter trägt Spazierstöcke. Das beweist gar nichts.“

* **Audio:** `assets/audio/dialogues/interrogate_herold_herold_subtle.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Subtil] Dr. Renger sprach neulich von alten Urkunden, die Ihren Kunsthandel ruinieren könnten... *(führt zu `[herold_subtle_2]`)*
  * 💬 [Beweis vorlegen] Wie erklären Sie sich diese antike Taschenuhr, die Wachmann Rolf von Ihnen erhielt? *(führt zu `[herold_evidence_watch]`, Impact: herold +20%, Benötigt Beweis: `beweis_antike_uhr`)*
  * 💬 [Widerspruch aufdecken] Vorhin sagten Sie, Sie waren den ganzen Abend im Salon – Rolf bezeugt das Gegenteil! *(führt zu `[herold_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*

#### 📍 Knoten `[herold_direct]` — **Valentin Herold**
> „Ich? Am Brandherd? Ihr Zeuge muss betrunken gewesen sein. Ich habe den Abend allein bei der Lektüre einer Jean-Paul-Erstausgabe verbracht. Ungestört.“

* **Audio:** `assets/audio/dialogues/interrogate_herold_herold_direct.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Widerspruch aufdecken] Allein bei der Lektüre? Schwester Maria sah Sie an der Hospitalkirche, Erna im Biengässchen! *(führt zu `[herold_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*
  * 💬 [Beweis vorlegen] Und warum zeigt dieses Polaroid einen Mann mit Ihrem Futteral auf der Flucht? *(führt zu `[herold_evidence_polaroid]`, Impact: herold +25%, Benötigt Beweis: `evidence_polaroid_station`)*

#### 📍 Knoten `[herold_aggress]` — **Valentin Herold**
> „Wie können Sie es wagen?! Wenn Sie keine hieb- und stichfesten Beweise haben, lasse ich Sie wegen Verleumdung aus dem Polizeidienst entfernen!“

* **Audio:** `assets/audio/dialogues/interrogate_herold_herold_aggress.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Beweis vorlegen] Hier, dieses Foto vom Bahnhof: Sie auf der Flucht mit der geraubten Brandkassette! *(führt zu `[herold_evidence_polaroid]`, Impact: herold +25%, Benötigt Beweis: `evidence_polaroid_station`)*
  * 💬 [Beweis vorlegen] Und Wachmann Rolfs Geständnis über Ihre Bestechung! *(führt zu `[herold_evidence_watch]`, Impact: herold +20%, Benötigt Beweis: `beweis_antike_uhr`)*
  * 💬 [Druck erhöhen] Geben Sie es zu, Herold! Sie haben das Feuer gelegt! *(führt zu `[herold_fail]`)*

#### 📍 Knoten `[herold_contra]` — **Valentin Herold**
> „(Er schwitzt merklich, tupft sich die Stirn mit einem Seidentuch ab) Sie... Sie verdrehen meine Worte! Gut, ich war kurz draußen. Um frische Nachtluft zu schnappen! Das ist kein Verbrechen!“

* **Audio:** `assets/audio/dialogues/interrogate_herold_herold_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Konfrontativ] Um frische Luft zu schnappen bricht man nicht in Kanzleiarchive ein! *(führt zu `[herold_confess_theft]`)*
  * 💬 [Sachlich] Haben Sie mit Katharina von Gipser zusammengearbeitet? *(führt zu `[herold_blame_gipser]`)*

#### 📍 Knoten `[herold_subtle_2]` — **Valentin Herold**
> „Renger war ein pedantischer Narr! Diese Verträge gehören in die Vitrinen von Liebhabern, nicht in ein feuchtes Kellerarchiv. Aber ich habe das Feuer nicht gelegt!“

* **Audio:** `assets/audio/dialogues/interrogate_herold_herold_subtle_2.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Wer hat es dann gelegt? *(führt zu `[herold_blame_gipser]`)*

#### 📍 Knoten `[herold_evidence_watch]` — **Valentin Herold**
> „(Zuckt zusammen) Die Uhr... Rolf, dieser elende Verräter! Hören Sie... Ja, ich habe ihn bezahlt, um mir Zugang zum Archiv zu verschaffen. Aber als ich ankam, brannte es bereits lichterloh!“

* **Audio:** `assets/audio/dialogues/interrogate_herold_herold_evidence_watch.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Konfrontativ] Sie wollten die Urkunden stehlen! *(führt zu `[herold_confess_theft]`)*
  * 💬 [Sachlich] Wer legte das Feuer vor Ihnen? *(führt zu `[herold_blame_heiden]`)*

#### 📍 Knoten `[herold_evidence_polaroid]` — **Valentin Herold**
> „(Presst die Lippen zusammen) Verfluchte Reporter... Das beweist gar nichts! Aber gut: Ich war am Rathaus. Ich musste die Dokumente vor den Baggern der Gipser retten!“

* **Audio:** `assets/audio/dialogues/interrogate_herold_herold_evidence_polaroid.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Konfrontativ] Retten, um sie auf dem Schwarzmarkt zu verkaufen! *(führt zu `[herold_confess_theft]`)*
  * 💬 [Sachlich] Was wissen Sie über Gipsers Pläne? *(führt zu `[herold_blame_gipser]`)*

#### 📍 Knoten `[herold_confess_theft]` — **Valentin Herold**
> „Kunst muss frei sein! Die Bürokraten hätten alles verrotten lassen. Ja, ich habe die Brandkassette mit den Originalen genommen. Aber ich schwöre bei meiner Familienehre: Ich habe Renger nicht entführt und das Feuer nicht gelegt!“

* **Audio:** `assets/audio/dialogues/interrogate_herold_herold_confess_theft.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Verhör beenden] Geständnis des Diebstahls und Hehlerei gesichert. *(führt zu `[end_herold_a]`)*

#### 📍 Knoten `[herold_blame_gipser]` — **Valentin Herold**
> „Katharina von Gipser! Sie hat Millionen in Bauland am Saaleufer investiert. Die Urkunden hätten ihre Baugenehmigungen vernichtet. Sie hat Renger verschleppen lassen, um ihn zum Schweigen zu bringen!“

* **Audio:** `assets/audio/dialogues/interrogate_herold_herold_blame_gipser.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Und Severin Heiden? *(führt zu `[herold_blame_heiden]`)*
  * 💬 [Schlussfolgerung] Gipsers Motiv ist Profitgier. *(führt zu `[end_herold_b]`, Impact: gipser +15%)*

#### 📍 Knoten `[herold_blame_heiden]` — **Valentin Herold**
> „Severin Heiden ist der wahre Wahnsinnige! Er hält sich für den Vollstrecker Gottes. Er hat das Feuer gelegt, um die 'Sünde' zu verbrennen, und Renger in den Kirchturm gesperrt!“

* **Audio:** `assets/audio/dialogues/interrogate_herold_herold_blame_heiden.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Heiden ist der Brandstifter und Entführer. *(führt zu `[end_herold_b]`, Impact: heiden +20%)*

#### 📍 Knoten `[herold_fail]` — **Valentin Herold**
> „Das reicht! Ich sage kein Wort mehr ohne meinen Anwalt. Verlassen Sie augenblicklich mein Anwesen!“

* **Audio:** `assets/audio/dialogues/interrogate_herold_herold_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_herold_a]` — **Valentin Herold**
> „Ich gestehe den Diebstahl der Kassette. Hier ist die Kombination für meinen Tresor: 18-23-0. Aber retten Sie Renger vor Heiden!“

* **Audio:** `assets/audio/dialogues/interrogate_herold_end_herold_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A)

#### 📍 Knoten `[end_herold_b]` — **Valentin Herold**
> „Nehmen Sie Gipser und Heiden fest. Die beiden zerstören diese Stadt.“

* **Audio:** `assets/audio/dialogues/interrogate_herold_end_herold_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_herold_d]` — **Valentin Herold**
> „Herold ist vom Vorwurf der Brandstiftung und Entführung entlastet – bleibt aber Hehler.“

* **Audio:** `assets/audio/dialogues/interrogate_herold_end_herold_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 21: `interrogate_gipser` — Katharina von Gipser
*Knotenanzahl: 15*

#### 📍 Knoten `[start]` — **Katharina von Gipser**
> „(Mustert Sie kühl im eleganten Kostüm) Sie haben genau zwei Minuten meiner Zeit. Ich koordiniere gerade ein millionenschweres Investoren-Konsortium für die Saaleufer-Sanierung. Machen Sie es kurz.“

* **Audio:** `assets/audio/dialogues/interrogate_gipser_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Subtil] Ein ehrgeiziges Projekt, Frau Stadträtin. Doch alte Eigentumsrechte aus dem Jahr 1823 hätten dieses Projekt augenblicklich gestoppt. *(führt zu `[gipser_subtle]`)*
  * 💬 [Sachlich] Eine schwarze Limousine mit dem Kennzeichen HO-KG 1823 wurde bei der Flucht vom Brandherd gefilmt. Wem gehört dieser Wagen? *(führt zu `[gipser_direct]`)*
  * 💬 [Konfrontativ] Sparen Sie sich die Arroganz! Ihre Kurierfahrer haben Akten aus dem Archiv geschmuggelt. Sie haben den Brand in Auftrag gegeben! *(führt zu `[gipser_aggress]`)*

#### 📍 Knoten `[gipser_subtle]` — **Katharina von Gipser**
> „Alte Eigentumsrechte sind irrelevant. Hof braucht Arbeitsplätze, Beton und Fortschritt. Wer sich dem Fortschritt in den Weg stellt, bleibt auf der Strecke.“

* **Audio:** `assets/audio/dialogues/interrogate_gipser_gipser_subtle.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] So wie Dr. Renger auf der Strecke blieb? *(führt zu `[gipser_renger]`)*
  * 💬 [Beweis vorlegen] Erklären Sie mir diese brisanten Frachtpapiere mit Ihrem Amtssiegel! *(führt zu `[gipser_evidence_papers]`, Impact: gipser +25%, Benötigt Beweis: `beweis_frachtpapiere`)*
  * 💬 [Widerspruch aufdecken] Eben sagten Sie, Renger sei irrelevant – nun geben Sie zu, dass er dem Fortschritt im Weg stand? *(führt zu `[gipser_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*

#### 📍 Knoten `[gipser_direct]` — **Katharina von Gipser**
> „Mein Chauffeur hatte den Auftrag, Dr. Renger ein großzügiges Angebot für seine Kooperation zu unterbreiten. Als er ankam, war Renger nicht mehr da.“

* **Audio:** `assets/audio/dialogues/interrogate_gipser_gipser_direct.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Widerspruch aufdecken] Ihr Chauffeur wollte nur verhandeln? Zeugen sahen, wie er Aktenkisten verladen hat! *(führt zu `[gipser_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*
  * 💬 [Beweis vorlegen] Hier ist das Foto Ihrer Limousine mit Kisten im Kofferraum! *(führt zu `[gipser_evidence_car]`, Impact: gipser +25%, Benötigt Beweis: `foto_gipser_auto`)*

#### 📍 Knoten `[gipser_aggress]` — **Katharina von Gipser**
> „Vorsicht! Meine Anwälte werden Sie in Grund und Boden klagen! Sie haben keinerlei handfeste Beweise gegen eine amtierende Stadträtin!“

* **Audio:** `assets/audio/dialogues/interrogate_gipser_gipser_aggress.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Beweis vorlegen] Was ist mit dem zerrissenen Drohbrief, den Fischer Jan aus der Saale fischte? *(führt zu `[gipser_evidence_letter]`, Impact: gipser +25%, Benötigt Beweis: `evidence_torn_letter`)*
  * 💬 [Beweis vorlegen] Und den Frachtpapieren, unterzeichnet von Ihrem Bauamt? *(führt zu `[gipser_evidence_papers]`, Impact: gipser +20%, Benötigt Beweis: `beweis_frachtpapiere`)*
  * 💬 [Druck erhöhen] Sie wandern heute Nacht in Untersuchungshaft! *(führt zu `[gipser_fail]`)*

#### 📍 Knoten `[gipser_contra]` — **Katharina von Gipser**
> „(Ihre Hände zittern leicht, sie ballt die Fäuste) Renger war unbelehrbar! Ein verstaubter Bürokrat, der sich an zweihundert Jahre alte Klauseln klammerte! Er hätte das gesamte Saaleufer blockiert!“

* **Audio:** `assets/audio/dialogues/interrogate_gipser_gipser_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Konfrontativ] Also haben Sie ihn verschleppen lassen! *(führt zu `[gipser_confess_crime]`)*
  * 💬 [Sachlich] Wer legte das Feuer im Archiv? *(führt zu `[gipser_blame_others]`)*

#### 📍 Knoten `[gipser_renger]` — **Katharina von Gipser**
> „Renger wurde von Severin Heiden entführt! Der Organist ist ein religiöser Fanatiker. Er erpresste mich mit den Verträgen. Er forderte Geld für seine Kirche!“

* **Audio:** `assets/audio/dialogues/interrogate_gipser_gipser_renger.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Und was haben Sie getan? *(führt zu `[gipser_blame_others]`)*

#### 📍 Knoten `[gipser_evidence_papers]` — **Katharina von Gipser**
> „(Wird blass, fängt sich aber sofort) Das sind reine Umzugsformulare... Na schön. Ja, ich wollte die alten Papiere vernichten lassen. Im Schredder. Aber der Brand war Heidens Werk!“

* **Audio:** `assets/audio/dialogues/interrogate_gipser_gipser_evidence_papers.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Konfrontativ] Sie geben die Urkundenvernichtung zu! *(führt zu `[gipser_confess_crime]`)*

#### 📍 Knoten `[gipser_evidence_car]` — **Katharina von Gipser**
> „Mein Chauffeur handelte auf meine Anweisung. Wir mussten verhindern, dass Herold die Akten ins Ausland verkauft. Aber das Feuer nützte mir nichts – es vernichtete die Baugrund-Nachweise!“

* **Audio:** `assets/audio/dialogues/interrogate_gipser_gipser_evidence_car.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Gipser gesteht die Aktenräumung. *(führt zu `[gipser_confess_crime]`)*

#### 📍 Knoten `[gipser_evidence_letter]` — **Katharina von Gipser**
> „Der Drohbrief... Jan hat ihn gefunden? Verdammt. Ja, ich habe Renger gedroht. Aber ich habe ihn nicht angerührt!“

* **Audio:** `assets/audio/dialogues/interrogate_gipser_gipser_evidence_letter.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Geständnis sichern] Nötigung und Aktenvernichtung belegt. *(führt zu `[gipser_confess_crime]`)*

#### 📍 Knoten `[gipser_confess_crime]` — **Katharina von Gipser**
> „Ich gestehe die Beseitigung der Dokumente. Die Aktenreste liegen im Schredder in meinem Büro. Wenn Sie das Puzzle zusammensetzen, haben Sie die Beweise. Aber Heiden hat das Feuer gelegt und Renger entführt!“

* **Audio:** `assets/audio/dialogues/interrogate_gipser_gipser_confess_crime.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Verhör beenden] Gipsers Schuld vollständig dokumentiert. *(führt zu `[end_gipser_a]`)*

#### 📍 Knoten `[gipser_blame_others]` — **Katharina von Gipser**
> „Nehmen Sie Herold fest, der giert nach Gold. Und stoppen Sie Heiden an St. Michaelis, bevor er den Turm sprengt!“

* **Audio:** `assets/audio/dialogues/interrogate_gipser_gipser_blame_others.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Schlussfolgerung] Heiden ist das ultimative Sicherheitsrisiko. *(führt zu `[end_gipser_b]`, Impact: heiden +20%)*

#### 📍 Knoten `[gipser_fail]` — **Katharina von Gipser**
> „Ich rufe sofort den Innenminister an! Sie sind suspendiert, Herr Ermittler! Kein Wort mehr!“

* **Audio:** `assets/audio/dialogues/interrogate_gipser_gipser_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_gipser_a]` — **Katharina von Gipser**
> „Hier ist der Schlüssel zu meinem Büro. Das Schredder-Puzzle enthüllt den Pakt. Retten Sie Renger vor Heiden!“

* **Audio:** `assets/audio/dialogues/interrogate_gipser_end_gipser_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A)

#### 📍 Knoten `[end_gipser_b]` — **Katharina von Gipser**
> „Ich werde mich vor Gericht verantworten. Aber Heiden muss gestoppt werden.“

* **Audio:** `assets/audio/dialogues/interrogate_gipser_end_gipser_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_gipser_d]` — **Katharina von Gipser**
> „Gipser gesteht Urkundenunterdrückung, ist aber vom Vorwurf der Brandstiftung entlastet.“

* **Audio:** `assets/audio/dialogues/interrogate_gipser_end_gipser_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---

### Dialogbaum 22: `interrogate_heiden` — Severin Heiden
*Knotenanzahl: 15*

#### 📍 Knoten `[start]` — **Severin Heiden**
> „(Steht am Orgel-Spieltisch von St. Michaelis, dreht sich langsam mit glühenden Augen um) Sie wandeln in der Finsternis, Suchender. Hören Sie, wie das Holz knarrt? Die Sünde von 1823 lastet auf diesem Boden. Was wollen Sie vor dem Angesicht des Herrn?“

* **Audio:** `assets/audio/dialogues/interrogate_heiden_start.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Subtil] Herr Heiden, die Musik von Johann Sebastian Bach spricht von Gnade, nicht von Zerstörung. Warum sprechen Sie von Feuer und Strafe? *(führt zu `[heiden_subtle]`)*
  * 💬 [Sachlich] Am Tatort wurde ein rußiges Notenblatt mit der Tonfolge B-A-C-H gefunden. Es trägt Ihre Handschrift. *(führt zu `[heiden_direct]`)*
  * 💬 [Konfrontativ] Sie haben Dr. Renger entführt und im Turm eingesperrt! Öffnen Sie den Turm, bevor es zu spät ist! *(führt zu `[heiden_aggress]`)*

#### 📍 Knoten `[heiden_subtle]` — **Severin Heiden**
> „Gnade gibt es nur für die Reinen! Der Pakt der Schlappen-Erben war ein teuflischer Verrat. Die Gründerväter schworen, Hof im Glauben zu einen – stattdessen wählten sie Gold und Gier. Das Feuer muss reinigen!“

* **Audio:** `assets/audio/dialogues/interrogate_heiden_heiden_subtle.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Sachlich] Welche Reinigung meinen Sie? *(führt zu `[heiden_cleanse]`)*
  * 💬 [Beweis vorlegen] Diese Chor-Notiz beweist, dass Sie den Brand minutiös geplant haben! *(führt zu `[heiden_evidence_choir]`, Impact: heiden +25%, Benötigt Beweis: `beweis_chorknaben_notiz`)*
  * 💬 [Widerspruch aufdecken] Mesnerin Gertrud bezeugt, dass Sie um 21:35 Uhr die Kirche mit Petroleum verließen! *(führt zu `[heiden_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*

#### 📍 Knoten `[heiden_direct]` — **Severin Heiden**
> „Die Tonfolge B-A-C-H ist der göttliche Schlüssel! Vier Töne, vier Siegel, vier Zeitalter! Das Notenblatt war mein Urteil über das sündige Archiv!“

* **Audio:** `assets/audio/dialogues/interrogate_heiden_heiden_direct.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Widerspruch aufdecken] Karl sah Sie um 22:15 Uhr am Sonnenplatz mit rußigen Händen – Sie leugnen nicht mehr? *(führt zu `[heiden_contra]`, ⚡ WIDERSPRUCH ENTDECKT (+15 Pkt))*
  * 💬 [Beweis vorlegen] Hier ist das gerettete Notenblatt aus dem Ruß! *(führt zu `[heiden_evidence_sheet]`, Impact: heiden +25%, Benötigt Beweis: `notenblatt_heiden`)*

#### 📍 Knoten `[heiden_aggress]` — **Severin Heiden**
> „Eingesperrt?! Ich habe ihn vor den Wölfen gerettet! Gipser wollte ihn töten, Herold wollte ihn berauben! Ich habe ihn an den Altar des Höchsten gebracht!“

* **Audio:** `assets/audio/dialogues/interrogate_heiden_heiden_aggress.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Beweis vorlegen] Renger schwebt in Lebensgefahr! Sehen Sie dieses Abhörprotokoll! *(führt zu `[heiden_evidence_wiretap]`, Impact: heiden +20%, Benötigt Beweis: `evidence_wiretap_log`)*
  * 💬 [Druck erhöhen] Geben Sie auf, Heiden! Die Polizei umstellt die Kirche! *(führt zu `[heiden_fail]`)*

#### 📍 Knoten `[heiden_contra]` — **Severin Heiden**
> „(Lacht hysterisch auf, das Lachen hallt im Kirchenschiff wider) Glauben Sie, irdische Gesetze kümmern mich noch?! Ja! Ich habe das Feuer im Gewölbe gelegt! Das gereinigte Feuer von 1823!“

* **Audio:** `assets/audio/dialogues/interrogate_heiden_heiden_contra.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Konfrontativ] Sie gestehen die Brandstiftung! *(führt zu `[heiden_confess_all]`)*
  * 💬 [Sachlich] Wo ist Dr. Renger?! *(führt zu `[heiden_renger_loc]`)*

#### 📍 Knoten `[heiden_cleanse]` — **Severin Heiden**
> „Die Verträge müssen vergehen, damit die Stadt neu ersteht. Renger weigerte sich, die Urkunden dem Feuer zu übergeben. Er wollte sie publizieren! Der Narr verstand die Heiligkeit des Geheimnisses nicht!“

* **Audio:** `assets/audio/dialogues/interrogate_heiden_heiden_cleanse.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Konfrontativ] Deshalb haben Sie ihn gefesselt! *(führt zu `[heiden_confess_all]`)*

#### 📍 Knoten `[heiden_evidence_choir]` — **Severin Heiden**
> „Meine Chor-Notiz... ja. Ich habe die Flammen nach dem Takt der Passion dirigiert. Hof sollte brennen wie vor zweihundert Jahren!“

* **Audio:** `assets/audio/dialogues/interrogate_heiden_heiden_evidence_choir.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Vollgeständnis festhalten] Geständnis der Brandstiftung. *(führt zu `[heiden_confess_all]`)*

#### 📍 Knoten `[heiden_evidence_sheet]` — **Severin Heiden**
> „Das Notenblatt aus der Asche! Sie haben es gerettet?! Dann ist der Pakt vollendet. Der Turm öffnet sich nur dem, der die Orgel mit den Tönen B-A-C-H bespielt!“

* **Audio:** `assets/audio/dialogues/interrogate_heiden_heiden_evidence_sheet.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Orgel-Herausforderung annehmen] Der Code zum Turm. *(führt zu `[end_heiden_a]`)*

#### 📍 Knoten `[heiden_evidence_wiretap]` — **Severin Heiden**
> „Das Abhörprotokoll... Sie wissen alles. Es ist vollbracht. Die Sünde ist offenbar.“

* **Audio:** `assets/audio/dialogues/interrogate_heiden_heiden_evidence_wiretap.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Kapitulation erzwingen] Heiden bricht zusammen. *(führt zu `[end_heiden_a]`)*

#### 📍 Knoten `[heiden_renger_loc]` — **Severin Heiden**
> „Er ist oben im Südturm! Die Tür ist verriegelt durch das Orgel-Kryptex. Spielen Sie B-A-C-H auf den Pfeifen, und die Pforte weicht!“

* **Audio:** `assets/audio/dialogues/interrogate_heiden_heiden_renger_loc.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Zum Finale antreten] Ich werde Renger befreien. *(führt zu `[end_heiden_a]`)*

#### 📍 Knoten `[heiden_confess_all]` — **Severin Heiden**
> „Ich bekenne mich schuldig vor Gott und den Menschen! Ich legte das Feuer, ich entführte Renger, ich hütete den Pakt! Bringen Sie mich vor das Gericht, aber hören Sie vorher die Orgel!“

* **Audio:** `assets/audio/dialogues/interrogate_heiden_heiden_confess_all.mp3`
* **Antwortmöglichkeiten des Spielers:**
  * 💬 [Verhör beenden] Volles Geständnis des Haupttäters gesichert. *(führt zu `[end_heiden_a]`)*

#### 📍 Knoten `[heiden_fail]` — **Severin Heiden**
> „(Verfällt in lautes lateinisches Gebet, schlägt wild auf die Orgeltasten ein und reagiert auf kein Wort mehr)“

* **Audio:** `assets/audio/dialogues/interrogate_heiden_heiden_fail.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_C)

#### 📍 Knoten `[end_heiden_a]` — **Severin Heiden**
> „Das Kryptex an der Orgel ist aktiv. Spielen Sie B-A-C-H, um Dr. Renger im Südturm zu befreien!“

* **Audio:** `assets/audio/dialogues/interrogate_heiden_end_heiden_a.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_A)

#### 📍 Knoten `[end_heiden_b]` — **Severin Heiden**
> „Der Herr sei seiner Seele gnädig. Ich habe meine Pflicht getan.“

* **Audio:** `assets/audio/dialogues/interrogate_heiden_end_heiden_b.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_B)

#### 📍 Knoten `[end_heiden_d]` — **Severin Heiden**
> „Heiden handelte im religiösen Wahn ohne Geldgier.“

* **Audio:** `assets/audio/dialogues/interrogate_heiden_end_heiden_d.mp3`
* **Status:** 🏁 GESPRÄCHSENDE (OUTCOME_D)

---
