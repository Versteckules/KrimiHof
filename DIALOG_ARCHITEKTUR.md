# Dialog-Architektur: „Der Pakt der Schlappen-Erben“
## Master-Dokument für komplexe Verhöre, Widersprüche & Ermittler-Outcomes

> **Status:** Arbeitsdokument zur Neukonzeption aller Dialogbäume (von „Easy / Linear“ zu „True Detective / Branching“)  
> **Ziel:** Weg von platten 3-Klick-Fragen und vorgegebenen Verdächtigen-Namen. Hin zu authentischer Kriminalistik: Widersprüche aufdecken, Zeugen mit Beweisen konfrontieren, Selbstwidersprüche entlarven, rank-abhängige Dialoge und 3–4 distinkte Outcomes pro Person.

---

## 1. Antwort auf die Kernfrage: „Muss der Baum 20–30 Mal so groß werden?“

**Klare Antwort: Ja bei der Kombinationsvielfalt, aber Nein bei der unkontrollierten Text-Wüste!**

### Warum ein unkontrollierter 30-facher Baum scheitern würde:
Wenn ein einzelner Zeuge statt 4 Knoten plötzlich 120 rein lineare Knoten hätte, würde das Spiel unspielbar, inkonsistent und nicht mehr wartbar werden (exponentielle Verzweigung $2^{10} = 1024$ Endknoten).

### Die professionelle RPG-/Detektiv-Lösung (Hub-and-Spoke + State-Tracking):
Ein Ermittlerbaum wird **in der Kombinatorik um den Faktor 25–30 erweitert**, indem:
1. **Knotenzahl pro Charakter:** Von bisher **3–5 Knoten** auf **16–24 modulare Knoten** steigt (Faktor 4–6 an reinem Text).
2. **Kombinatorische Tiefe:** Durch **3 Verhörstile** (Empathisch/Subtil vs. Sachlich/Direkt vs. Druckvoll/Aggressiv), **Widerspruchs-Prüfungen**, **Beweis-Vorlagen** und **Ermittler-Ränge** ergeben sich **20 bis 30 verschiedene mögliche Gesprächsverläufe** pro Person!
3. **Mehrere echte Outcomes:** Statt einem festen Ende gibt es pro Charakter **3 bis 4 distinkte Ausgänge** (Voller Durchbruch, Teilerfolg, Blockade/Fehlschlag, Falsche Fährte eliminiert).

---

## 2. Die 4 Goldenen Regeln für den Kommissar & die Zeugen

1. **Der Kommissar legt NIEMALS Namen in den Mund:**
   * ❌ *Falsch (bisher):* „Ein feiner Herr mit Gehstock? Valentin Herold!“ oder „Arbeiten Sie für Katharina von Gipser?“
   * ✅ *Richtig (neu):* „Beschreiben Sie den Mann genauer. Was trug er? Welche Statur? Gab es Auffälligkeiten am Gehstock?“ → Der Zeuge nennt Merkmale („Ein silberner Löwenknauf“), der Spieler kombiniert dies im Dossier selbst.
2. **Das Gesetz des Selbst-Widerspruchs:**
   * Jeder Zeuge verstrickt sich in mindestens einem Strang in eine eigene Lüge (z. B. erst behaupten: *„Ich habe drinnen geschlafen und nichts gehört“*, drei Sätze später: *„Nur als dieser Wagen mit dem lauten Auspuff vorbeiraste, habe ich mich erschrocken...“*).
   * Der Kommissar erhält eine Klick-Option: `[Selbstwiderspruch vorhalten]`.
3. **Das Gesetz des Kreuz-Widerspruchs (Zeuge gegen Zeuge):**
   * Aussagen widersprechen sich gegenseitig (z. B. Schwester Maria behauptet, der Verdächtige sei nach Norden gelaufen; Fischer Jan schwört, er sei ins Boot gestiegen).
   * Erst ein gefundener Sachbeweis (z. B. Schlammspuren, Überwachungs-Polaroid, Frachtschein) entscheidet, wer lügt.
4. **Ermittlerstatus & Rang-Mechanik:**
   * **Rang 1–2 (Streifenpolizist / Schnüffler):** Zeugen unterschätzen den Spieler. Sie plaudern unvorsichtig, lassen Details fallen. Harte Konfrontationen scheitern jedoch mangels Respekt.
   * **Rang 3–5 (Inspektor / Sherlock):** Zeugen wissen, mit wem sie reden. Sie sind vorsichtig und abweisend. Schwere Geständnisse lassen sich NUR mit Beweisen im Inventar erzwingen.

---

## 3. Die 4 Standard-Outcomes pro Person

Jeder Dialogbaum besitzt 4 definierte Ausgänge:
* **Outcome A (Voller Ermittlungs-Durchbruch):** Der Zeuge knickt komplett ein oder packt aus. Liefert handfeste Tätermerkmale, schaltet +15 % Schuld beim wahren Täter frei oder händigt ein Beweisstück aus.
* **Outcome B (Teilerfolg / Indiz):** Zeuge bestätigt Teilaspekte, bleibt aber vorsichtig. Liefert +5 % bis +10 % Verdacht oder eine Ortsangabe.
* **Outcome C (Blockade / Verhörabbruch):** Falsche Taktik gewählt (z. B. Zeuge beleidigt/eingeschüchtert ohne Beweis) oder zu hoher Rang ohne Beweise. Zeuge verweigert die Aussage. Kann erst nach Finden eines Beweises erneut befragt werden.
* **Outcome D (Entlastung / Falsche Fährte aufgedeckt):** Schützt den Spieler davor, einen Unschuldigen zu verdächtigen. Entlastet eine Person um -10 % und lenkt den Fokus auf die reale Spur.

---

## 4. Vollständige Matrix: Alle 19 Personen im Detail

---

### Station 1: Historisches Rathaus (Brandherd)

#### 1. Kommissar Stahl (`rathaus_fire_polizist`) – Einsatzleiter Polizei
* **Rolle:** Dienstältester Polizist, übermüdet, skeptisch gegenüber privaten Ermittlungen.
* **Bisheriger Status:** *Easy (4 Knoten)* – Gibt sofort Brandakte raus.
* **Neuer Status:** *Komplex (18 Knoten, 4 Verzweigungsebenen)*.
* **Taktik des Ermittlers:**
  * *Dienstlich-Respektvoll:* Stahl teilt offizielle Brandermittlungen.
  * *Provokant/Hinterfragend:* Stahl wird defensiv, offenbart aber polizeiinterne Pannen (Spuren wurden vernichtet).
* **Selbst-Widerspruch:** Stahl behauptet anfangs, *„Die Absperrung war lückenlos, niemand kam am Tor vorbei“*, gibt aber später zu: *„Als der Notruf vom Bahnhof einging, mussten zwei Streifenwagen abrücken.“*
* **Kreuz-Widerspruch:** Stahl behauptet, der Brand sei ein technischer Kurzschluss gewesen. Paul Stift (Reporter) hat Brandbeschleuniger-Kanister fotografiert.
* **Schlüssel-Beweis:** `evidence_fire_dossier` oder Foto von Brandspuren.
* **Outcomes:**
  * **A (Akteneinsicht + Spur):** Stahl übergibt vertrauliche Notiz über 2 verschiedene Fluchtwege (+15 Kommissarpunkte).
  * **B (Mängelbericht):** Stahl nennt nur die Uhrzeit des Brandausbruchs (21:45 Uhr).
  * **C (Dienstaufsichtsbeschwerde angedroht):** Spieler wird vom Tatort verwiesen, muss mit Reporter Stift vorliebnehmen.
  * **D (Polizei entlastet):** Bestätigt, dass kein Polizist bestochen wurde, sondern schlicht Personalmangel herrschte.

---

#### 2. Paul Stift (`rathaus_fire_reporter`) – Lokalreporter
* **Rolle:** Sensationslüsterner Journalist, lauert hinter Absperrbändern.
* **Bisheriger Status:** *Easy (3 Knoten)* – Gibt sofort Kamera-Gadget frei.
* **Neuer Status:** *Komplex (17 Knoten, 3 Stränge)*.
* **Taktik des Ermittlers:**
  * *Informationsaustausch (Geben & Nehmen):* Reporter teilt Fotos gegen exklusive Zitate.
  * *Polizeidruck:* Drohung mit Beschlagnahmung der Kamera wegen Behinderung der Ermittlungen.
* **Selbst-Widerspruch:** Stift behauptet, *„Ich stand die ganze Zeit hier am Brunnen“*, rutscht dann aber heraus: *„Als ich den Mann am Hinterausgang wegrennen sah, war ich fast auf Armlänge dran!“*
* **Kreuz-Widerspruch:** Stift behauptet, eine Frau sei aus dem Archiv gerannt. Schwester Maria (Station 12) sah dort einen älteren Mann mit Gehstock.
* **Schlüssel-Beweis:** `foto_gipser_auto` (enthüllt Kennzeichen HO-KG 1823).
* **Outcomes:**
  * **A (Beweisfoto gesichert):** Stift übergibt Teleobjektiv-Aufnahme des Fluchtautos (+15 % Gipser).
  * **B (Täterbeschreibung):** Stift beschreibt hinkenden Mann mit Futteral (+10 % Herold).
  * **C (Presseboykott):** Stift verweigert Kooperation, droht mit Schlagzeile.
  * **D (Sensationslüge enttarnt):** Spieler beweist, dass Stifts angebliche „Explosion“ nur eine Verpuffung war.

---

### Station 2: Rotary Brunnen / Hauptpost

#### 3. Nachtkurier Sepp (`post_kurier_sepp`) – Kurierfahrer
* **Rolle:** Abgebrühter Fahrer, verlädt Kisten für anonyme Auftraggeber.
* **Bisheriger Status:** *Easy (4 Knoten)* – Plaudert direkt über Bauamt.
* **Neuer Status:** *Komplex (20 Knoten, 4 Pfade)*.
* **Taktik des Ermittlers:**
  * *Verständnisvoll/Arbeiter-Solidarität:* Sepp klagt über miese Bezahlung und späte Sonderfahrten.
  * *Zoll-/Verkehrskontrolle:* Drohung mit sofortiger Beschlagnahmung des Lieferwagens.
* **Selbst-Widerspruch:** Behauptet: *„Nur Altpapier, reiner Müll fürs Recycling!“* Kurz darauf: *„Ich darf die Kisten auf keinen Fall kippen, hochempfindliche Fracht!“*
* **Kreuz-Widerspruch:** Sepp schwört, er kenne den Absender nicht. Wachmann Rolf (Station 6) sah Sepp persönlich mit Gipsers Chauffeur verhandeln.
* **Schlüssel-Beweis:** `beweis_frachtpapiere` (Lieferschein mit Stadtrats-Stempel).
* **Outcomes:**
  * **A (Volles Geständnis):** Sepp gibt zu, dass die Kisten Akten aus dem Archiv enthielten (+15 % Gipser).
  * **B (Teilgeständnis):** Sepp nennt den Übergabeort an der Saale.
  * **C (Schweigen wie ein Grab):** Sepp schmeißt die Hecktür zu: *„Ohne Anwalt sag ich gar nix!“*
  * **D (Entlastung als ahnungsloser Fahrer):** Beweist, dass Sepp den Inhalt nicht kannte und nur Frachtgeld kassierte.

---

### Station 3: Wittelsbacher Park (Der Obelisk)

#### 4. Dr. Blume (`obelisk_blume_blume`) – Historiker & Archivar-Freund
* **Rolle:** Ängstlicher Gelehrter, fürchtet, das nächste Opfer zu werden.
* **Bisheriger Status:** *Easy (3 Knoten)* – Gibt Zahlencode für Koffer sofort preis.
* **Neuer Status:** *Komplex (19 Knoten, 4 Stränge)*.
* **Taktik des Ermittlers:**
  * *Akademischer Dialog / Historisches Vertrauen:* Blume teilt Rengers geheime Forschung über 1823.
  * *Personenschutz anbieten:* Blume beruhigt sich und spricht über geheime Treffen.
* **Selbst-Widerspruch:** Blume: *„Renger und ich hatten seit Monaten keinen Kontakt mehr.“* Später: *„Er rief mich noch vor drei Stunden in Panik aus einer Telefonzelle an!“*
* **Kreuz-Widerspruch:** Blume behauptet, Renger habe Angst vor Heiden gehabt. Lisa (Station 8) behauptet, Renger habe sich mit Herold gestritten.
* **Schlüssel-Beweis:** `evidence_cipher_paper` (Chiffrierter Schuldschein).
* **Outcomes:**
  * **A (Entschlüsselung des Pakts):** Blume enthüllt den historischen Code des Aktenkoffers (+15 Kommissarpunkte, +10 % auf alle Verdächtigen).
  * **B (Warnung vor dem Geheimbund):** Blume nennt Heidens Fanatismus (+10 % Heiden).
  * **C (Panik-Flucht):** Blume hält den Kommissar für einen Attentäter und rennt davon.
  * **D (Theorie-Korrektur):** Widerlegt die Theorie, dass Dr. Renger den Brand selbst gelegt hat.

---

### Station 4: St. Lorenz (Die Gruft)

#### 5. Pfarrer Klement (`lorenz_klement_klement`) – Geistlicher
* **Rolle:** Würdevoll, verschwiegen, bindet sich ans Beichtgeheimnis.
* **Bisheriger Status:** *Easy (3 Knoten)* – Weicht kaum aus.
* **Neuer Status:** *Komplex (22 Knoten, 4 Pfade)*.
* **Taktik des Ermittlers:**
  * *Moralischer Appell:* Rengers Leben steht auf dem Spiel, Beichtgeheimnis schützt keine Mörder.
  * *Konfrontation mit Kirchenfinanzen:* Spendenbücher von 1823 vorlegen.
* **Selbst-Widerspruch:** Klement: *„Heute Abend betrat niemand die Kirche außer mir zur Vesper.“* Kurz darauf: *„Die Orgelmusik war heute so düster, der Kantor spielte ohne Noten...“*
* **Kreuz-Widerspruch:** Klement bestreitet Spenden der Familie Herold. Dr. Blume fand Herold-Überweisungen in alten Kirchenbüchern.
* **Schlüssel-Beweis:** `beweis_pakt_ring` (Sekten-Siegelring) oder `evidence_rosina_note`.
* **Outcomes:**
  * **A (Bruch des Schweigens):** Klement gesteht, dass Heiden die Gruft als Geheimversteck nutzte (+15 % Heiden).
  * **B (Hinweis auf Reliquie):** Klement übergibt Siegelring der Stifterin Rosina Richter.
  * **C (Unbeugsames Schweigen):** Klement beruft sich aufs Kirchenrecht und schweigt.
  * **D (Kirche entlastet):** Klement beweist, dass die Gemeinde nichts von den finsteren Machenschaften wusste.

---

### Station 5: Biengässchen (Fluchtweg)

#### 6. Schankwirtin Erna (`gasse_erna_erna`) – Wirtin
* **Rolle:** Scharfzüngig, kennt jeden Trinker und jeden Hinterhof in Hof.
* **Bisheriger Status:** *Easy (3 Knoten)* – Zeigt sofort aufs Fenster.
* **Neuer Status:** *Komplex (19 Knoten, 3 Stränge)*.
* **Taktik des Ermittlers:**
  * *Kneipenplausch:* Schmeicheln, Bestellung aufgeben, Zuhören.
  * *Sperrstunden-Kontrolle:* Bürokratischer Druck (funktioniert bei ihr schlecht!).
* **Selbst-Widerspruch:** Erna: *„Ich gucke nie aus dem Fenster, geht mich nichts an.“* Später: *„Der Kerl trug Lackschuhe, die im Kopfsteinpflaster klackerten, und stank nach teurem Rasierwasser!“*
* **Kreuz-Widerspruch:** Erna sagt, der Fliehende sei humpelnd zu Fuß geflohen. Wachmann Rolf behauptet, ein Auto habe gewartet.
* **Schlüssel-Beweis:** Schlammiger Schuhabdruck oder `evidence_briefcase_lock`.
* **Outcomes:**
  * **A (Präzise Täter-Signatur):** Erna identifiziert Parfüm und Stock des Kunsthändlers (+15 % Herold).
  * **B (Fluchtrichtung bestätigt):** Erna beschreibt den Weg Richtung Saaleufer.
  * **C (Wirtshausverweis):** Erna wirft Kommissar mit Wischlappen raus: *„Keine Schnüffler in meiner Stube!“*
  * **D (Ausschließen falscher Zeugen):** Bestätigt, dass kein Jugendlicher oder Einbrecher der Täter war.

---

### Station 6: Ludwigstraße (Der Notar)

#### 7. Wachmann Rolf (`ludwig_rolf_rolf`) – Nachtwächter
* **Rolle:** Bestechlich, nervös, versucht seine Mitschuld zu vertuschen.
* **Bisheriger Status:** *Easy (4 Knoten)* – Gesteht Bestechung nach 2 Klicks.
* **Neuer Status:** *Komplex (23 Knoten, 4 Pfade)*.
* **Taktik des Ermittlers:**
  * *Schwere Strafe androhen:* Beihilfe zur Brandstiftung bedeutet Zuchthaus.
  * *Kronzeugen-Regelung:* Straffreiheit bei sofortiger voller Aussage.
* **Selbst-Widerspruch:** Rolf: *„Ich habe die Runde um 22:00 Uhr pünktlich gedreht.“* Später: *„Um 22:00 Uhr war ich kurz beim Bäcker ein Brötchen holen...“*
* **Kreuz-Widerspruch:** Rolf behauptet, Heiden habe ihm die Uhr geschenkt. Herold behauptet, die Uhr sei ihm gestohlen worden.
* **Schlüssel-Beweis:** `beweis_antike_uhr` (Herolds goldene Taschenuhr mit Monogramm).
* **Outcomes:**
  * **A (Kronzeugenaussage gegen Herold):** Rolf gesteht die Bestechung durch Herold (+15 % Herold).
  * **B (Aussage gegen Gipser):** Rolf gesteht, von Gipsers Handlangern bedroht worden zu sein (+10 % Gipser).
  * **C (Mauer des Schweigens):** Rolf verweigert Aussage aus Todesangst vor den Drahtziehern.
  * **D (Rolfs Alibi geklärt):** Schließt aus, dass Rolf das Feuer selbst entfacht hat.

---

### Station 7: Karolinenstraße (Die Telefonzelle)

#### 8. Käpt'n (`karo_kaeptn_kaeptn`) – Obdachloser / Nachtwanderer
* **Rolle:** Scharfer Beobachter der Straße, misstrauisch gegenüber Uniformen.
* **Bisheriger Status:** *Easy (3 Knoten)* – Erzählt direkt vom Telefonat.
* **Neuer Status:** *Komplex (18 Knoten, 4 Pfade)*.
* **Taktik des Ermittlers:**
  * *Menschlichkeit & Respekt (Angebot von warmem Tee/Geld):* Käpt'n öffnet sich völlig.
  * *Polizeidrohung:* Käpt'n verstummt sofort und tut so, als sei er verwirrt.
* **Selbst-Widerspruch:** Käpt'n: *„Ich war taub auf beiden Ohren vor Kälte.“* Später: *„Die Stimme am Telefon schrie: 'Der Pakt ist besiegelt, die Urkunden brennen!'“*
* **Kreuz-Widerspruch:** Käpt'n schwört, eine Frau habe in der Telefonzelle telefoniert. Dr. Blume hörte Dr. Rengers panische Männerstimme auf Band. (Lösung: Zwei getrennte Anrufe!).
* **Schlüssel-Beweis:** `evidence_phone_warning` (Tonbandkassette aus Zelle).
* **Outcomes:**
  * **A (Gesprächsinhalt enthüllt):** Käpt'n zitiert Gipsers Erpressungsanruf (+15 % Gipser).
  * **B (Nummer notiert):** Käpt'n gibt handgeschriebenen Zettel mit gewählter Durchwahl heraus.
  * **C (Vortäuschen von Wahnsinn):** Käpt'n singt Seemannslieder und gibt keine Auskunft.
  * **D (Widerlegung des Renger-Verrats):** Bestätigt, dass Renger das Opfer und nicht der Erpresser war.

---

### Station 8: Schlossplatz (Die alte Residenz)

#### 9. Lisa (`schloss_lisa_lisa`) – Fremdenführerin
* **Rolle:** Geschichtsbegeistert, stolz, beobachtet nächtliche Stadtführungs-Routen.
* **Bisheriger Status:** *Easy (3 Knoten)* – Zeigt Ambigramm.
* **Neuer Status:** *Komplex (17 Knoten, 3 Stränge)*.
* **Taktik des Ermittlers:**
  * *Historische Fachsimpelei:* Lisa blüht auf und enthüllt geheime Grundrisse der Residenzkeller.
  * *Verhör-Ton:* Lisa reagiert arrogant und belehrend.
* **Selbst-Widerspruch:** Lisa: *„Nachts betritt kein Mensch den Hof der Residenz.“* Später: *„Außer der schwarze Audi mit getönten Scheiben, der jede Woche am Tor parkt.“*
* **Kreuz-Widerspruch:** Lisa behauptet, der Schlappen-Pakt sei eine reine Legende ohne echte Verträge. Stadtarchivar Rengers Entdeckungen beweisen das Gegenteil.
* **Schlüssel-Beweis:** `evidence_ambigram_mirror` (Spiegelschrift-Dokument).
* **Outcomes:**
  * **A (Entschlüsselung des Verstecks):** Lisa zeigt den geheimen Kellereingang unter der Residenz (+15 Kommissarpunkte).
  * **B (Gipser-Verbindung):** Lisa erinnert sich an Bauamt-Vermessungen um Mitternacht (+10 % Gipser).
  * **C (Beleidigter Abgang):** Lisa beendet das Gespräch wegen „mangelnder Manieren“.
  * **D (Legenden-Bereinigung):** Klärt auf, welche Patrizier-Familien 1823 wirklich beteiligt waren.

---

### Station 9: Sonnenplatz (Das Wirtshaus)

#### 10. Wärschtlamo Karl (`sonne_karl_karl`) – Hofer Traditions-Wurstverkäufer
* **Rolle:** Hofer Urgestein, steht die ganze Nacht am Messingkessel, redet im Dialekt.
* **Bisheriger Status:** *Easy (3 Knoten)* – Gibt Würfelspiel frei.
* **Neuer Status:** *Komplex (21 Knoten, 4 Pfade)*.
* **Taktik des Ermittlers:**
  * *Lokalkolorit & Mundart:* Karl vertraut „echten Hofern“ und packt Anekdoten aus.
  * *Behörden-Strenge:* Karl antwortet stur: *„Wärscht gessen wird, ermittelt net!“*
* **Selbst-Widerspruch:** Karl: *„Bei mir kauft nachts nur anständiges Volk.“* Später: *„Dem Kerl mit den verrückten Augen und der Notenmappe hab ich zwei Paar mit Senf gegeben, der hat gezittert wie Espenlaub!“*
* **Kreuz-Widerspruch:** Karl sah den Organisten Heiden um 22:15 Uhr am Sonnenplatz. Mesnerin Gertrud behauptet, Heiden sei um diese Zeit in der Kirche gewesen.
* **Schlüssel-Beweis:** `beweis_chorknaben_notiz` (Heidens Notiz mit Senffleck).
* **Outcomes:**
  * **A (Widerlegung von Heidens Alibi):** Karl beweist Heidens Anwesenheit am Brandort (+15 % Heiden).
  * **B (Herold-Anekdote):** Karl berichtet von einem Streit zwischen Herold und Gipser am Nachmittag (+10 % Herold).
  * **C (Stures Schweigen):** Karl bietet nur noch Würste an, schweigt zu Fragen.
  * **D (Entlastung Dritter):** Bestätigt, dass keine fremden Schausteller am Platz waren.

---

### Station 10: St. Marien (Die Predigt)

#### 11. Mesnerin Gertrud (`marien_gertrud_gertrud`) – Mesnerin
* **Rolle:** Fromm, autoritär, verteidigt die Kirche gegen Skandale.
* **Bisheriger Status:** *Easy (3 Knoten)* – Sehr flach, erwähnt Heiden sofort.
* **Neuer Status:** *Komplex (20 Knoten, 4 Pfade)*.
* **Taktik des Ermittlers:**
  * *Ehrfurcht & Pietät:* Gertrud fasst Vertrauen und spricht über Heidens ketzerische Reden.
  * *Verdacht äußern:* Gertrud wird eisig und schützt die Geistlichkeit.
* **Selbst-Widerspruch:** Gertrud: *„Herr Heiden ist die Güte in Person und völlig friedliebend.“* Später: *„Er brüllte von der Kanzel herab, die Stadt müsse im Feuer gereinigt werden!“*
* **Kreuz-Widerspruch:** Gertrud schwört, Heiden habe St. Marien nicht verlassen. Wärschtlamo Karl sah ihn am Sonnenplatz; Fischer Jan sah ihn am Fluss.
* **Schlüssel-Beweis:** `evidence_wiretap_log` (Abhörprotokoll aus Marienkirche).
* **Outcomes:**
  * **A (Offenbarung von Heidens Wahn):** Gertrud gibt zu, dass Heiden von einer „Säuberung“ sprach (+15 % Heiden).
  * **B (Geheime Schriften übergeben):** Gertrud händigt Heidens Predigtnotizen aus.
  * **C (Hausverbot erteilt):** Gertrud verweist den Kommissar des Kirchenschiffs.
  * **D (Kirchendiebstahl ausgeschlossen):** Bestätigt, dass der Kirchenschatz unberührt ist.

---

### Station 11: St. Michaelis (Das Siegel)

#### 12. Gärtner Huber (`michael_huber_huber`) – Friedhofswärter
* **Rolle:** Schreckhaft, arbeitet im Dunkeln auf dem Gottesacker, fürchtet Heidens Zorn.
* **Bisheriger Status:** *Easy (4 Knoten, extrem flach)* – Verrät Heiden sofort nach 2 Klicks.
* **Neuer Status:** *Komplex (24 Knoten, 4 verzweigte Pfade)*.
* **Taktik des Ermittlers:**
  * *Beruhigend / Schutz vor Heiden zusichern:* Huber atmet auf und packt über das Kryptorad aus.
  * *Verdächtigen (Schändung der Gräber):* Huber bricht in Tränen und Panik aus.
* **Selbst-Widerspruch:** Huber: *„Ich hab die Pforte um 20:00 Uhr zugesperrt und den Schlüssel weggesteckt.“* Später: *„Als Heiden vorhin mit dem Brecheisen am Turm hantierte, konnte ich ihn wegen des Nebels kaum sehen!“*
* **Kreuz-Widerspruch:** Huber behauptet, Heiden habe Dr. Renger im Turm eingesperrt. Spitalgehilfe Max (Station 14) fand Rengers Spuren im Alten Spital.
* **Schlüssel-Beweis:** `evidence_brass_wheel` (Entschlüsseltes Siegel).
* **Outcomes:**
  * **A (Turm-Geheimnis gelüftet):** Huber erklärt die Mechanik des Kryptorads und Heidens Fluchtweg (+15 % Heiden).
  * **B (Beobachtung von Mittätern):** Huber sah eine dunkle Gestalt Geld am Friedhofstor deponieren (+10 % Herold).
  * **C (Panische Flucht ins Wärterhaus):** Huber schließt sich ein und antwortet nicht mehr.
  * **D (Entlastung des Friedhofs):** Beweist, dass keine Gräber geschändet wurden.

---

### Station 12: Hospitalkirche (Der Übergabeort)

#### 13. Schwester Maria (`hospital_maria_maria`) – Nachtschwester
* **Rolle:** Sanftmütig, pflegt Alte im Spital, will Patienten nicht wecken, steht unter Druck.
* **Bisheriger Status:** *Easy (3 Knoten, extrem flach)* – Nennt Herold direkt beim Namen.
* **Neuer Status:** *Komplex (22 Knoten, 4 Pfade)*.
* **Taktik des Ermittlers:**
  * *Leise, mitfühlend, ärztliche Schweigepflicht respektieren:* Maria flüstert wichtige Beobachtungen.
  * *Laut, forsch:* Maria bricht ab: *„Sie wecken die Sterbenden auf!“*
* **Selbst-Widerspruch:** Maria: *„Ich habe die ganze Nacht kein Auge vom Krankensaal gewandt.“* Später: *„Nur als die Taschenlampe mit dem violetten Licht am Kirchportal aufblitzte, schaute ich hinaus!“*
* **Kreuz-Widerspruch:** Maria behauptet, der Mann am Ufer sei ganz allein gewesen. Fischer Jan (Station 13) schwört, zwei Personen haben gestritten.
* **Schlüssel-Beweis:** `evidence_uv_formula` (Fluoreszierende UV-Botschaft an der Mauer).
* **Outcomes:**
  * **A (UV-Versteck offenbart):** Maria zeigt exakt die Stelle der Geheimtinte an der Pforte (+15 Kommissarpunkte).
  * **B (Täterkleidung beschrieben):** Maria beschreibt maßgeschneiderte Samtweste und Gehstock (+10 % Herold).
  * **C (Verhör-Abbruch aus Rücksicht):** Maria schließt das Spitalfenster.
  * **D (Spital-Mitarbeiter entlastet):** Klärt, dass niemand vom Spitalpersonal involviert war.

---

### Station 13 (Bonus): Saale-Ufer (Schmugglerpfad)

#### 14. Fischer Jan (`saale_jan_jan`) – Nächtlicher Angler
* **Rolle:** Rau, schweigsam, schätzt seine Ruhe am Fluss, beobachtet Schmuggel.
* **Bisheriger Status:** *Easy (3 Knoten)* – Gibt zerrissenen Brief sofort her.
* **Neuer Status:** *Komplex (18 Knoten, 3 Stränge)*.
* **Taktik des Ermittlers:**
  * *Seemannsgarn / Ruhe bewahren:* Jan respektiert Anglergeduld und teilt Fluss-Geheimnisse.
  * *Ermittlungsfuror:* Jan droht, den Kommissar in die Saale zu werfen.
* **Selbst-Widerspruch:** Jan: *„Am Fluss passiert nachts rein gar nichts.“* Später: *„Vor einer Stunde trieben zerrissene Verträge mit Wachssiegeln direkt an meiner Pose vorbei!“*
* **Kreuz-Widerspruch:** Jan behauptet, eine Frau im Hosenanzug habe Dokumente ins Wasser geworfen. Schwester Maria sah einen Mann mit Gehstock. (Lösung: Übergabe fand statt, Dokumente wurden geteilt!).
* **Schlüssel-Beweis:** `evidence_torn_letter` (Zerrissener Drohbrief aus dem Wasser).
* **Outcomes:**
  * **A (Wasserfund gesichert):** Jan fischt das entscheidende Vertragsfragment aus dem Schilf (+15 % Gipser).
  * **B (Fluchtboot-Beschreibung):** Jan beschreibt ein Motorboot stromabwärts.
  * **C (Vertreibung vom Ufer):** Jan wirft Köder nach dem Ermittler.
  * **D (Flussschiffer entlastet):** Bestätigt, dass der reguläre Saale-Verkehr sauber ist.

---

### Station 14 (Bonus): Altes Spital (Geheimarchiv)

#### 15. Archivgehilfe Max (`spital_max_max`) – Geschichtsstudent & Rengers Assistent
* **Rolle:** Intellektuell, verzweifelt, versteckt sich im Keller, sucht seinen Professor.
* **Bisheriger Status:** *Easy (3 Knoten)* – Gibt Urkunde 1432 sofort ab.
* **Neuer Status:** *Komplex (20 Knoten, 4 Pfade)*.
* **Taktik des Ermittlers:**
  * *Wissenschaftliche Partnerschaft:* Max teilt die Entdeckung von Dr. Rengers geheimer Kopie.
  * *Verdächtigen (Diebstahl der Dokumente):* Max panikt und vernichtet fast Beweise.
* **Selbst-Widerspruch:** Max: *„Ich war seit gestern gar nicht im Rathaus-Gewölbe.“* Später: *„Als der Brand ausbrach, habe ich doch noch schnell den Hefter mit den Urkunden von 1432 gegriffen!“*
* **Kreuz-Widerspruch:** Max glaubt, Renger sei von Gipser entführt worden. Pfarrer Klement deutet auf Heiden hin.
* **Schlüssel-Beweis:** `evidence_charter_1432` (Original-Gründungsurkunde).
* **Outcomes:**
  * **A (Rengers Versteck aufgedeckt):** Max verrät, wohin Renger vor den Entführern floh (+15 Kommissarpunkte).
  * **B (Erbvertrags-Analyse):** Max erklärt die juristische Sprengkraft der Dokumente (+10 % auf alle Verdächtigen).
  * **C (Verkriecht sich in Gewölbe):** Max traut dem Kommissar nicht und versteckt sich tiefer.
  * **D (Student als Brandstifter ausgeschlossen):** Vollständiges Alibi für Max erbracht.

---

### Station 15 (Bonus): Schlappen-Versteck (Bunker)

#### 16. Schattenhafter Bote (`versteck_bote_bote`) – Kurier des Geheimbunds
* **Rolle:** Maskiert, bedrohlich, loyal zum Bund, bewacht das letzte Tresorversteck.
* **Bisheriger Status:** *Easy (3 Knoten)* – Sehr kurz.
* **Neuer Status:** *Komplex (21 Knoten, 4 Pfade)*.
* **Taktik des Ermittlers:**
  * *Kenntnis der Geheimsymbole (Parole):* Bote hält Ermittler für ein ranghohes Bundesmitglied.
  * *Waffenloser Zugriff / Ultimatum:* Härte erforderlich, um ihn zur Aufgabe zu zwingen.
* **Selbst-Widerspruch:** Bote: *„Ich diene keinem sterblichen Herrn!“* Später: *„Wenn meine Auftraggeberin erfährt, dass Sie hier sind, lässt sie den ganzen Straßenzug planieren!“*
* **Kreuz-Widerspruch:** Bote schwört, Herold habe den Tresor geleert. In Wahrheit liegt der Schlüssel bei Heiden.
* **Schlüssel-Beweis:** `scanner` oder `beweis_pakt_ring`.
* **Outcomes:**
  * **A (Tresorschlüssel erbeutet):** Bote kapituliert und übergibt geheimen Tresorschlüssel (+20 Kommissarpunkte).
  * **B (Entlarvung der Bundesstruktur):** Bote offenbart das Dreiecksverhältnis der 3 Verdächtigen.
  * **C (Flucht durch Notausstieg):** Bote wirft Nebelkerze und entkommt.
  * **D (Klarheit über Entführungsort):** Bestätigt, dass Dr. Renger noch am Leben ist.

---

## 5. Die 3 Hauptverdächtigen (Boss-Verhöre im Dossier / auf der Karte)

---

### Hauptverdächtiger 1: Valentin Herold (`interrogate_herold`)
* **Profil:** Antiquitätenhändler & Kunstsammler, Samtweste, silberner Löwen-Gehstock.
* **Bisheriger Status:** *Mittel (10 Knoten)* – Bereits erste Ansätze vorhanden, aber noch mit Namensnennung.
* **Neuer Status:** *Extrem Komplex (28 Knoten, 5 Hauptebenen, Boss-Minispiel: Tresor)*.
* **Ermittler-Regel:** Der Kommissar nennt niemals den Namen! Er konfrontiert mit: *„Dieser Gehstock mit dem Löwenknauf... Wo waren Sie vorhin um 22:15 Uhr?“*
* **Taktik des Ermittlers:**
  * *Kunsthistorisches Verhör:* Herold in Fachwidersprüche über die Urkunden von 1823 verwickeln.
  * *Konfrontation mit Wachmann Rolfs Aussage:* Herolds Erpressung/Bestechung offenlegen.
* **Selbst-Widerspruch:**
  1. *„Ich habe den Abend beim Lesen einer Jean-Paul-Erstausgabe in meinem Salon verbracht.“*
  2. Später: *„Als ich am Rathaus ankam, brannte es bereits lichterloh, ich wollte nur die Kunst retten!“*
  3. Sofortige Ermittler-Option: `[Selbstwiderspruch vorhalten: Vorhin waren Sie noch im Salon!]`
* **Kreuz-Widerspruch zu Gipser:** Herold behauptet, Gipser habe das Feuer gelegt, um Bauland freizumachen. Gipser behauptet, Herold habe das Feuer gelegt, um den Diebstahl der Urkunden zu tarnen.
* **Beweis-Konfrontationen:**
  * Vorlage `beweis_antike_uhr`: Herold schwitzt, behauptet Diebstahl, bricht dann ein (+15 %).
  * Vorlage `evidence_polaroid_station`: Zeigt Herold mit Futteral am Bahnhof (+20 %).
* **Outcomes:**
  * **A (Teilgeständnis Hehlerei & Diebstahl):** Gibt zu, die Urkunden gestohlen zu haben; leugnet aber Brandstiftung und Entführung (+25 % Herold). Schaltet Tresor-Boss-Minigame frei.
  * **B (Gegenseitige Belastung):** Schiebt alle Schuld an der Entführung auf Heiden (+15 % Heiden, +10 % Herold).
  * **C (Anwalts-Blockade):** Verlangt seinen Rechtsbeistand, Gespräch bricht ab (kann mit neuem Beweis wiederholt werden).
  * **D (Entlastung vom Mordvorwurf):** Beweist, dass Dr. Renger bei Herolds Eintreffen bereits verschleppt war.

---

### Hauptverdächtige 2: Katharina von Gipser (`interrogate_gipser`)
* **Profil:** Kommunalpolitikerin & Bauinvestorin, maßgeschneidertes Kostüm, eiskalt.
* **Bisheriger Status:** *Mittel (10 Knoten)*.
* **Neuer Status:** *Extrem Komplex (28 Knoten, 5 Hauptebenen, Boss-Minispiel: Schredder-Puzzle)*.
* **Ermittler-Regel:** Kommissar fragt neutral: *„Frau Stadträtin, wem gehört die schwarze Limousine mit dem Kennzeichen HO-KG 1823?“*
* **Taktik des Ermittlers:**
  * *Wirtschaftsjuristische Enge:* Konfrontation mit Grundbuchrechten am Saaleufer.
  * *Chauffeur- und Kurier-Aussagen vorlegen:* Sepps Frachtpapiere nutzen.
* **Selbst-Widerspruch:**
  1. *„Ich kenne keinen Dr. Renger und interessiere mich nicht für historische Archive.“*
  2. Später: *„Rengers sture Weigerung, mir die Grunddienstbarkeiten abzutreten, hätte mein Projekt ruiniert!“*
  3. Sofortige Ermittler-Option: `[Selbstwiderspruch vorhalten: Eben kannten Sie ihn noch gar nicht!]`
* **Kreuz-Widerspruch zu Herold:** Gipser behauptet, Herold sei der Kopf des Geheimbunds. Herold behauptet, Gipser halte alle Fäden in der Hand und schmiere den Stadtrat.
* **Beweis-Konfrontationen:**
  * Vorlage `foto_gipser_auto`: Gipser behauptet Chauffeur-Dienstfahrt, gerät in Erklärungsnot (+20 %).
  * Vorlage `beweis_frachtpapiere`: Unwiderlegbarer Beweis der illegalen Aktenräumung (+25 %).
* **Outcomes:**
  * **A (Zusammenbruch der Fassade):** Gipser gesteht die Zerstörung der Verträge und Aktenraub (+25 % Gipser). Schaltet Schredder-Boss-Minigame frei.
  * **B (Gipser belastet Herold & Heiden):** Legt geheime Kontobewegungen Herolds offen (+15 % Herold).
  * **C (Politische Drohung):** Droht mit sofortiger Suspendierung des Kommissars via Innenministerium.
  * **D (Ausschluss der Brandlegung):** Beweist, dass ihr Chauffeur den Brand nicht gelegt hat, sondern Heidens Eiferer.

---

### Hauptverdächtiger 3: Severin Heiden (`interrogate_heiden`)
* **Profil:** Domorganist & Chorleiter an St. Michaelis, asketisch, fanatisch religiös.
* **Bisheriger Status:** *Mittel (8 Knoten)*.
* **Neuer Status:** *Extrem Komplex (30 Knoten, 5 Hauptebenen, Boss-Minispiel: Orgel-Kryptex B-A-C-H)*.
* **Ermittler-Regel:** Kommissar fragt: *„Was bedeutet die Ziffer 1823 in Ihren Chornotizen?“* (Nicht: „Herr Heiden, Sie Fanatiker!“).
* **Taktik des Ermittlers:**
  * *Theologische & symbolische Argumentation:* Auf Heidens Bibelzitate und Apokalypse-Bilder eingehen.
  * *Konfrontation mit Brandstiftungs-Beweisen:* Rußspuren und Notenblätter vorhalten.
* **Selbst-Widerspruch:**
  1. *„Ich habe die Nacht im Gebet verbracht, meine Hände rührten nichts Weltliches an.“*
  2. Später: *„Als das Feuer am Rathaus aufstieg, war es wie Gottes reinigendes Gericht über die Sünder!“*
  3. Sofortige Ermittler-Option: `[Selbstwiderspruch vorhalten: Wie konnten Sie das Feuer aus dem fensterlosen Chor sehen?]`
* **Kreuz-Widerspruch zu Klement & Gertrud:** Heiden behauptet, alle Pfarrer Hofs stünden hinter seiner Mission. Klement und Gertrud bezeugen sein Ketzertum und seine Ausgrenzung.
* **Beweis-Konfrontationen:**
  * Vorlage `notenblatt_heiden` (B-A-C-H): Heiden erkennt seine Handschrift, sieht es als Zeichen Gottes (+20 %).
  * Vorlage `beweis_chorknaben_notiz`: Belegt Heidens Anwesenheit am Brandort (+25 %).
* **Outcomes:**
  * **A (Fanatisches Bekenntnis):** Heiden gesteht die „göttliche Reinigung“ durch das Feuer und Rengers Gefangensetzung (+30 % Heiden). Schaltet Orgel-Boss-Minispiel frei.
  * **B (Enthüllung des Entführungsorts):** Verrät in religiöser Trance den Aufenthaltsort von Dr. Renger.
  * **C (Religiöse Raserei):** Heiden verstummt in lateinischem Chorgebet, keine weiteren Antworten.
  * **D (Entlastung von Bereicherungs-Motiven):** Beweist, dass Heiden keinen Cent Geld wollte, sondern rein ideologisch handelte.

---

## 6. Technische Datenstruktur in `data/story.json`

Um die neue Tiefe ohne Code-Bruch zu realisieren, erweitern wir das Knoten-Schema um dedizierte Felder:

```json
{
  "id": "node_contradiction_role",
  "speaker": "Schwester Maria",
  "avatar": "assets/informantin.jpg",
  "text": "(Wird rot) Ich... Sie haben recht, Herr Kommissar. Ich habe gelogen. Ein Mann mit einem Gehstock und dunklem Mantel hat etwas an die Pforte geschmiert.",
  "choices": [
    {
      "text": "[Nachhaken] Welche Hand hielt den Gehstock? Fiel Ihnen ein Schmuckstück auf?",
      "next": "node_details_cane",
      "impact": { "suspect": "herold", "value": 10 }
    },
    {
      "text": "[Beweis vorlegen] Meinen Sie diese Markierung hier unter UV-Licht?",
      "requires_evidence": "evidence_uv_formula",
      "requires_rank": 2,
      "next": "node_uv_reveal",
      "impact": { "suspect": "herold", "value": 15 }
    }
  ],
  "outcomeType": "breakthrough"
}
```

### Neue Kontrollfelder:
* `requires_evidence`: Option erscheint nur, wenn Beweis im Inventar liegt (oder bei Rang 3+ zwingend erforderlich ist).
* `requires_rank`: Option steht erst ab einem bestimmten Kommissarrang zur Verfügung (1–5).
* `contradiction_target`: Kennzeichnet Optionen, die einen Selbstwiderspruch oder Kreuzwiderspruch aufdecken.
* `outcome`: Markiert Endknoten als `OUTCOME_A`, `OUTCOME_B`, `OUTCOME_C`, `OUTCOME_D`.
* `unlockSuspects`: Schaltet das Dossier frei.
* `reward`: Händigt einen neuen Beweis aus.

---

## 7. Zusammenfassung der Metriken

| Kategorie | Bisher („Easy“) | Neu („True Detective“) | Steigerungsfaktor |
| :--- | :--- | :--- | :--- |
| **Knoten pro Zeuge (Ø)** | 3 – 5 Knoten | **18 – 24 Knoten** | **4× bis 5×** |
| **Knoten Verdächtige (Ø)** | 8 – 10 Knoten | **28 – 32 Knoten** | **3× bis 4×** |
| **Verzweigungspfade** | 1 – 2 (konvergierend) | **8 – 12 Pfade** | **6×** |
| **Mögliche Kombinationen** | 2 – 3 | **30 – 50 Abläufe** | **~25×** (Erfüllt 20–30x Vorgabe!) |
| **Widerspruchs-Mechanik** | Keine | **In jedem Baum** | Neu |
| **Neutraler Ermittlerstil** | Nein (Namen vorgegeben) | **100 % Konsequent** | Neu |
| **End-Outcomes pro Person** | 1 (Einheitsende) | **4 verschiedene Outcomes** | **4×** |
| **Gesamtzahl Dialogknoten** | ca. 85 Knoten | **ca. 420 Knoten** | **~5× Text, 25× Tiefe** |

---
*Erstellt für „Der Pakt der Schlappen-Erben“ – Versteckules / KrimiHof.*
