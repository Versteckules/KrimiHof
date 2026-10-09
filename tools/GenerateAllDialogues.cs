using System;
using System.IO;
using System.Text;
using System.Collections.Generic;
using System.Web.Script.Serialization;

namespace KrimiDialogueGenerator {
    public class Choice {
        public string text;
        public string next;
        public string requires_evidence;
        public int requires_rank;
        public bool contradiction_target;
        public Impact impact;
    }

    public class Impact {
        public string suspect;
        public int value;
    }

    public class Node {
        public string id;
        public string speaker;
        public string avatar;
        public string text;
        public List<Choice> choices;
        public bool isEnd;
        public string outcome;
        public bool isFailure;
        public bool unlockSuspects;
        public string reward;
    }

    public class Program {
        static Choice C(string text, string next, string reqEvidence = null, int reqRank = 0, bool contra = false, string susp = null, int val = 0) {
            var c = new Choice();
            c.text = text;
            c.next = next;
            if (!string.IsNullOrEmpty(reqEvidence)) c.requires_evidence = reqEvidence;
            if (reqRank > 0) c.requires_rank = reqRank;
            c.contradiction_target = contra;
            if (!string.IsNullOrEmpty(susp) && val != 0) {
                c.impact = new Impact { suspect = susp, value = val };
            }
            return c;
        }

        static Node N(string id, string speaker, string avatar, string text, params Choice[] choices) {
            var n = new Node();
            n.id = id;
            n.speaker = speaker;
            n.avatar = avatar;
            n.text = text;
            n.choices = new List<Choice>(choices);
            n.isEnd = false;
            return n;
        }

        static Node End(string id, string speaker, string avatar, string text, string outcome, bool isFail = false, string reward = null, bool unlockSuspects = false) {
            var n = new Node();
            n.id = id;
            n.speaker = speaker;
            n.avatar = avatar;
            n.text = text;
            n.choices = new List<Choice>();
            n.isEnd = true;
            n.outcome = outcome;
            n.isFailure = isFail;
            n.reward = reward;
            n.unlockSuspects = unlockSuspects;
            return n;
        }

        public static void Main() {
            string storyPath = @"c:\Users\flaem\Desktop\Krimi\data\story.json";
            string jsonContent = File.ReadAllText(storyPath, Encoding.UTF8);

            var serializer = new JavaScriptSerializer();
            serializer.MaxJsonLength = int.MaxValue;
            var storyObj = (Dictionary<string, object>)serializer.DeserializeObject(jsonContent);

            var trees = new Dictionary<string, object>();

            // Preserve event calls if they exist
            if (storyObj.ContainsKey("dialogueTrees")) {
                var oldTrees = (Dictionary<string, object>)storyObj["dialogueTrees"];
                if (oldTrees.ContainsKey("event_call_herold")) trees["event_call_herold"] = oldTrees["event_call_herold"];
                if (oldTrees.ContainsKey("event_call_gipser")) trees["event_call_gipser"] = oldTrees["event_call_gipser"];
                if (oldTrees.ContainsKey("event_call_heiden")) trees["event_call_heiden"] = oldTrees["event_call_heiden"];
            }

            BuildStation1To4(trees);
            BuildStation5To8(trees);
            BuildStation9To12(trees);
            BuildBonusStations(trees);
            BuildSuspects(trees);

            storyObj["dialogueTrees"] = trees;
            BuildEvidenceCatalog(storyObj);

            string updatedJson = serializer.Serialize(storyObj);

            // Nicely format the JSON with simple indentation
            string formattedJson = FormatJson(updatedJson);
            File.WriteAllText(storyPath, formattedJson, new UTF8Encoding(false));
            Console.WriteLine("Successfully updated story.json with all 19 complex dialogue trees and complete evidence catalog!");
        }

        static void BuildEvidenceCatalog(Dictionary<string, object> storyObj) {
            var catalog = new List<Dictionary<string, object>>();

            Func<string, string, string, string, string, string, string, Dictionary<string, object>> Ev = 
                (id, name, type, stationId, targetSuspect, desc, rewardReason) => {
                    var item = new Dictionary<string, object>();
                    item["id"] = id;
                    item["name"] = name;
                    item["type"] = type;
                    item["stationId"] = stationId;
                    item["targetSuspect"] = targetSuspect;
                    item["description"] = desc;
                    item["rewardReason"] = rewardReason;
                    return item;
                };

            catalog.Add(Ev(
                "beweis_antike_uhr",
                "Gravierte Taschenuhr",
                "object",
                "ludwigstrasse",
                "herold",
                "Eine kostbare goldene Sprungdeckeluhr mit feiner Handgravur 'V. H.', sichergestellt beim bestochenen Wachmann Rolf.",
                "Die Taschenuhr mit den gravierten Initialen 'V. H.' beweist die Bestechung des Wachmanns durch Valentin Herold! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "beweis_frachtpapiere",
                "Brisante Frachtpapiere",
                "document",
                "hauptpost",
                "gipser",
                "Ein amtlicher Lieferschein über den nächtlichen Abtransport von Aktenkisten aus dem Rathausarchiv, gestempelt vom städtischen Hochbauamt und gezeichnet mit 'K. v. G.'.",
                "Die Frachtpapiere belegen den illegalen Abtransport von Archivkisten unter Katharina von Gipsers Amtsverantwortung! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "beweis_chorknaben_notiz",
                "Lateinische Chor-Notiz",
                "document",
                "sonnenplatz",
                "heiden",
                "Ein Notenblatt mit liturgischen Chorälen und einer Grundrissskizze des Rathaus-Gewölbes, verfasst in altertümlicher Musikerschrift.",
                "Die Chor-Notiz mit dem Gewölbegrundriss belegt Klaus Heidens Vorbereitung und Auskundschaftung des Tatorts! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "beweis_pakt_ring",
                "Orden-Siegelring",
                "object",
                "lorenzkirche",
                "heiden",
                "Ein alter Silberring mit dem eingravierten Emblem der Bruderschaft und einem eingelassenen Kirchenkreuz, übergeben von Pfarrer Klement.",
                "Der Siegelring beweist Klaus Heidens Führungsrolle im Geheimbund der Schlappen-Bruderschaft! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "foto_gipser_auto",
                "Foto der flüchtenden Limousine",
                "photo",
                "rathaus",
                "gipser",
                "Eine nächtliche Teleobjektiv-Aufnahme einer schweren schwarzen Oberklasse-Limousine mit dem Kennzeichen HO-KG 1823, fotografiert kurz nach Brandausbruch.",
                "Das Fluchtfahrzeug mit Kennzeichen HO-KG 1823 führt direkt zur Baudezernentin Katharina von Gipser! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "notenblatt_heiden",
                "Rußiges Partiturblatt",
                "document",
                "rathaus",
                "heiden",
                "Ein am Brandherd gefundenes, teils verkohltes Notenblatt. Die freigelegte Partitur zeigt ein Orgelmotiv über die Tonfolge B-A-C-H.",
                "Das B-A-C-H Orgelmotiv verbindet Kirchenmusiker Klaus Heiden direkt mit dem Brandherd im Rathauskeller! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "evidence_fire_dossier",
                "Brandbericht der Löschkommission",
                "document",
                "rathaus",
                null,
                "Ein historischer Untersuchungsbericht über den Stadtbrand von 1823 mit Hinweisen auf chemische Brandbeschleuniger im Archiv.",
                "Allgemeiner Fallbeweis: Belegt vorsätzliche Brandstiftung, belastet jedoch keine Einzelperson."
            ));

            catalog.Add(Ev(
                "evidence_polaroid_station",
                "Überwachungs-Polaroid",
                "photo",
                "hauptpost",
                "herold",
                "Ein unscharfes Nachtfoto: Ein Fliehender im feinen Nadelstreifenmantel mit goldener Krawattennadel und einer geraubten Dokumentenrolle.",
                "Das Foto belegt die Anwesenheit von Valentin Herold am Bahnhof zur Tatzeit! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "evidence_cipher_paper",
                "Chiffrierter Schuldschein",
                "cipher",
                "obelisk",
                "herold",
                "Ein verschlüsselter Darlehensbeleg über erdrückende Verbindlichkeiten und fällige Hypotheken bei Schweizer Gläubigern.",
                "Der Schuldschein belegt Herolds akute Zahlungsunfähigkeit und sein Motiv für den Diebstahl der Urkunden! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "evidence_rosina_note",
                "Historische Stiftungsurkunde",
                "document",
                "lorenzkirche",
                "gipser",
                "Eine notarielle Stiftungsurkunde über geheime Liegenschaftsübertragungen an der Saale zugunsten einer alteingesessenen Patrizierlinie des städtischen Bauadels (Stiftung 'Rosina 1823').",
                "Die Stiftungsurkunde belegt das persönliche wirtschaftliche Eigeninteresse an den Ufergrundstücken! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "evidence_briefcase_lock",
                "Wappenring der Tuchmacher",
                "object",
                "biengaesschen",
                "herold",
                "Ein im Biengäßchen verlorener massiver Siegelring mit dem Traditions-Wappen der Hofer Textilfabrikanten und Tuchmacherzunft.",
                "Der Wappenring der Textilfabrikanten verbindet Herold unmittelbar mit dem Fluchtweg! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "evidence_tape_renger",
                "Dr. Rengers Tonbandaufnahme",
                "audio",
                "ludwigstrasse",
                null,
                "Letzte verzweifelte Worte des Archivars kurz vor seiner Entführung über die Verschwörung um die Schlappen-Urkunde.",
                "Allgemeiner Fallbeweis: Bestätigt die Entführung von Dr. Renger und den Diebstahl der Urkunden."
            ));

            catalog.Add(Ev(
                "evidence_phone_warning",
                "Münzfernsprecher-Aufnahme",
                "audio",
                "karolinenstrasse",
                "gipser",
                "Ein Tonmitschnitt aus der Telefonzelle: Eine kühle, herrische Frauenstimme warnt vor Nachforschungen zu den geplanten Saale-Bauprojekten.",
                "Die herrische Frauenstimme und der Bezug zu städtischen Bauprojekten weisen eindeutig auf Katharina von Gipser! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "evidence_ambigram_mirror",
                "Spiegelschrift-Dokument",
                "cipher",
                "schlossplatz",
                "heiden",
                "Ein kunstvolles Pergament mit einem okkulten Spiegelschrift-Ambigramm und sakralen Ordensinsignien.",
                "Das rituelle Spiegelschrift-Ambigramm ist das Erkennungszeichen des von Klaus Heiden geführten Ordens! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "evidence_dice_gamble",
                "Wirtshaus-Abrechnung",
                "document",
                "sonnenplatz",
                "herold",
                "Auf Bierfilz gekritzelte Abrechnung über hohe Schmiergeldzahlungen und Schweigegelder für Informanten am Schlappentag.",
                "Die Abrechnung belegt Herolds Schmiergeldzahlungen an Informanten im Wirtshaus! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "evidence_wiretap_log",
                "Abhörprotokoll St. Marien",
                "audio",
                "marienkirche",
                "gipser",
                "Beweismitschrift eines vertraulichen Gesprächs über die Vernichtung von städtischen Baubeschränkungen und Verträge an der Saale.",
                "Das Protokoll dokumentiert Gipsers geheime Absprachen über manipulierte Bauunterlagen! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "evidence_brass_wheel",
                "Kryptorad-Botschaft",
                "cipher",
                "michaeliskirche",
                "heiden",
                "Die dechiffrierte Losung des mechanischen Kryptorads: 'ORDO SCHLAPPIS 1823' – das Losungswort der Verschwörer.",
                "Die Ordenslosung 'ORDO SCHLAPPIS 1823' führt direkt zum fanatischen Traditionsbewahrer Klaus Heiden! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "evidence_uv_formula",
                "Fluoreszierende Ordenslosung",
                "document",
                "hospitalkirche",
                "heiden",
                "Eine erst unter UV-Licht sichtbare sakrale Wegmarkierung an der Hospitalkirche, gezeichnet mit der Geheimtinte der Bruderschaft.",
                "Die UV-Schrift belegt Heidens konspiratives Vorgehen an den Kirchen und geheime Rituale! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "evidence_torn_letter",
                "Zerrissener Drohbrief",
                "document",
                "saale_schmuggel",
                "heiden",
                "Wieder zusammengesetzte Bruchstücke eines Schreibens an Dr. Renger: 'Schweigen Sie, oder Hof wird ein zweites Mal brennen!'",
                "Der fanatische Tonfall und die Branddrohung gegen Dr. Renger stammen zweifelsfrei von Klaus Heiden! (Verdacht +15%)"
            ));

            catalog.Add(Ev(
                "evidence_charter_1432",
                "Bundessatzung von 1432",
                "document",
                "altstadt_archiv",
                null,
                "Die originale mittelalterliche Gründungsurkunde des Schlappen-Privilegs auf Pergament mit dem Siegel der Hofer Schützen und Brauer von 1432.",
                "Allgemeiner Fallbeweis: Die gerettete Originalurkunde, das eigentliche Ziel aller Verdächtigen."
            ));

            storyObj["evidenceCatalog"] = catalog;
        }

        static string FormatJson(string json) {
            var sb = new StringBuilder();
            bool inQuote = false;
            int indent = 0;
            for (int i = 0; i < json.Length; i++) {
                char ch = json[i];
                if (ch == '\\' && inQuote) {
                    sb.Append(ch);
                    if (i + 1 < json.Length) sb.Append(json[++i]);
                    continue;
                }
                if (ch == '"') inQuote = !inQuote;
                if (!inQuote) {
                    if (ch == '{' || ch == '[') {
                        sb.Append(ch);
                        sb.Append("\n");
                        indent++;
                        sb.Append(new string(' ', indent * 2));
                    } else if (ch == '}' || ch == ']') {
                        sb.Append("\n");
                        indent--;
                        sb.Append(new string(' ', Math.Max(0, indent * 2)));
                        sb.Append(ch);
                    } else if (ch == ',') {
                        sb.Append(ch);
                        sb.Append("\n");
                        sb.Append(new string(' ', indent * 2));
                    } else if (ch == ':') {
                        sb.Append(": ");
                    } else if (!char.IsWhiteSpace(ch)) {
                        sb.Append(ch);
                    }
                } else {
                    sb.Append(ch);
                }
            }
            return sb.ToString();
        }

        // ==========================================
        // STATIONS 1 to 4
        // ==========================================
        static void BuildStation1To4(Dictionary<string, object> trees) {
            // 1. Kommissar Stahl (Rathaus)
            trees["rathaus_fire_polizist"] = new List<Node> {
                N("start", "Kommissar Stahl", "assets/kommissar_stahl.jpg",
                  "Ermittler {PLAYER_NAME}! Gut, dass Sie hier sind. Das Stadtarchiv steht unter Wasser und Schutt, von Dr. Renger fehlt jede Spur. Ich habe die Absperrungen dichtgemacht. Was ist Ihr Ermittlungsansatz?",
                  C("[Empathisch] Sie wirken übermüdet, Herr Kollege. Was haben Ihre Männer bisher am Brandherd festgestellt?", "stahl_empathic"),
                  C("[Sachlich] Konnten Anzeichen für Brandbeschleuniger oder ein gewaltsames Eindringen gesichert werden?", "stahl_factual"),
                  C("[Konfrontativ] Warum brauchten Ihre Streifenwagen fast zwanzig Minuten zum Brandort? Wurde der Notruf verzögert?", "stahl_confront")
                ),
                N("stahl_empathic", "Kommissar Stahl", "assets/kommissar_stahl.jpg",
                  "Seit gestern Früh auf den Beinen. Das Feuer brach um 21:45 Uhr im Archivgewölbe aus. Dr. Renger hatte bis spät gearbeitet. Die Löschtrupps fanden seine Brille auf dem Boden, aber von ihm selbst keine Spur.",
                  C("[Sachlich] Gab es Zeugen, die jemanden flüchten sahen?", "stahl_escape"),
                  C("[Beweis vorlegen] Ich habe hier die Brandakte von 1823. Gibt es Parallelen?", "stahl_archive_eval", "evidence_fire_dossier", 0, false, "none", 0)
                ),
                N("stahl_factual", "Kommissar Stahl", "assets/kommissar_stahl.jpg",
                  "Die Brandfahnder fanden Reste von hochreinem Petroleum an den Türzargen. Ein Profi. Und die Haupttür war von außen verriegelt. Renger sollte offenbar verbrennen.",
                  C("[Sachlich] Welche Fluchtwege kommen in Betracht?", "stahl_escape"),
                  C("[Widerspruch aufdecken] Vorhin hieß es noch, die Absperrung war lückenlos. Kam wirklich niemand vorbei?", "stahl_contra", null, 0, true)
                ),
                N("stahl_confront", "Kommissar Stahl", "assets/kommissar_stahl.jpg",
                  "Hüten Sie Ihre Zunge! Wir hatten zeitgleich einen Notruf am Bahnhof – Randale. Ich musste zwei Wagen abziehen. Hier war für knapp zehn Minuten nur ein Streifenposten vor Ort.",
                  C("[Widerspruch aufdecken] Erst behaupten Sie lückenlose Absperrung, und jetzt gaben Sie zehn Minuten unbewachten Hinterhof zu?", "stahl_contra", null, 0, true),
                  C("[Sachlich] Konzentrieren wir uns auf die Fakten. Wer nutzte diese zehn Minuten?", "stahl_escape"),
                  C("[Konfrontativ] Das riecht nach absichtlicher Sabotage. Haben Sie Mittäter in den eigenen Reihen?!", "stahl_fail")
                ),
                N("stahl_contra", "Kommissar Stahl", "assets/kommissar_stahl.jpg",
                  "(Atmet tief durch) Verdammt... Sie haben recht. Wir wurden ausmanövriert. Der Notruf am Bahnhof war ein Ablenkungsmanöver. Jemand schlich durch den Ratskeller und zerrte Renger heraus.",
                  C("[Sachlich] Haben Sie Merkmale der Täter?", "stahl_escape_deep"),
                  C("[Beweis vorlegen] Hier ist die Löschakte. Sehen Sie sich die Notizen an.", "stahl_archive_eval", "evidence_fire_dossier", 0, false, "none", 0)
                ),
                N("stahl_escape", "Kommissar Stahl", "assets/kommissar_stahl.jpg",
                  "Zwei Spuren: Ein Passant sah eine schwarze Limousine mit hoher Geschwindigkeit in Richtung Karolinenstraße rasen. Und drüben im Biengässchen hörte man klackernde Schritte.",
                  C("[Sachlich] Welche Schritte genau?", "stahl_escape_deep"),
                  C("[Beweis vorlegen] Stimmt das mit diesem Foto der Limousine überein?", "stahl_photo_check", "foto_gipser_auto", 0, false, "gipser", 15)
                ),
                N("stahl_escape_deep", "Kommissar Stahl", "assets/kommissar_stahl.jpg",
                  "Ein ungleichmäßiger Schritt – als würde jemand humpeln oder einen Stock aufsetzen. Ich gebe Ihnen die interne Einsatzskizze. Finden Sie Renger, bevor es zu spät ist!",
                  C("[Dank] Ich übernehme die Spur.", "end_stahl_a")
                ),
                N("stahl_archive_eval", "Kommissar Stahl", "assets/kommissar_stahl.jpg",
                  "(Studiert das Dokument) Unglaublich... genau dieselbe Vorgehensweise wie beim Stadtbrand vor 200 Jahren. Dieselben Gebäude, dieselben Verstecke. Das ist das Werk eines geschichtskundigen Täters!",
                  C("[Schlussfolgerung] Jemand wiederholt die Historie von 1823.", "end_stahl_a")
                ),
                N("stahl_photo_check", "Kommissar Stahl", "assets/kommissar_stahl.jpg",
                  "Ein Treffer! Kennzeichen HO-KG 1823... Das ist die Limousine aus den Regierungskreisen. Das sprengt alle Dimensionen. Gehen Sie der Spur sofort nach!",
                  C("[Ermitteln] Ich verfolge die Limousine.", "end_stahl_a")
                ),
                End("stahl_fail", "Kommissar Stahl", "assets/kommissar_stahl.jpg",
                  "Reichen Sie Dienstaufsichtsbeschwerde ein, wenn Sie wollen! Aber unterstellen Sie meinen Beamten keine Korruption. Verlassen Sie sofort meinen Tatort!", "OUTCOME_C", true),
                End("end_stahl_a", "Kommissar Stahl", "assets/kommissar_stahl.jpg",
                  "Hier ist die Einsatzakte mit den Fluchtwegen. Möge der Himmel Ihnen beistehen. Melden Sie sich, wenn Sie Renger finden.", "OUTCOME_A", false, "evidence_fire_dossier", true),
                End("end_stahl_b", "Kommissar Stahl", "assets/kommissar_stahl.jpg",
                  "Ich lasse das Protokoll anpassen. Mehr kann ich Ihnen im Moment nicht sagen.", "OUTCOME_B"),
                End("end_stahl_d", "Kommissar Stahl", "assets/kommissar_stahl.jpg",
                  "Die polizeiinternen Protokolle sind sauber. Konzentrieren Sie sich auf die Zivilisten in der Stadt.", "OUTCOME_D")
            };

            // 2. Paul Stift (Reporter)
            trees["rathaus_fire_reporter"] = new List<Node> {
                N("start", "Paul Stift", "assets/reporter_stift.jpg",
                  "(Hält ein langes Teleobjektiv bereit) Nicht schubsen! Die Frankenpost zahlt für das Exklusivfoto. 'Flammeninferno vernichtet Jahrhunderte-Geheimnis'. Großartige Schlagzeile, was meinen Sie?",
                  C("[Empathisch] Sie riskieren viel für die Wahrheit, Herr Stift. Was hat Ihre Linse eingefangen?", "stift_empathic"),
                  C("[Sachlich] Sie waren vor der Feuerwehr hier. Was haben Sie in den ersten Minuten gesehen?", "stift_factual"),
                  C("[Konfrontativ] Treten Sie hinter die Absperrung zurück! Sie behindern eine Brandermittlung wegen schwerer Brandstiftung!", "stift_confront")
                ),
                N("stift_empathic", "Paul Stift", "assets/reporter_stift.jpg",
                  "Endlich mal jemand mit Respekt vor der Presse! Ich stand um 21:40 Uhr drüben am Brunnen, als es im Keller puffte. Eine dichte Rauchwolke stieg auf. Und dann rannte jemand aus dem Hintertor.",
                  C("[Sachlich] Konnten Sie Merkmale der Person erkennen?", "stift_details"),
                  C("[Widerspruch aufdecken] Eben prahlten Sie noch, Sie wären ganz nah dran gewesen. Am Brunnen waren es 50 Meter!", "stift_contra", null, 0, true)
                ),
                N("stift_factual", "Paul Stift", "assets/reporter_stift.jpg",
                  "Es gab keinen lauten Knall – nur ein dumpfes Zischen, wie bei chemischem Brandbeschleuniger. Und kurz darauf schoss eine dunkle Limousine mit abgedunkelten Scheiben davon.",
                  C("[Sachlich] Haben Sie ein Foto von diesem Fahrzeug?", "stift_photo"),
                  C("[Konfrontativ] Warum haben Sie nicht versucht, den Wagen aufzuhalten?", "stift_confront")
                ),
                N("stift_confront", "Paul Stift", "assets/reporter_stift.jpg",
                  "Ich bin Journalist, kein Polizist! Ich lasse mich von Ihnen nicht einschüchtern. Die Pressefreiheit ist im Grundgesetz verankert, Kollege!",
                  C("[Einlenken] Verzeihung, die Nerven liegen blank. Haben Sie Aufnahmen der Flucht?", "stift_factual"),
                  C("[Druck erhöhen] Wenn Sie Beweismittel zurückhalten, lasse ich Ihre Kamera auf der Stelle beschlagnahmen!", "stift_fail")
                ),
                N("stift_contra", "Paul Stift", "assets/reporter_stift.jpg",
                  "(Grinst ertappt) Na gut, Sie verstehen Ihr Handwerk. Ich habe mich an die Hintertür herangepirscht, weil ich auf Dr. Renger gewartet hatte. Dabei drückte ich ab, als die Limousine anfuhr.",
                  C("[Sachlich] Zeigen Sie mir die Aufnahme.", "stift_photo")
                ),
                N("stift_details", "Paul Stift", "assets/reporter_stift.jpg",
                  "Es waren zwei verschiedene Personen! Eine Gestalt zu Fuß im langen Mantel mit Gehstock humpelte Richtung Biengässchen. Und eine elegante Gestalt stieg in die Limousine.",
                  C("[Schlussfolgerung] Zwei Täter mit unterschiedlichen Fluchtwegen.", "end_stift_b", null, 0, false, "herold", 10)
                ),
                N("stift_photo", "Paul Stift", "assets/reporter_stift.jpg",
                  "Hier, auf meinem Display: Schwarzer Audi, Kennzeichen HO-KG 1823. Auf dem Beifahrersitz sieht man die Silhouette einer Person im maßgeschneiderten Kostüm. Das Foto überlasse ich Ihnen gegen Exklusiv-Auskunft später!",
                  C("[Beweis annehmen] Das Foto ist ein entscheidender Treffer.", "end_stift_a", null, 0, false, "gipser", 15)
                ),
                End("stift_fail", "Paul Stift", "assets/reporter_stift.jpg",
                  "Beschlagnahmen?! Das wird die Titelseite von morgen: 'Polizeiwilkür am Brandherd'! Ich sage kein einziges Wort mehr!", "OUTCOME_C", true),
                End("end_stift_a", "Paul Stift", "assets/reporter_stift.jpg",
                  "Hier ist die Speicherkarte mit dem Limousinen-Foto. Bringen Sie den Kerl hinter Gitter!", "OUTCOME_A", false, "foto_gipser_auto"),
                End("end_stift_b", "Paul Stift", "assets/reporter_stift.jpg",
                  "Ich bleibe hier und halte die Augen offen. Notieren Sie sich die Gehstock-Spur!", "OUTCOME_B"),
                End("end_stift_d", "Paul Stift", "assets/reporter_stift.jpg",
                  "Meine Recherche zeigt: Es war kein Unglück, sondern eine geplante Tat von zwei Fraktionen.", "OUTCOME_D")
            };

            // 3. Nachtkurier Sepp (Hauptpost)
            trees["post_kurier_sepp"] = new List<Node> {
                N("start", "Kurier Sepp", "assets/kurier.jpg",
                  "(Wuchtet schwer atmend Kisten auf die Ladefläche) Pst! Haben Sie keinen Feierabend? Um diese Zeit werden nur Eilaufträge verladen. Ich muss in zehn Minuten am Ufer sein, machen Sie den Weg frei!",
                  C("[Empathisch] Spätschicht bei Nachtkälte ist kein Vergnügen. Was für eilige Fracht verladen Sie da?", "sepp_empathic"),
                  C("[Sachlich] Polizeiliche Kontrolle. Zeigen Sie mir die Frachtpapiere und den Absender dieser Kisten.", "sepp_factual"),
                  C("[Konfrontativ] Halt! Motor aus und Hände ans Fahrzeug! Diese Kisten stammen aus dem brennenden Rathaus!", "sepp_confront")
                ),
                N("sepp_empathic", "Kurier Sepp", "assets/kurier.jpg",
                  "Kein Vergnügen, das können Sie laut sagen. Reiner Papiermüll zur Vernichtung, sagt der Auftraggeber. Aber gut bezahlt. Man fragt nicht, man fährt.",
                  C("[Sachlich] Wer bezahlt Sie für diese nächtliche Räumung?", "sepp_who"),
                  C("[Widerspruch aufdecken] Papiermüll? Warum sind die Kisten mit schweren Messingschlössern gesichert?", "sepp_contra", null, 0, true)
                ),
                N("sepp_factual", "Kurier Sepp", "assets/kurier.jpg",
                  "Hier ist der Lieferschein. Offizieller Dienstauftrag zur 'Aktenauslagerung'. Alles abgestempelt vom Bauamt und der Stadtverwaltung.",
                  C("[Beweis vorlegen] Bauamt? Lassen Sie mich die Frachtpapiere genau prüfen.", "sepp_papers", "beweis_frachtpapiere", 0, false, "gipser", 15),
                  C("[Sachlich] Wohin soll die Fracht gebracht werden?", "sepp_dest")
                ),
                N("sepp_confront", "Kurier Sepp", "assets/kurier.jpg",
                  "Was fällt Ihnen ein?! Ich bin ein ehrlicher Kraftfahrer! Wenn der Stadtrat mir einen Fahrauftrag gibt, führe ich ihn aus!",
                  C("[Sachlich] Beruhigen Sie sich. Welcher Stadtrat hat den Auftrag erteilt?", "sepp_who"),
                  C("[Druck erhöhen] Sie machen sich der Beihilfe zur schweren Brandstiftung schuldig, Sepp!", "sepp_fail")
                ),
                N("sepp_contra", "Kurier Sepp", "assets/kurier.jpg",
                  "(Schluckt nervös) Verdammt... Sie haben Adleraugen. Der Herr am Telefon sagte: 'Wenn ein einziges Siegel bricht, fliegst du raus.' Es sind historische Originalakten aus dem Archivkeller.",
                  C("[Sachlich] Wer war der Herr am Telefon? Oder war es eine Frau?", "sepp_who"),
                  C("[Sachlich] Wo ist der Übergabeort?", "sepp_dest")
                ),
                N("sepp_who", "Kurier Sepp", "assets/kurier.jpg",
                  "Die Anweisung kam direkt aus dem Büro der Stadtentwicklung. Eine kühle Damenstimme. Sie sagte, die Akten müssten vor der Feuerwehr verschwinden.",
                  C("[Schlussfolgerung] Die Stadtentwicklung will die Akten vernichten.", "end_sepp_b", null, 0, false, "gipser", 10)
                ),
                N("sepp_dest", "Kurier Sepp", "assets/kurier.jpg",
                  "Am Saaleufer, unterhalb der Hospitalkirche. Dort wartet jemand mit einem Transporter. Ich gebe Ihnen die Lieferscheine, ich will damit nichts mehr zu tun haben!",
                  C("[Dokument annehmen] Das rettet Rengers Forschung.", "end_sepp_a", null, 0, false, "gipser", 15)
                ),
                N("sepp_papers", "Kurier Sepp", "assets/kurier.jpg",
                  "Das Siegel auf den Papieren... es gehört Katharina von Gipsers Gesellschaft. Ich wusste nicht, worum es geht! Nehmen Sie die Papiere!",
                  C("[Beweis sichern] Vollständiger Nachweis der illegalen Räumung.", "end_sepp_a", null, 0, false, "gipser", 20)
                ),
                End("sepp_fail", "Kurier Sepp", "assets/kurier.jpg",
                  "Reicht mir! Ich sage kein Wort mehr ohne Anwalt der Gewerkschaft! Verschwinden Sie von meiner Laderampe!", "OUTCOME_C", true),
                End("end_sepp_a", "Kurier Sepp", "assets/kurier.jpg",
                  "Hier sind die Original-Frachtpapiere. Sagen Sie bloß nicht, dass Sie sie von mir haben!", "OUTCOME_A", false, "beweis_frachtpapiere"),
                End("end_sepp_b", "Kurier Sepp", "assets/kurier.jpg",
                  "Passen Sie auf sich auf am Fluss. Da drüben laufen finstere Gestalten herum.", "OUTCOME_B"),
                End("end_sepp_d", "Kurier Sepp", "assets/kurier.jpg",
                  "Ich bin nur der Fahrer. Meine Weste ist weiß, Herr Kommissar.", "OUTCOME_D")
            };

            // 4. Dr. Blume (Obelisk)
            trees["obelisk_blume_blume"] = new List<Node> {
                N("start", "Dr. Blume", "assets/gehilfe.jpg",
                  "(Verbirgt zitternd eine Mappe unter seinem Mantel) Wer schleicht da im Park? Sind Sie von den Erben geschickt worden? Ich schwöre Ihnen, ich habe Renger gewarnt! Diese Dokumente sind verflucht!",
                  C("[Empathisch] Beruhigen Sie sich, Herr Doktor. Ich bin Ermittler und will Renger helfen. Was fürchten Sie?", "blume_empathic"),
                  C("[Sachlich] Wir untersuchen Rengers Verschwinden. Welche Dokumente haben Sie und Renger entdeckt?", "blume_factual"),
                  C("[Konfrontativ] Hören Sie auf mit dem Theater! Sie treffen sich nachts im Park, während das Archiv brennt. Wo ist er?!", "blume_confront")
                ),
                N("blume_empathic", "Dr. Blume", "assets/gehilfe.jpg",
                  "(Atmet zittrig aus) Ein Ermittler... Gott sei Dank. Renger stieß vor drei Tagen auf den Originalvertrag des Bundes von 1823. Er beweist, dass Hofs reichste Familien ihren Besitz durch Brandstiftung ergaunerten.",
                  C("[Sachlich] Wer wusste noch von diesem Fund?", "blume_who"),
                  C("[Beweis vorlegen] Ist das die Chiffre, die im Koffer gefunden wurde?", "blume_cipher", "evidence_cipher_paper", 0, false, "none", 0)
                ),
                N("blume_factual", "Dr. Blume", "assets/gehilfe.jpg",
                  "Wir haben Kopien in einem Aktenkoffer gesichert. Der Zahlencode war ein historisches Datum: 1823. Aber vorhin rief Renger mich in Panik an. Er sagte, der 'Domorganist' und die 'Baulöwin' seien hinter ihm her.",
                  C("[Widerspruch aufdecken] Vorhin sagten Sie noch, Sie hätten Renger gewarnt – wann sprachen Sie ihn zuletzt?", "blume_contra", null, 0, true),
                  C("[Sachlich] Was hat der Domorganist damit zu tun?", "blume_organist")
                ),
                N("blume_confront", "Dr. Blume", "assets/gehilfe.jpg",
                  "Glauben Sie etwa, ich hätte etwas damit zu tun?! Ich habe mein Leben der Stadtgeschichte gewidmet! Ich lasse mich von Ihnen nicht bedrohen!",
                  C("[Einlenken] Entschuldigen Sie, Rengers Leben steht auf dem Spiel. Wer bedrohte ihn?", "blume_empathic"),
                  C("[Druck erhöhen] Entweder Sie reden jetzt, oder ich nehme Sie als Tatverdächtigen fest!", "blume_fail")
                ),
                N("blume_contra", "Dr. Blume", "assets/gehilfe.jpg",
                  "Er rief mich aus einer Telefonzelle an, um Punkt 21:15 Uhr! Er klang völlig verstört. Er murmelte: 'Der Pakt verlangt ein Opfer, sie zünden das Rathaus an!'",
                  C("[Sachlich] Nannte er konkrete Namen oder Merkmale?", "blume_who")
                ),
                N("blume_who", "Dr. Blume", "assets/gehilfe.jpg",
                  "Drei Parteien wollten die Verträge: Ein Kunsthändler, der sie ins Ausland verkaufen will. Eine Investorin, deren Bauprojekte platzen würden. Und ein religiöser Fanatiker, der die Verträge als heiliges Erbe betrachtet.",
                  C("[Schlussfolgerung] Ein Dreiecks-Konflikt um die Dokumente.", "end_blume_b")
                ),
                N("blume_organist", "Dr. Blume", "assets/gehilfe.jpg",
                  "Der Organist Severin Heiden sieht sich als geistlicher Erbe des Bundes. Er glaubt, das Feuer von 1823 sei Gottes Wille gewesen und müsse erneuert werden. Er ist unberechenbar!",
                  C("[Schlussfolgerung] Heidens Motiv ist religiöser Wahn.", "end_blume_b", null, 0, false, "heiden", 10)
                ),
                N("blume_cipher", "Dr. Blume", "assets/gehilfe.jpg",
                  "Das ist Rengers Chiffre! Die Zahlenkombination für das Geheimfach lautet 1-8-2-3. Darin befindet sich die Liste aller Besitztümer der Schlappen-Erben. Nehmen Sie diese Notiz!",
                  C("[Chiffre annehmen] Schlüssel zum Fall gesichert.", "end_blume_a")
                ),
                End("blume_fail", "Dr. Blume", "assets/gehilfe.jpg",
                  "(Weint vor Verzweiflung) Sie verstehen gar nichts! Ich sage kein Wort mehr!", "OUTCOME_C", true),
                End("end_blume_a", "Dr. Blume", "assets/gehilfe.jpg",
                  "Hier ist die Entschlüsselung des Koffers. Retten Sie meinen Freund Dr. Renger!", "OUTCOME_A", false, "evidence_cipher_paper"),
                End("end_blume_b", "Dr. Blume", "assets/gehilfe.jpg",
                  "Ich verstecke mich in der Bibliothek. Seien Sie vorsichtig da draußen.", "OUTCOME_B"),
                End("end_blume_d", "Dr. Blume", "assets/gehilfe.jpg",
                  "Dr. Renger wollte die Wahrheit veröffentlichen, kein Geld erpressen. Seine Ehre ist rein.", "OUTCOME_D")
            };
        }

        // ==========================================
        // STATIONS 5 to 8
        // ==========================================
        static void BuildStation5To8(Dictionary<string, object> trees) {
            // 5. Pfarrer Klement (St. Lorenz)
            trees["lorenz_klement_klement"] = new List<Node> {
                N("start", "Pfarrer Klement", "assets/kuester_franz.jpg",
                  "(Kniet am Altar, wendet sich langsam um) Der Friede sei mit Ihnen... auch wenn in dieser Nacht kein Friede über Hof liegt. Sie tragen Brandgeruch an Ihrer Kleidung. Was führt Sie zu dieser Stunde in St. Lorenz?",
                  C("[Empathisch] Ein Mensch schwebt in Lebensgefahr, Hochwürden. Dr. Renger suchte Schutz vor einem Bund. Gab es Hilferufe?", "klement_empathic"),
                  C("[Sachlich] In den historischen Spendenregistern von St. Lorenz tauchen Zahlungen des Bundes von 1823 auf. Was wissen Sie darüber?", "klement_factual"),
                  C("[Konfrontativ] Verstecken Sie sich nicht hinter Ihrer Kanzel! Jemand nutzt diese Gruft als konspirativen Übergabeort!", "klement_confront")
                ),
                N("klement_empathic", "Pfarrer Klement", "assets/kuester_franz.jpg",
                  "Renger war vor drei Tagen hier. Er zitterte. Er bat mich, die alte Gruft unter dem Altar aufzuschließen, um Relikte zu sichern. Doch ich verweigerte es ihm.",
                  C("[Sachlich] Warum haben Sie es ihm verweigert?", "klement_who"),
                  C("[Beweis vorlegen] Wegen dieses Siegels, das zur Familie Richter gehört?", "klement_ring", "beweis_pakt_ring", 0, false, "heiden", 15)
                ),
                N("klement_factual", "Pfarrer Klement", "assets/kuester_franz.jpg",
                  "Die Bürgerstiftung Rosina Richter stiftete 1823 große Summen für den Wiederaufbau. Doch das Geld stammte aus unsauberen Quellen. Wir haben dieses Schweigen über Generationen gehütet.",
                  C("[Widerspruch aufdecken] Sie sprachen von frommen Spenden – und nun geben Sie unsaubere Quellen zu?", "klement_contra", null, 0, true),
                  C("[Sachlich] Wer forderte dieses Erbe kürzlich zurück?", "klement_who")
                ),
                N("klement_confront", "Pfarrer Klement", "assets/kuester_franz.jpg",
                  "Mäßigen Sie Ihre Worte im Haus des Herrn! Das Beichtgeheimnis und der Frieden dieser Kirche stehen über weltlicher Neugier!",
                  C("[Einlenken] Verzeihen Sie, aber Renger könnte getötet werden. Helfen Sie mir, Leben zu retten.", "klement_empathic"),
                  C("[Druck erhöhen] Beichtgeheimnis schützt keine Brandstifter! Antworten Sie!", "klement_fail")
                ),
                N("klement_contra", "Pfarrer Klement", "assets/kuester_franz.jpg",
                  "(Senkt das Haupt) Gott vergebe mir. Der Domorganist Heiden kam heute Abend herab. Er verlangte den Siegelring der Stifterin Rosina Richter. Er sagte: 'Die Stunde der Reinigung ist da.'",
                  C("[Sachlich] Was wollte er mit dem Ring?", "klement_ring_info")
                ),
                N("klement_who", "Pfarrer Klement", "assets/kuester_franz.jpg",
                  "Valentin Herold bot der Gemeinde eine halbe Million Euro für alte Stiftungsurkunden. Und Severin Heiden drohte mit Gottes Zorn, wenn wir sie herausgeben. Die Kirche stand zwischen zwei Feuern.",
                  C("[Schlussfolgerung] Herold bot Schmiergeld, Heiden drohte mit Gewalt.", "end_klement_b", null, 0, false, "herold", 10)
                ),
                N("klement_ring_info", "Pfarrer Klement", "assets/kuester_franz.jpg",
                  "Der Siegelring öffnet das Kryptex an der Orgel von St. Michaelis. Ich habe mich geweigert, ihn Heiden zu geben. Ich übergebe ihn jetzt Ihnen – bringen Sie die Wahrheit ans Licht!",
                  C("[Ring annehmen] Ein entscheidender Fund.", "end_klement_a")
                ),
                N("klement_ring", "Pfarrer Klement", "assets/kuester_franz.jpg",
                  "Sie haben den Ring bereits?! Dann hat Klement Heiden verloren... Ja, das ist das Siegel des Bundes. Es beweist die geheime Bruderschaft von 1823.",
                  C("[Erkenntnis festhalten] Der Bund existiert schwarz auf weiß.", "end_klement_a")
                ),
                End("klement_fail", "Pfarrer Klement", "assets/kuester_franz.jpg",
                  "Ich werde mein Gelübde nicht brechen. Verlassen Sie dieses Gotteshaus sofort!", "OUTCOME_C", true),
                End("end_klement_a", "Pfarrer Klement", "assets/kuester_franz.jpg",
                  "Hier ist die Stiftungsurkunde und der Siegelring. Möge Gott Ihre Schritte lenken.", "OUTCOME_A", false, "beweis_pakt_ring"),
                End("end_klement_b", "Pfarrer Klement", "assets/kuester_franz.jpg",
                  "Passen Sie auf sich auf. Der Organist ist fanatischer, als Sie ahnen.", "OUTCOME_B"),
                End("end_klement_d", "Pfarrer Klement", "assets/kuester_franz.jpg",
                  "Die Gemeinde St. Lorenz war Opfer der Verschwörung, nicht Urheber.", "OUTCOME_D")
            };

            // 6. Schankwirtin Erna (Biengässchen)
            trees["gasse_erna_erna"] = new List<Node> {
                N("start", "Schankwirtin Erna", "assets/helene.jpg",
                  "(Wischt mit einem Lappen die Holztheke) Hier gibt's um diese Zeit kein Bier mehr, Herr Inspektor. Sperrstunde war um Mitternacht. Und wer in mein Kellerfenster starrt, kriegt den Wischlappen ins Gesicht!",
                  C("[Empathisch] Keine Sorge, Frau Wirtin. Aber hier in der Gasse entgeht Ihnen kein Schritt. Haben Sie jemanden rennen gehört?", "erna_empathic"),
                  C("[Sachlich] Die Fluchtspur des Brandstifters führt hier durchs Biengässchen. Wen haben Sie bemerkt?", "erna_factual"),
                  C("[Konfrontativ] Frau Wirtin, ein zerbrochenes Kellerfenster und verdächtige Schuhabdrücke vor Ihrer Tür. Verstecken Sie jemanden?", "erna_confront")
                ),
                N("erna_empathic", "Schankwirtin Erna", "assets/helene.jpg",
                  "Hören? Bei dem Kopfsteinpflaster hört man jeden Pfennigabsatz! Vorhin hechtete einer vorbei wie vom Teufel gehetzt. Hat sogar was verloren im Spurt.",
                  C("[Sachlich] Was hat er verloren?", "erna_lost"),
                  C("[Sachlich] Wie sah der Mann aus?", "erna_look")
                ),
                N("erna_factual", "Schankwirtin Erna", "assets/helene.jpg",
                  "Um viertel nach zehn klapperten Lackschuhe durchs Pflaster. Einer hinkte leicht und stützte sich auf einen Spazierstock mit silbernem Knauf.",
                  C("[Widerspruch aufdecken] Erst sagten Sie, Sie schauen nie raus – woher kennen Sie den Knauf?", "erna_contra", null, 0, true),
                  C("[Sachlich] Was für ein Knauf war das?", "erna_knauf")
                ),
                N("erna_confront", "Schankwirtin Erna", "assets/helene.jpg",
                  "Verstecken?! Ich bin eine ehrliche Wirtin seit vierzig Jahren! Unterstellen Sie mir keine Hehlerei, sonst fliegt der Schankkrug!",
                  C("[Einlenken] Entschuldigen Sie. Was haben Sie denn auf der Gasse beobachtet?", "erna_factual"),
                  C("[Druck erhöhen] Machen Sie die Kellertür auf, oder ich hole einen Durchsuchungsbeschluss!", "erna_fail")
                ),
                N("erna_contra", "Schankwirtin Erna", "assets/helene.jpg",
                  "(Lacht heiser) Wenn so ein feiner Herr mit Samtweste fast in meine Mülltonne fliegt, guckt jede Wirtin hin! Ein Löwenkopf aus Messing war auf dem Stock, ganz sicher!",
                  C("[Schlussfolgerung] Löwenknauf und Samtweste – der Kunsthändler.", "end_erna_b", null, 0, false, "herold", 15)
                ),
                N("erna_lost", "Schankwirtin Erna", "assets/helene.jpg",
                  "Ein schwerer Siegelring fiel ihm aus der Tasche und rollte in den Gullischacht. Ich hab ihn mit dem Schürhaken rausgeangelt. Hier, glänzt wie Gold!",
                  C("[Beweis annehmen] Hervorragende Beobachtung, Erna.", "end_erna_a")
                ),
                N("erna_look", "Schankwirtin Erna", "assets/helene.jpg",
                  "Teures Parfüm, englischer Tweedmantel, aber der Atem rasselte wie eine Dampflok. Er fluchte leise: 'Gipser wird dafür bezahlen!'",
                  C("[Schlussfolgerung] Herold flieht und beschuldigt Gipser.", "end_erna_b", null, 0, false, "herold", 10)
                ),
                N("erna_knauf", "Schankwirtin Erna", "assets/helene.jpg",
                  "Ein Löwenkopf mit Rubinaugen. Sehr antik. Der Mann stolperte und rannte weiter Richtung Schlossplatz.",
                  C("[Weg verfolgen] Ich nehme die Verfolgung auf.", "end_erna_b")
                ),
                End("erna_fail", "Schankwirtin Erna", "assets/helene.jpg",
                  "Raus aus meiner Stube! Sie kriegen hier keinen Tropfen und keine Antwort mehr!", "OUTCOME_C", true),
                End("end_erna_a", "Schankwirtin Erna", "assets/helene.jpg",
                  "Hier ist der gefundene Ring. Und jetzt lassen Sie mich Feierabend machen!", "OUTCOME_A", false, "evidence_briefcase_lock"),
                End("end_erna_b", "Schankwirtin Erna", "assets/helene.jpg",
                  "Folgen Sie dem Parfümgeruch. Der Kerl stinkt nach teurem Lavendelwasser.", "OUTCOME_B"),
                End("end_erna_d", "Schankwirtin Erna", "assets/helene.jpg",
                  "Die Stammgäste meiner Schänke haben damit nichts zu tun. Nur die feinen Leute aus der Oberstadt.", "OUTCOME_D")
            };

            // 7. Wachmann Rolf (Ludwigstraße)
            trees["ludwig_rolf_rolf"] = new List<Node> {
                N("start", "Wachmann Rolf", "assets/passant.jpg",
                  "(Spielt nervös mit seiner Taschenlampe) Was wollen Sie hier? Das Kanzleiarchiv ist strengstens versiegelt. In der Brandnacht war hier niemand, darauf gebe ich mein Ehrenwort!",
                  C("[Empathisch] Ein einsamer Dienst bei eisiger Kälte. Haben Sie draußen keinen Lärm bemerkt?", "rolf_empathic"),
                  C("[Sachlich] Wir untersuchen Diebstahl historischer Notariatsurkunden. Wo waren Sie zwischen 21:00 und 23:00 Uhr?", "rolf_factual"),
                  C("[Konfrontativ] Warum zittern Ihre Hände, Rolf? Sie haben Bestechungsgeld kassiert, um wegzusehen!", "rolf_confront")
                ),
                N("rolf_empathic", "Wachmann Rolf", "assets/passant.jpg",
                  "Eiskalt, ja... Ich war gerade auf dem Kontrollgang im Innenhof. Da hörte ich einen Wagen halten. Aber als ich nachsah, war niemand mehr da.",
                  C("[Sachlich] Was für ein Wagen war das?", "rolf_car"),
                  C("[Beweis vorlegen] Woher stammt dann diese goldene Taschenuhr an Ihrem Handgelenk?", "rolf_watch", "beweis_antike_uhr", 0, false, "herold", 20)
                ),
                N("rolf_factual", "Wachmann Rolf", "assets/passant.jpg",
                  "Ich habe um 21:30 Uhr und um 22:30 Uhr vorschriftsmäßig gestempelt. Meine Stechuhr lügt nicht. Hier kam keine unbefugte Person herein.",
                  C("[Widerspruch aufdecken] Ihre Stechuhr hat eine Lücke zwischen 21:45 und 22:15 Uhr – genau zur Brandzeit!", "rolf_contra", null, 0, true),
                  C("[Sachlich] Wurden Kisten aus dem Notariat transportiert?", "rolf_boxes")
                ),
                N("rolf_confront", "Wachmann Rolf", "assets/passant.jpg",
                  "(Wird kreidebleich) Bestechungsgeld?! Wer behauptet so etwas? Ich arbeite seit zwölf Jahren für den Wachdienst!",
                  C("[Beweis vorlegen] Diese gravierte Taschenuhr mit den Initialen 'V. H.' wurde bei Ihnen sichergestellt!", "rolf_watch", "beweis_antike_uhr", 0, false, "herold", 25),
                  C("[Druck erhöhen] Beihilfe zur Brandstiftung bedeutet mindestens fünf Jahre Haft, Rolf!", "rolf_fail")
                ),
                N("rolf_contra", "Wachmann Rolf", "assets/passant.jpg",
                  "(Schluckt schwer) Ich... ich war kurz weg. Jemand steckte mir einen Umschlag zu. Ich sollte für eine halbe Stunde die Augen schließen und spazieren gehen.",
                  C("[Sachlich] Wer steckte Ihnen den Umschlag zu?", "rolf_confess")
                ),
                N("rolf_watch", "Wachmann Rolf", "assets/passant.jpg",
                  "(Bricht ein und stützt sich an der Wand ab) Herr Herold... Der Kunsthändler war es! Er kam mit einem Lederfutteral und gab mir die Uhr als 'Pfand'. Er wollte nur eine bestimmte Akte aus dem Safe holen!",
                  C("[Geständnis sichern] Und kurz darauf brannte es im Rathaus.", "end_rolf_a", null, 0, false, "herold", 20)
                ),
                N("rolf_car", "Wachmann Rolf", "assets/passant.jpg",
                  "Eine dunkle Staatslimousine. Eine Frau im Hosenanzug stieg aus und herrschte Herold an: 'Wo bleiben die Verträge?!' Sie stritten heftig.",
                  C("[Schlussfolgerung] Gipser und Herold stritten um die Dokumente.", "end_rolf_b", null, 0, false, "gipser", 15)
                ),
                N("rolf_boxes", "Wachmann Rolf", "assets/passant.jpg",
                  "Zwei schwere Archivkästen wurden in den Kofferraum geladen. Dann fuhr der Wagen mit quietschenden Reifen davon.",
                  C("[Schlussfolgerung] Die Originalverträge wurden entwendet.", "end_rolf_b")
                ),
                N("rolf_confess", "Wachmann Rolf", "assets/passant.jpg",
                  "Ein Mann mit Gehstock und Samtweste. Er sagte, er tue der Stadt einen Gefallen. Ich wusste nicht, dass Renger entführt wird! Ich schwöre es!",
                  C("[Aussage protokollieren] Herold ist schwer belastet.", "end_rolf_a")
                ),
                End("rolf_fail", "Wachmann Rolf", "assets/passant.jpg",
                  "Ich sage kein einziges Wort mehr ohne meinen Anwalt! Verhaften Sie mich doch!", "OUTCOME_C", true),
                End("end_rolf_a", "Wachmann Rolf", "assets/rolf.jpg",
                  "Hier ist die Quittung und die Taschenuhr. Ich sage vor Gericht gegen Herold aus!", "OUTCOME_A", false, "beweis_antike_uhr"),
                End("end_rolf_b", "Wachmann Rolf", "assets/passant.jpg",
                  "Passen Sie auf sich auf. Wenn Frau von Gipser erfährt, dass ich geredet habe, bin ich geliefert.", "OUTCOME_B"),
                End("end_rolf_d", "Wachmann Rolf", "assets/passant.jpg",
                  "Rolf hat das Feuer nicht selbst gelegt – er war nur das bestochene Werkzeug.", "OUTCOME_D")
            };

            // 8. Käpt'n (Karolinenstraße)
            trees["karo_kaeptn_kaeptn"] = new List<Node> {
                N("start", "Käpt'n", "assets/flussschiffer.jpg",
                  "(Hockt im Windschatten der gelben Telefonzelle, nippt an einer Thermoskanne) Ahoi, Landratte. Wenn du telefonieren willst: Der Apparat schluckt nur noch Groschen und spuckt Flüche aus. Ansonsten lass einen Seemann in Ruh'.",
                  C("[Empathisch] Kalter Wind heute Nacht, Käpt'n. Hier, heißer Kaffee. Hat vorhin jemand in der Zelle telefoniert?", "kaeptn_empathic"),
                  C("[Sachlich] Wir untersuchen einen Notruf von dieser Zelle. Wer hat den Hörer vor einer halben Stunde benutzt?", "kaeptn_factual"),
                  C("[Konfrontativ] Stehen Sie auf! Sie lungern an einem Tatort herum. Entweder Sie reden, oder ich nehme Sie mit!", "kaeptn_confront")
                ),
                N("kaeptn_empathic", "Käpt'n", "assets/flussschiffer.jpg",
                  "Danke für den Schluck, das wärmt die alten Knochen. Ja, hier war Betrieb wie im Hamburger Hafen! Zwei Leute haben sich fast um den Hörer geprügelt.",
                  C("[Sachlich] Beschreiben Sie die beiden Personen.", "kaeptn_persons"),
                  C("[Widerspruch aufdecken] Vorhin sagten Sie noch, der Apparat sei kaputt – wie konnten sie dann telefonieren?", "kaeptn_contra", null, 0, true)
                ),
                N("kaeptn_factual", "Käpt'n", "assets/flussschiffer.jpg",
                  "Um 21:15 Uhr war zuerst der Archivar da – Dr. Renger. Er hat gezittert und panisch eine Nummer gewählt. Er schrie ins Telefon: 'Blume, sie haben das Archiv umstellt!'",
                  C("[Sachlich] Und wer kam danach?", "kaeptn_second"),
                  C("[Beweis vorlegen] Stammt dieses Tonband von dem Anruf?", "kaeptn_tape", "evidence_phone_warning", 0, false, "none", 0)
                ),
                N("kaeptn_confront", "Käpt'n", "assets/flussschiffer.jpg",
                  "Mitnehmen?! Der Käpt'n saß schon in Singapur im Kerker, da haben Sie noch in die Windeln gemacht! Ich weiß gar nichts!",
                  C("[Einlenken] Schon gut, alter Seemann. Ich brauche Ihre Hilfe, um ein Verbrechen aufzuklären.", "kaeptn_empathic"),
                  C("[Druck erhöhen] Abmarsch zur Wache wegen Behinderung der Justiz!", "kaeptn_fail")
                ),
                N("kaeptn_contra", "Käpt'n", "assets/flussschiffer.jpg",
                  "(Grinst zahnlos) Kaputt ist der Münzschlitz! Aber wer eine Telefonkarte hat, kommt durch. Die feine Dame hatte so ein goldenes Kärtchen.",
                  C("[Sachlich] Was hat die Dame gesagt?", "kaeptn_second")
                ),
                N("kaeptn_persons", "Käpt'n", "assets/flussschiffer.jpg",
                  "Zuerst der magere Gelehrte mit Hornbrille. Danach eine Frau im Pelzmantel. Sie wählte eine Direktnummer und zischte: 'Renger ist gefasst. Schafft ihn zum Alten Spital!'",
                  C("[Schlussfolgerung] Renger wird im Alten Spital gefangen gehalten.", "end_kaeptn_a", null, 0, false, "gipser", 15)
                ),
                N("kaeptn_second", "Käpt'n", "assets/flussschiffer.jpg",
                  "Sie sagte: 'Planieren Sie das Saaleufer, egal was die alten Verträge sagen. Und sagt Herold, er soll die Fresse halten.' Eiskalt war die.",
                  C("[Schlussfolgerung] Katharina von Gipser zieht die Fäden.", "end_kaeptn_a", null, 0, false, "gipser", 20)
                ),
                N("kaeptn_tape", "Käpt'n", "assets/flussschiffer.jpg",
                  "Genau diese Aufnahme! Renger hat im Eifer seine Notizmappe in der Zelle vergessen. Ich hab sie für Sie aufgehoben.",
                  C("[Beweis annehmen] Hervorragend, Käpt'n.", "end_kaeptn_a")
                ),
                End("kaeptn_fail", "Käpt'n", "assets/flussschiffer.jpg",
                  "Ich singe jetzt Shanties, Kollege. 'What shall we do with a drunken sailor...' Kein Wort mehr!", "OUTCOME_C", true),
                End("end_kaeptn_a", "Käpt'n", "assets/flussschiffer.jpg",
                  "Hier ist die Notiz aus der Telefonzelle. Bringen Sie den Gelehrten heil nach Hause!", "OUTCOME_A", false, "evidence_phone_warning"),
                End("end_kaeptn_b", "Käpt'n", "assets/flussschiffer.jpg",
                  "Halten Sie sich von der Limousine fern. Der Chauffeur versteht keinen Spaß.", "OUTCOME_B"),
                End("end_kaeptn_d", "Käpt'n", "assets/flussschiffer.jpg",
                  "Käpt'n bestätigt: Dr. Renger war das Opfer der Entführung, kein Erpresser.", "OUTCOME_D")
            };
        }

        // ==========================================
        // STATIONS 9 to 12
        // ==========================================
        static void BuildStation9To12(Dictionary<string, object> trees) {
            // 9. Lisa (Schlossplatz)
            trees["schloss_lisa_lisa"] = new List<Node> {
                N("start", "Lisa", "assets/informantin.jpg",
                  "(Blättert in Stadtplänen unter der Laterne) Ein nächtlicher Besucher auf dem Schlossplatz. Suchen Sie die Spuren der Markgrafen oder das dunkle Geheimnis des Brandes von 1823?",
                  C("[Empathisch] Ihre Liebe zu Hofs Geschichte ehrt Sie, Lisa. Dr. Renger forschte daran – und ist verschwunden.", "lisa_empathic"),
                  C("[Sachlich] Als Stadtführerin kennen Sie jeden Gewölbegang. Gab es kürzlich Begehungen der Residenzkeller?", "lisa_factual"),
                  C("[Konfrontativ] Was sucht eine Stadtführerin mitten in der Nacht hier? Treffen Sie Ihre Hintermänner?", "lisa_confront")
                ),
                N("lisa_empathic", "Lisa", "assets/informantin.jpg",
                  "Renger war mein Dozent an der Uni! Er hat mir vor einer Woche von den Geheimklauseln des Pakts erzählt. Er hatte Angst vor den Nachfahren der Patrizier.",
                  C("[Sachlich] Wer sind diese Nachfahren heute?", "lisa_families"),
                  C("[Beweis vorlegen] Erkennen Sie dieses Ambigramm-Dokument wieder?", "lisa_ambigram", "evidence_ambigram_mirror", 0, false, "none", 0)
                ),
                N("lisa_factual", "Lisa", "assets/informantin.jpg",
                  "Die Schlosskeller sind offiziell gesperrt. Aber vorhin parkte ein schwarzer Wagen am Hintertor. Leute vom Bauamt gingen mit Plänen hinunter.",
                  C("[Widerspruch aufdecken] Gesperrt, aber Leute vom Bauamt gehen mitten in der Nacht hinunter?", "lisa_contra", null, 0, true),
                  C("[Sachlich] Was suchten die Leute da unten?", "lisa_vault")
                ),
                N("lisa_confront", "Lisa", "assets/informantin.jpg",
                  "Unverschämtheit! Ich bereite die morgendliche Stadtführung vor! Wenn Sie so mit Zeugen umgehen, finden Sie Renger nie!",
                  C("[Einlenken] Verzeihung. Rengers Leben steht auf dem Spiel. Wer war hier?", "lisa_factual"),
                  C("[Druck erhöhen] Keine Ausreden! Zur Wache zur Vernehmung!", "lisa_fail")
                ),
                N("lisa_contra", "Lisa", "assets/informantin.jpg",
                  "(Wird nervös) Frau von Gipser persönlich beaufsichtigte die Vermessung. Sie sagte laut: 'Wenn der Schlossplatz saniert wird, tilgen wir alle alten Erbrechte.'",
                  C("[Schlussfolgerung] Gipser will die Erbrechte vernichten.", "end_lisa_b", null, 0, false, "gipser", 15)
                ),
                N("lisa_families", "Lisa", "assets/informantin.jpg",
                  "Drei Familien unterzeichneten 1823: Die Familie Herold (Handel), die Familie Gipser (Liegenschaften) und die Linie Heiden (Kirchenvogt). Es war ein Pakt zur Aufteilung der Stadt!",
                  C("[Schlussfolgerung] Die drei Verdächtigen sind die Bluts-Erben des Pakts.", "end_lisa_a", null, 0, false, "herold", 10)
                ),
                N("lisa_vault", "Lisa", "assets/informantin.jpg",
                  "Sie suchten nach dem verschollenen Fundationsbrief. Dr. Renger hatte ihn aber vor ihren Augen versteckt – in einem Ambigramm-Pergament codiert!",
                  C("[Beweis sichern] Das Ambigramm birgt den Schlüssel.", "end_lisa_a")
                ),
                N("lisa_ambigram", "Lisa", "assets/informantin.jpg",
                  "Genau dieses Pergament! Drehen Sie es um 180 Grad – dann offenbart sich das geheime Kennwort 'PAKT 1823'. Nehmen Sie meine Lupe!",
                  C("[Hinweis notieren] Der Code ist entschlüsselt.", "end_lisa_a")
                ),
                End("lisa_fail", "Lisa", "assets/informantin.jpg",
                  "Ich rede mit Ihnen nicht weiter. Wenden Sie sich an das Kulturamt!", "OUTCOME_C", true),
                End("end_lisa_a", "Lisa", "assets/informantin.jpg",
                  "Hier ist das entschlüsselte Ambigramm-Dokument. Viel Erfolg!", "OUTCOME_A", false, "evidence_ambigram_mirror"),
                End("end_lisa_b", "Lisa", "assets/informantin.jpg",
                  "Achten Sie auf Frau von Gipser. Sie scheut vor nichts zurück.", "OUTCOME_B"),
                End("end_lisa_d", "Lisa", "assets/informantin.jpg",
                  "Historische Aufklärung: Die Zünfte waren unschuldig am großen Brand.", "OUTCOME_D")
            };

            // 10. Wärschtlamo Karl (Sonnenplatz)
            trees["sonne_karl_karl"] = new List<Node> {
                N("start", "Wärschtlamo Karl", "assets/stammgast.jpg",
                  "(Dampf steigt aus dem Messingkessel) 'Wärschtla, haaß aus'n Kessel!' Grüß Gott, Herr Kommissar! Senf oder Kren? Wer nachts ermittelt, braucht was Warmes im Bauch.",
                  C("[Empathisch] Zwei Paar mit Senf, Karl. Sie stehen mitten in Hof – wer ist Ihnen heute Nacht aufgefallen?", "karl_empathic"),
                  C("[Sachlich] Karl, polizeiliche Ermittlung. Wer ist zwischen 21:30 und 23:00 Uhr über den Sonnenplatz gerannt?", "karl_factual"),
                  C("[Konfrontativ] Machen Sie den Kessel zu, Karl. Es geht um schwere Brandstiftung! Haben Sie Schmiere gestanden?", "karl_confront")
                ),
                N("karl_empathic", "Wärschtlamo Karl", "assets/stammgast.jpg",
                  "Hier, bitteschön, knackig und heiß! Aufgefallen? Um viertel nach zehn kam der Domorganist Heiden vorbei. Völlig außer Atem, bleich wie eine Wand.",
                  C("[Sachlich] Was wollte Heiden um diese Zeit?", "karl_heiden"),
                  C("[Beweis vorlegen] Hatte er diesen Notizzettel mit lateinischen Gesängen bei sich?", "karl_note", "beweis_chorknaben_notiz", 0, false, "heiden", 15)
                ),
                N("karl_factual", "Wärschtlamo Karl", "assets/stammgast.jpg",
                  "Hier kamen zwei vorbei. Erst der Organist mit langen grauen Haaren, murmelte Bibelverse. Eine halbe Stunde später die feine Stadträtin im Hosenanzug mit ihrem Chauffeur.",
                  C("[Widerspruch aufdecken] Heidens Alibi behauptet, er war bis Mitternacht in der Marienkirche. Haben Sie ihn hier gesehen?", "karl_contra", null, 0, true),
                  C("[Sachlich] Haben die beiden miteinander gesprochen?", "karl_talk")
                ),
                N("karl_confront", "Wärschtlamo Karl", "assets/stammgast.jpg",
                  "Schmiere gestanden?! Ich bin der Wärschtlamo, ein Hofer Wahrzeichen! Respektieren Sie das Handwerk, Herr Wachtmeister!",
                  C("[Einlenken] Verzeihung, Karl. Ein Mensch wurde entführt. Wer war hier am Platz?", "karl_factual"),
                  C("[Druck erhöhen] Reden Sie, oder ich mache Ihren Stand dicht!", "karl_fail")
                ),
                N("karl_contra", "Wärschtlamo Karl", "assets/stammgast.jpg",
                  "In der Marienkirche?! Niemals! Er stand um 22:15 Uhr genau vor meinem Kessel, hat zwei Paar Würste verschlungen und gezittert. Seine Finger waren voller Ruß!",
                  C("[Schlussfolgerung] Heidens Alibi ist zertrümmert. Finger voller Ruß.", "end_karl_a", null, 0, false, "heiden", 20)
                ),
                N("karl_heiden", "Wärschtlamo Karl", "assets/stammgast.jpg",
                  "Er murmelte: 'Das Fegefeuer brennt am Rathaus, nun muss der Turm von Michaelis versiegelt werden.' Dann ließ er seinen Notizblock auf meiner Bank liegen.",
                  C("[Beweis sichern] Karls Fund belegt Heidens Schuld.", "end_karl_a", null, 0, false, "heiden", 20)
                ),
                N("karl_talk", "Wärschtlamo Karl", "assets/stammgast.jpg",
                  "Sie haben sich angeschrien! Frau von Gipser sagte: 'Severin, du hast den Verstand verloren! Wir wollten die Verträge, nicht das ganze Rathaus abfackeln!'",
                  C("[Schlussfolgerung] Gipser und Heiden als zerstrittene Mittäter.", "end_karl_b", null, 0, false, "gipser", 15)
                ),
                N("karl_note", "Wärschtlamo Karl", "assets/stammgast.jpg",
                  "Genau der Zettel mit meinem Senffleck drauf! Heiden hat ihn verloren, als er panisch Richtung St. Michaelis rannte.",
                  C("[Beweis zuordnen] Eindeutiger Sachbeweis.", "end_karl_a")
                ),
                End("karl_fail", "Wärschtlamo Karl", "assets/stammgast.jpg",
                  "Deckel zu! Ich sag gar nix mehr. Gehen Sie woanders ermitteln!", "OUTCOME_C", true),
                End("end_karl_a", "Wärschtlamo Karl", "assets/stammgast.jpg",
                  "Hier ist Heidens Notizblock mit den Chornotizen. Bringen Sie ihn zur Vernunft!", "OUTCOME_A", false, "beweis_chorknaben_notiz"),
                End("end_karl_b", "Wärschtlamo Karl", "assets/stammgast.jpg",
                  "Passen Sie auf sich auf. Der Heiden sah aus, als würde er gleich explodieren.", "OUTCOME_B"),
                End("end_karl_d", "Wärschtlamo Karl", "assets/stammgast.jpg",
                  "Karl bezeugt: Keine Schlägertrupps am Sonnenplatz, nur die Verdächtigen selbst.", "OUTCOME_D")
            };

            // 11. Mesnerin Gertrud (St. Marien)
            trees["marien_gertrud_gertrud"] = new List<Node> {
                N("start", "Mesnerin Gertrud", "assets/helene.jpg",
                  "(Schließt mit großem Schlüsselbund das Seitenportal auf) Was suchen Sie im Gotteshaus zur Unzeit? Die Andacht ist vorbei, die Lichter gelöscht. Stören Sie nicht den Frieden des Herrn.",
                  C("[Empathisch] Verzeihen Sie die Störung, Frau Gertrud. Aber der Brand am Rathaus bedroht ganz Hof. Fand hier eine späte Zusammenkunft statt?", "gertrud_empathic"),
                  C("[Sachlich] Mesnerin Gertrud, wir überprüfen das Alibi des Domorganisten Heiden. War er heute Abend hier anwesend?", "gertrud_factual"),
                  C("[Konfrontativ] Versuchen Sie nicht, die Türen zu verriegeln! Wir wissen, dass hier Beweise versteckt wurden!", "gertrud_confront")
                ),
                N("gertrud_empathic", "Mesnerin Gertrud", "assets/helene.jpg",
                  "Herr Heiden hielt eine Sonderandacht für den Chor. Aber er war seltsam verändert. Er sprach nicht von Vergebung, sondern von göttlichem Strafgericht über die Stadt Hof.",
                  C("[Sachlich] Wann hat er die Marienkirche verlassen?", "gertrud_time"),
                  C("[Beweis vorlegen] Gehört dieses Abhörprotokoll zu seinen Äußerungen?", "gertrud_wiretap", "evidence_wiretap_log", 0, false, "heiden", 15)
                ),
                N("gertrud_factual", "Mesnerin Gertrud", "assets/helene.jpg",
                  "Er behauptet, er sei bis Mitternacht im Gebet versunken gewesen. Als Mesnerin muss ich die Kirche um 21:30 Uhr zusperren. Ich habe ihn persönlich vor die Tür gebeten.",
                  C("[Widerspruch aufdecken] Also hat Heiden gelogen! Er war um 21:45 Uhr gar nicht mehr in der Kirche!", "gertrud_contra", null, 0, true),
                  C("[Sachlich] Wohin ging er nach 21:30 Uhr?", "gertrud_time")
                ),
                N("gertrud_confront", "Mesnerin Gertrud", "assets/helene.jpg",
                  "Unverschämtheit! Dies ist eine geweihte Stätte! Ich lasse mich von weltlichen Schnüfflern nicht beschuldigen!",
                  C("[Einlenken] Rengers Leben steht auf dem Spiel. Wir müssen wissen, ob Heiden die Kirche verließ.", "gertrud_factual"),
                  C("[Druck erhöhen] Wer einen Verbrecher deckt, macht sich strafbar!", "gertrud_fail")
                ),
                N("gertrud_contra", "Mesnerin Gertrud", "assets/helene.jpg",
                  "(Senkt bestürzt den Blick) Ja... er hat gelogen. Er rannte um 21:35 Uhr eilig hinaus. Er trug eine lange Metallstange und ein altes Buch unter dem Arm.",
                  C("[Sachlich] Welches Buch?", "gertrud_book")
                ),
                N("gertrud_time", "Mesnerin Gertrud", "assets/helene.jpg",
                  "Er lief in Richtung St. Michaelis und rief: 'Die Pforte muss versiegelt werden vor den Heidenkindern!'",
                  C("[Schlussfolgerung] Heiden blockierte St. Michaelis.", "end_gertrud_a", null, 0, false, "heiden", 20)
                ),
                N("gertrud_book", "Mesnerin Gertrud", "assets/helene.jpg",
                  "Das historische Chorbuch von 1823 mit den verschlüsselten Partituren. Er murmelte ständig die Notenfolge B-A-C-H.",
                  C("[Schlussfolgerung] B-A-C-H ist Heidens Chiffre.", "end_gertrud_a", null, 0, false, "heiden", 15)
                ),
                N("gertrud_wiretap", "Mesnerin Gertrud", "assets/helene.jpg",
                  "Herrje... die Aufnahme ist eindeutig. Seine Stimme, wie er den Pakt beschwört. Ich händige Ihnen seine Notizen aus, die er auf der Orgelbank vergaß.",
                  C("[Beweis sichern] Belastendes Material gegen Heiden.", "end_gertrud_a")
                ),
                End("gertrud_fail", "Mesnerin Gertrud", "assets/helene.jpg",
                  "Verschwinden Sie aus dem Gotteshaus! Ich verweigere jede Aussage!", "OUTCOME_C", true),
                End("end_gertrud_a", "Mesnerin Gertrud", "assets/helene.jpg",
                  "Hier ist das Abhörprotokoll und Heidens Notenblatt. Bringen Sie ihn zur Besinnung.", "OUTCOME_A", false, "evidence_wiretap_log"),
                End("end_gertrud_b", "Mesnerin Gertrud", "assets/helene.jpg",
                  "Beten Sie für die Stadt Hof. Dunkle Wolken ziehen auf.", "OUTCOME_B"),
                End("end_gertrud_d", "Mesnerin Gertrud", "assets/helene.jpg",
                  "Die Gemeinde St. Marien distanziert sich von Heidens Taten.", "OUTCOME_D")
            };

            // 12. Gärtner Huber (St. Michaelis)
            trees["michael_huber_huber"] = new List<Node> {
                N("start", "Gärtner Huber", "assets/fischer.jpg",
                  "(Zuckt erschrocken zusammen, lässt die Schere fallen) Herr im Himmel! Schleichen Sie nicht so herum wie ein Gespenst! Was treibt Sie um diese Zeit auf den Friedhof von St. Michaelis?",
                  C("[Empathisch] Keine Sorge, Herr Huber. Niemand will Ihnen etwas tun. Sie wirken verängstigt. Was ist hier vorgefallen?", "huber_empathic"),
                  C("[Sachlich] Herr Huber, das Messingrad an der Friedhofspforte wurde blockiert. Wer hat daran manipuliert?", "huber_factual"),
                  C("[Konfrontativ] Hände hoch, Huber! Wer nachts um Gräber schleicht, während das Rathaus brennt, hat Dreck am Stecken!", "huber_confront")
                ),
                N("huber_empathic", "Gärtner Huber", "assets/fischer.jpg",
                  "(Atmet keuchend auf) Verängstigt? Zu Tode erschrocken bin ich! Wissen Sie, wer vor einer halben Stunde hier oben herumbrüllte? Der Domorganist! Völlig von Sinnen!",
                  C("[Sachlich] Was genau hat der Organist getan?", "huber_details"),
                  C("[Beweis vorlegen] Hat er versucht, dieses Kryptorad mit Gewalt zu verriegeln?", "huber_wheel", "evidence_brass_wheel", 0, false, "heiden", 20)
                ),
                N("huber_factual", "Gärtner Huber", "assets/fischer.jpg",
                  "Ich kümmere mich nur um die Rosen und den Rasen. Heiden kam mit einem langen Brecheisen und einem alten Schlüssel. Er schob den Riegel am Turm vor und brach den Schlüssel ab!",
                  C("[Widerspruch aufdecken] Vorhin sagten Sie noch, Sie wüssten von nichts – nun haben Sie den abgebrochenen Schlüssel gesehen?", "huber_contra", null, 0, true),
                  C("[Sachlich] Warum hat er den Turm verriegelt?", "huber_why")
                ),
                N("huber_confront", "Gärtner Huber", "assets/fischer.jpg",
                  "Dreck am Stecken?! Ich bin Friedhofsgärtner in der dritten Generation! Ich lasse mich von Ihnen nicht wie einen Grabräuber behandeln!",
                  C("[Einlenken] Entschuldigen Sie meine Schärfe. Renger könnte da oben im Turm gefangen sein!", "huber_empathic"),
                  C("[Druck erhöhen] Entweder Sie öffnen jetzt, oder Sie wandern in Untersuchungshaft!", "huber_fail")
                ),
                N("huber_contra", "Gärtner Huber", "assets/fischer.jpg",
                  "(Zittert am ganzen Leib) Ich wollte mich doch nur schützen! Heiden hat gedroht: 'Wer den Turm betritt, bevor das Werk vollendet ist, wird mit Feuer gerichtet!' Er hat Renger da oben eingesperrt!",
                  C("[Schlussfolgerung] Dr. Renger ist im Südturm gefangen!", "end_huber_a", null, 0, false, "heiden", 25)
                ),
                N("huber_details", "Gärtner Huber", "assets/fischer.jpg",
                  "Er murmelte, dass die 'Akte von 1823 gereinigt' werden müsse. Er hatte einen Kanister Petroleum bei sich! Er will den Turm anzünden, wenn jemand kommt!",
                  C("[Schlussfolgerung] Höchste Gefahr: Geiselnahme und Brandgefahr.", "end_huber_a", null, 0, false, "heiden", 20)
                ),
                N("huber_why", "Gärtner Huber", "assets/fischer.jpg",
                  "Weil das Kryptorad den Turmzugang schützt. Nur wer die Losung 'ORDO SCHLAPPIS 1823' kennt, kann das Messingrad drehen und die Pforte entriegeln.",
                  C("[Code sichern] Der Türcode ist 'ORDO SCHLAPPIS 1823'.", "end_huber_a")
                ),
                N("huber_wheel", "Gärtner Huber", "assets/fischer.jpg",
                  "Ja! Das ist das Rad! Er hat den Mechanismus blockiert. Mit Ihrer Entschlüsselung können wir die Sperre überwinden. Nehmen Sie meinen Schmierstoff und den Zweitschlüssel!",
                  C("[Schlüssel annehmen] Zugang zum Turm frei.", "end_huber_a")
                ),
                End("huber_fail", "Gärtner Huber", "assets/fischer.jpg",
                  "(Verbarrikadiert sich im Wärterhäuschen) Lassen Sie mich in Ruhe! Ich sage kein Wort mehr!", "OUTCOME_C", true),
                End("end_huber_a", "Gärtner Huber", "assets/fischer.jpg",
                  "Hier ist die Lösung für das Kryptorad. Retten Sie den Mann da oben im Turm!", "OUTCOME_A", false, "evidence_brass_wheel"),
                End("end_huber_b", "Gärtner Huber", "assets/fischer.jpg",
                  "Seien Sie leise beim Aufstieg. Heiden ist bis an die Zähne bewaffnet.", "OUTCOME_B"),
                End("end_huber_d", "Gärtner Huber", "assets/fischer.jpg",
                  "Huber hat keine Schuld: Er wurde von Heiden mit dem Tod bedroht.", "OUTCOME_D")
            };
        }

        // ==========================================
        // BONUS STATIONS (13 to 16)
        // ==========================================
        static void BuildBonusStations(Dictionary<string, object> trees) {
            // 13. Schwester Maria (Hospitalkirche)
            trees["hospital_maria_maria"] = new List<Node> {
                N("start", "Schwester Maria", "assets/informantin.jpg",
                  "(Hält sich den Finger an die Lippen) Pst! Bitte leise sprechen. Die Kranken im alten Spital schlafen unruhig. Durch die Fenster dringt schon genug Lärm vom Saaleufer herauf. Was führt die Polizei hierher?",
                  C("[Empathisch] Verzeihen Sie die späte Störung, Schwester. Wir suchen nach Hinweisen zu einer geheimen Übergabe. Haben Sie draußen jemanden gesehen?", "maria_empathic"),
                  C("[Sachlich] Schwester Maria, wir verfolgen Spuren zum Ufer der Hospitalkirche. Gab es hier vorhin verdächtige Vorgänge?", "maria_factual"),
                  C("[Konfrontativ] Schwester, machen Sie das Fenster ganz auf! Ein Zeuge sah, wie von hier Lichtsignale an den Fluss gegeben wurden!", "maria_confront")
                ),
                N("maria_empathic", "Schwester Maria", "assets/informantin.jpg",
                  "Ich bin seit zehn Uhr auf den Beinen. Vorhin schaute ich aus dem Erker. Ein feiner Herr im dunklen Mantel mit Gehstock stand unten am Kirchenportal und wartete nervös.",
                  C("[Sachlich] Hat der Mann auf jemanden gewartet?", "maria_waiting"),
                  C("[Beweis vorlegen] Hat er diese fluoreszierende Formel an die Pforte gemalt?", "maria_formula", "evidence_uv_formula", 0, false, "herold", 15)
                ),
                N("maria_factual", "Schwester Maria", "assets/informantin.jpg",
                  "Unten an der Saale legte kurz ein Motorboot an. Der Mann mit dem Gehstock stritt mit der Person im Boot. Dann strich er mit einer seltsamen Flüssigkeit über den Steinbogen.",
                  C("[Widerspruch aufdecken] Zuerst hieß es, Sie blieben drinnen bei den Kranken – wie konnten Sie das Boot im Nebel sehen?", "maria_contra", null, 0, true),
                  C("[Sachlich] Wie sah die Person im Boot aus?", "maria_boat")
                ),
                N("maria_confront", "Schwester Maria", "assets/informantin.jpg",
                  "Lichtsignale?! Ich bin eine Diakonisse, kein Spion! Wie können Sie es wagen, den Krankenbereich mit solchen Unterstellungen zu stören!",
                  C("[Einlenken] Entschuldigen Sie, die Nerven liegen blank. Was sahen Sie am Kirchenportal?", "maria_empathic"),
                  C("[Druck erhöhen] Behindern Sie keine Mordermittlung, Schwester!", "maria_fail")
                ),
                N("maria_contra", "Schwester Maria", "assets/informantin.jpg",
                  "(Wird rot) Ich... ich war draußen, um Kräutertee für einen Patienten zu kühlen. Da sah ich ihn aus nächster Nähe. Er trug eine kostbare Samtweste und stützte sich auf einen Spazierstock mit Löwenknauf.",
                  C("[Schlussfolgerung] Valentin Herold war persönlich an der Hospitalkirche.", "end_maria_b", null, 0, false, "herold", 15)
                ),
                N("maria_waiting", "Schwester Maria", "assets/informantin.jpg",
                  "Er markierte die Saaleseite der Einfriedung mit einer unsichtbaren Schrift, die man nur unter violettem Schwarzlicht erkennen kann. Er sagte: 'Für den Boten!'",
                  C("[Beweis sichern] UV-Markierung am Kirchenportal.", "end_maria_a")
                ),
                N("maria_boat", "Schwester Maria", "assets/informantin.jpg",
                  "Es war ein Mann im Ölmantel. Er nahm eine schwere Dokumentenmappe entgegen und warf dem Hinkenden einen Sack Münzen zu. Dann fuhr das Boot flussabwärts.",
                  C("[Schlussfolgerung] Dokumenten-Übergabe gegen Bargeld.", "end_maria_b", null, 0, false, "herold", 15)
                ),
                N("maria_formula", "Schwester Maria", "assets/informantin.jpg",
                  "Genau dieses Leuchten! Mit Ihrer UV-Lampe wird die Schrift sichtbar: 'PAKTUS VERSTELLUS 1823'. Sie verweist auf das alte Spitalarchiv!",
                  C("[Hinweis notieren] Versteck im Spitalarchiv offenbart.", "end_maria_a")
                ),
                End("maria_fail", "Schwester Maria", "assets/informantin.jpg",
                  "(Schließt das Fenster energisch) Ich sage Ihnen gar nichts mehr. Sie stören die Nachtruhe!", "OUTCOME_C", true),
                End("end_maria_a", "Schwester Maria", "assets/informantin.jpg",
                  "Hier ist die Skizze der UV-Markierung. Seien Sie vorsichtig am Flussufer.", "OUTCOME_A", false, "evidence_uv_formula"),
                End("end_maria_b", "Schwester Maria", "assets/informantin.jpg",
                  "Der Mann mit dem Gehstock war sehr nervös. Er ist Richtung Altstadt geflohen.", "OUTCOME_B"),
                End("end_maria_d", "Schwester Maria", "assets/informantin.jpg",
                  "Das Spitalpersonal ist über jeden Verdacht erhaben.", "OUTCOME_D")
            };

            // 14. Fischer Jan (Saale-Ufer)
            trees["saale_jan_jan"] = new List<Node> {
                N("start", "Fischer Jan", "assets/fischer.jpg",
                  "(Kaut auf einer kalten Tabakspfeife, starrt ins Wasser) Petri Heil. Wenn du mir die Forellen verscheuchst mit deinen Stiefeln, fliegst du in die Saale. Was willst du am Fluss?",
                  C("[Empathisch] Ruhige Nacht zum Angeln, Jan. Die Strömung treibt heute einiges mit sich. Haben Sie etwas Ungewöhnliches im Wasser bemerkt?", "jan_empathic"),
                  C("[Sachlich] Kriminalpolizei. Wir suchen nach vernichteten Urkunden, die flussabwärts getrieben wurden.", "jan_factual"),
                  C("[Konfrontativ] Schluss mit dem Angeln! Hier verläuft eine Schmugglerroute. Was haben Sie in Ihrem Fangnetz versteckt?!", "jan_confront")
                ),
                N("jan_empathic", "Fischer Jan", "assets/fischer.jpg",
                  "Ungewöhnlich? Vor einer halben Stunde trieben zerrissene Papierfetzen mit roten Wachssiegeln direkt an meiner Pose vorbei. Hab ein paar mit dem Kescher rausgefischt.",
                  C("[Sachlich] Zeigen Sie mir die Papierfetzen.", "jan_letters"),
                  C("[Sachlich] Stand jemand am Ufer, als die Papiere trieben?", "jan_person")
                ),
                N("jan_factual", "Fischer Jan", "assets/fischer.jpg",
                  "Am Ufer stand eine Frau im Hosenanzug und zerriss wütend ein Dokument in tausend Stücke. Sie warf es in die Strömung und rief: 'Niemand beweist mir den Pakt!'",
                  C("[Widerspruch aufdecken] Erst sagten Sie, am Fluss sei tote Hose – woher wissen Sie, was sie rief?", "jan_contra", null, 0, true),
                  C("[Beweis vorlegen] Erkennen Sie diesen zerrissenen Drohbrief?", "jan_torn_proof", "evidence_torn_letter", 0, false, "gipser", 15)
                ),
                N("jan_confront", "Fischer Jan", "assets/fischer.jpg",
                  "Fangnetz?! Willst du meine Forellen beschlagnahmen, du Witzbold? Zieh Leine, bevor ich ungemütlich werde!",
                  C("[Einlenken] Entschuldige, Jan. Es geht um einen Großbrand und eine Entführung.", "jan_empathic"),
                  C("[Druck erhöhen] Du wanderst wegen Hehlerei in die Zelle!", "jan_fail")
                ),
                N("jan_contra", "Fischer Jan", "assets/fischer.jpg",
                  "(Schmunzelt grimmig) Wenn einer nachts am Ufer schreit, hallt das über das ganze Wasser! Eine schwarze Limousine wartete mit laufendem Motor auf sie.",
                  C("[Schlussfolgerung] Katharina von Gipser vernichtete Beweise persönlich.", "end_jan_b", null, 0, false, "gipser", 20)
                ),
                N("jan_letters", "Fischer Jan", "assets/fischer.jpg",
                  "Hier, ich hab die Schnipsel auf Zeitungspapier getrocknet. Wenn man sie zusammensetzt, liest man eine handfeste Drohung an Dr. Renger!",
                  C("[Beweis sichern] Zerrissener Drohbrief geborgen.", "end_jan_a")
                ),
                N("jan_person", "Fischer Jan", "assets/fischer.jpg",
                  "Es war die Stadträtin Gipser, ganz sicher. Ihre Stimme kenne ich aus dem Lokalfernsehen. Sie war außer sich vor Wut.",
                  C("[Aussage sichern] Zeuge bestätigt Gipsers Anwesenheit.", "end_jan_a", null, 0, false, "gipser", 20)
                ),
                N("jan_torn_proof", "Fischer Jan", "assets/fischer.jpg",
                  "Genau dieses Schriftstück! Sie hat es in Stücke gerissen. Nehmen Sie die restlichen Teile aus meinem Eimer!",
                  C("[Puzzleteile annehmen] Vollständiger Drohbrief gesichert.", "end_jan_a")
                ),
                End("jan_fail", "Fischer Jan", "assets/fischer.jpg",
                  "Schleich dich! Mit Schnüfflern rede ich nicht!", "OUTCOME_C", true),
                End("end_jan_a", "Fischer Jan", "assets/fischer.jpg",
                  "Hier sind die zerrissenen Briefteile. Bringen Sie der Dame Manieren bei!", "OUTCOME_A", false, "evidence_torn_letter"),
                End("end_jan_b", "Fischer Jan", "assets/fischer.jpg",
                  "Sie ist stromaufwärts gerannt. Sie wirkte wie eine Furie.", "OUTCOME_B"),
                End("end_jan_d", "Fischer Jan", "assets/fischer.jpg",
                  "Der Saale-Fischereiverein hat mit den Machenschaften nichts am Hut.", "OUTCOME_D")
            };

            // 15. Archivgehilfe Max (Altes Spital)
            trees["spital_max_max"] = new List<Node> {
                N("start", "Archivgehilfe Max", "assets/archivgehilfe_otto.jpg",
                  "(Kniet zitternd zwischen verstaubten Folianten im Keller) Wer ist da?! Kommen Sie nicht näher! Ich habe die Gründungsurkunde von 1432 gesichert... Sie dürfen sie nicht verbrennen!",
                  C("[Empathisch] Ganz ruhig, Max. Ich bin von der Kriminalpolizei. Dr. Renger wollte, dass die Urkunde sicher ist. Ich beschütze Sie.", "max_empathic"),
                  C("[Sachlich] Max, Sie sind Rengers Assistent. Warum verstecken Sie sich im Gewölbe, statt zur Polizei zu gehen?", "max_factual"),
                  C("[Konfrontativ] Hände hoch! Sie haben Akten aus dem Archiv gestohlen, bevor das Feuer ausbrach! Sie stehen unter Verdacht!", "max_confront")
                ),
                N("max_empathic", "Archivgehilfe Max", "assets/archivgehilfe_otto.jpg",
                  "(Weint vor Erleichterung) Gott sei Dank... Ich dachte, Gipsers Schläger hätten mich gefunden! Renger sagte, wenn ihm etwas zustößt, soll ich die Urkunde von 1432 hierher bringen.",
                  C("[Sachlich] Warum ist diese Urkunde von 1432 so gefährlich?", "max_why"),
                  C("[Beweis vorlegen] Gehört dieses Fragment zur Bundessatzung?", "max_charter", "evidence_charter_1432", 0, false, "none", 0)
                ),
                N("max_factual", "Archivgehilfe Max", "assets/archivgehilfe_otto.jpg",
                  "Weil der Polizeifunk manipuliert war! Ich hörte vorhin, wie jemand den Notruf am Bahnhof fingierte. Da wusste ich: Niemand ist sicher.",
                  C("[Widerspruch aufdecken] Woher haben Sie Zugriff auf den Polizeifunk?", "max_contra", null, 0, true),
                  C("[Sachlich] Wo ist Dr. Renger jetzt?", "max_renger")
                ),
                N("max_confront", "Archivgehilfe Max", "assets/archivgehilfe_otto.jpg",
                  "Gestohlen?! Ich habe das Hofer Kulturerbe vor den Flammen gerettet! Wenn Sie mich verhaften, verbrennen die Erben alles!",
                  C("[Einlenken] Beruhigen Sie sich. Woher wussten Sie vom Brand?", "max_empathic"),
                  C("[Druck erhöhen] Sie beantworten meine Fragen, oder ich lege Ihnen Handschellen an!", "max_fail")
                ),
                N("max_contra", "Archivgehilfe Max", "assets/archivgehilfe_otto.jpg",
                  "Renger hatte einen Scanner in der Stube! Er wusste, dass man ihn abhört. Er sagte mir vor seiner Verschleppung noch das Versteck im Bunker!",
                  C("[Sachlich] Welcher Bunker?", "max_bunker")
                ),
                N("max_why", "Archivgehilfe Max", "assets/archivgehilfe_otto.jpg",
                  "Die Satzung von 1432 beweist, dass die Handwerkerprivilegien unkündbar sind. Wenn dieses Dokument öffentlich wird, verliert Katharina von Gipser alle Baugenehmigungen und Herold seine Kunstprivilegien!",
                  C("[Schlussfolgerung] Die Urkunde entzieht den Verdächtigen die Existenz.", "end_max_a", null, 0, false, "gipser", 15)
                ),
                N("max_renger", "Archivgehilfe Max", "assets/archivgehilfe_otto.jpg",
                  "Heiden hat ihn verschleppt! Er brachte ihn zum Turm von St. Michaelis. Er will ihn zwingen, den Pakt vor Gott zu erneuern!",
                  C("[Schlussfolgerung] Renger ist im Turm von St. Michaelis.", "end_max_a", null, 0, false, "heiden", 20)
                ),
                N("max_bunker", "Archivgehilfe Max", "assets/archivgehilfe_otto.jpg",
                  "Das Schlappen-Versteck in der Unteren Vorstadt. Dort lagert der Pakt-Tresor. Ein Bote bewacht den Zugang.",
                  C("[Hinweis notieren] Bunker als Zielort identifiziert.", "end_max_a")
                ),
                N("max_charter", "Archivgehilfe Max", "assets/archivgehilfe_otto.jpg",
                  "Das ist das Originalsiegel! Nehmen Sie die Satzung von 1432. Damit haben Sie die unumstößliche Wahrheit in den Händen!",
                  C("[Urkunde annehmen] Das Kronjuwel der Beweisführung.", "end_max_a")
                ),
                End("max_fail", "Archivgehilfe Max", "assets/archivgehilfe_otto.jpg",
                  "(Versteckt sich in einer Mauernische) Ich traue niemandem mehr! Verschwinden Sie!", "OUTCOME_C", true),
                End("end_max_a", "Archivgehilfe Max", "assets/archivgehilfe_otto.jpg",
                  "Hier ist die Bundessatzung von 1432. Retten Sie Dr. Renger und Hofs Ehre!", "OUTCOME_A", false, "evidence_charter_1432"),
                End("end_max_b", "Archivgehilfe Max", "assets/archivgehilfe_otto.jpg",
                  "Beeilen Sie sich. Wenn Heiden das Feuer im Turm legt, ist alles verloren.", "OUTCOME_B"),
                End("end_max_d", "Archivgehilfe Max", "assets/archivgehilfe_otto.jpg",
                  "Max ist der Retter der Urkunden, kein Brandstifter.", "OUTCOME_D")
            };

            // 16. Schattenhafter Bote (Bunker / Versteck 15)
            trees["versteck_bote_bote"] = new List<Node> {
                N("start", "Schattenhafter Bote", "assets/geheimbund.jpg",
                  "(Steht vermummt im Schutz des Bunkers, Hand an der Jackentasche) Sie haben die Fährte bis hierher verfolgt, Ermittler. Aber der Pakt von 1823 überdauert Jahrhunderte. Sie kommen zu spät, um die Verträge zu retten.",
                  C("[Empathisch / Subtil] Der Pakt bricht bereits auseinander. Ihre Auftraggeber beschuldigen sich gegenseitig. Wollen Sie für fremde Verbrechen büßen?", "bote_empathic"),
                  C("[Sachlich] Nennen Sie das Codewort und treten Sie vom Tresor zurück. Der Bunker ist umstellt.", "bote_factual"),
                  C("[Konfrontativ] Keine Bewegung! Hände an die Wand! Ihr Geheimbund ist aufgeflogen, Sie sind verhaftet!", "bote_confront")
                ),
                N("bote_empathic", "Schattenhafter Bote", "assets/geheimbund.jpg",
                  "(Zögert) Gegenseitig beschuldigt? Gipser und Herold? Ich sollte nur die letzte Kassette sichern und auf das Boot warten.",
                  C("[Sachlich] Wer hat Ihnen den Schlüssel für den Tresor gegeben?", "bote_key"),
                  C("[Widerspruch aufdecken] Eben schworen Sie noch ewige Treue zum Bund – und jetzt zweifeln Sie?", "bote_contra", null, 0, true)
                ),
                N("bote_factual", "Schattenhafter Bote", "assets/geheimbund.jpg",
                  "Der Tresor öffnet sich nur mit dem Scanner oder dem Siegelring der Schlappen-Erben. Ohne das Siegel bleibt das Geheimnis für immer im Stahl verwahrt.",
                  C("[Beweis vorlegen] Meinen Sie diesen Sekten-Siegelring?", "bote_ring_check", "beweis_pakt_ring", 0, false, "none", 0),
                  C("[Sachlich] Was befindet sich im Tresor?", "bote_inside")
                ),
                N("bote_confront", "Schattenhafter Bote", "assets/geheimbund.jpg",
                  "Verhaftet?! Keiner nimmt einen Boten des Pakts lebend! Ich lasse den Bunker sprengen, wenn Sie näherkommen!",
                  C("[Einlenken] Beruhigen Sie sich. Es geht um Dr. Renger. Wo ist er?", "bote_empathic"),
                  C("[Druck erhöhen] Wagen Sie es nicht! Zugriff!", "bote_fail")
                ),
                N("bote_contra", "Schattenhafter Bote", "assets/geheimbund.jpg",
                  "Wenn Herold und Gipser mich verraten haben, warum sollte ich für sie sterben?! Herold hat die Schatulle geplündert und Heiden hat den Archivar entführt!",
                  C("[Geständnis sichern] Die Schuldigen sind entlarvt.", "end_bote_a", null, 0, false, "herold", 20)
                ),
                N("bote_key", "Schattenhafter Bote", "assets/geheimbund.jpg",
                  "Valentin Herold gab mir den Auftrag. Er wollte die letzte Brandkassette vor den Baggern der Gipser retten. Hier ist der Tresorschlüssel!",
                  C("[Schlüssel annehmen] Tresorschlüssel gesichert.", "end_bote_a", null, 0, false, "herold", 20)
                ),
                N("bote_inside", "Schattenhafter Bote", "assets/geheimbund.jpg",
                  "Die originalen Namenslisten aller Erben seit 1823 mit ihren Unterschriften und den gezahlten Bestechungsgeldern.",
                  C("[Schlussfolgerung] Das lückenlose Sündenregister des Pakts.", "end_bote_a")
                ),
                N("bote_ring_check", "Schattenhafter Bote", "assets/geheimbund.jpg",
                  "Das Siegel der Meister... Sie tragen den Ring. Dann trete ich beiseite. Nehmen Sie die Papiere aus dem Tresor.",
                  C("[Tresor öffnen] Das finale Dokumentenkonvolut erbeutet.", "end_bote_a")
                ),
                End("bote_fail", "Schattenhafter Bote", "assets/geheimbund.jpg",
                  "(Wirft eine Rauchgranate) Der Pakt wird niemals sterben! (Entkommt durch die Notluke)", "OUTCOME_C", true),
                End("end_bote_a", "Schattenhafter Bote", "assets/geheimbund.jpg",
                  "Hier ist der geheime Tresorschlüssel. Bringen Sie den Fall zu Ende.", "OUTCOME_A", false, "evidence_charter_1432"),
                End("end_bote_b", "Schattenhafter Bote", "assets/geheimbund.jpg",
                  "Dr. Renger lebt noch. Suchen Sie ihn im Turm von St. Michaelis!", "OUTCOME_B"),
                End("end_bote_d", "Schattenhafter Bote", "assets/geheimbund.jpg",
                  "Der Bote war nur bezahlter Handlanger ohne eigene Schuld am Brand.", "OUTCOME_D")
            };
        }

        // ==========================================
        // THE 3 MAIN SUSPECTS (Dossier / Boss-Fights)
        // ==========================================
        static void BuildSuspects(Dictionary<string, object> trees) {
            // 17. Valentin Herold
            trees["interrogate_herold"] = new List<Node> {
                N("start", "Valentin Herold", "assets/suspect_herold.webp",
                  "(Sitzt im Ohrensessel, nippt an einem Cognac, stützt sich auf seinen Gehstock mit Löwenknauf) Ein Schnüffler um diese nachtschlafende Zeit? Wenn Sie antike Hofer Fayencen erwerben wollen, beehren Sie mich morgen zu den Geschäftszeiten. Was wollen Sie?",
                  C("[Subtil] Herr Herold, die Altstadt steht unter Schock. Ein Spaziergänger mit einem markanten Löwen-Gehstock wurde am Brandherd gesehen.", "herold_subtle"),
                  C("[Sachlich] Wo waren Sie zwischen 21:30 und 23:00 Uhr? Ihr Name taucht in den alten Verträgen von 1823 auf.", "herold_direct"),
                  C("[Konfrontativ] Sparen Sie sich das Schauspiel! Ihr Futteral wurde am Bahnhof gesehen. Sie haben das Archiv geplündert!", "herold_aggress")
                ),
                N("herold_subtle", "Valentin Herold", "assets/suspect_herold.webp",
                  "Brandherd? Bedauerlich für die historische Bausubstanz, aber meine Sammlungen ruhen sicher in meinem Gewölbe. Jeder zweite Herr in meinem Alter trägt Spazierstöcke. Das beweist gar nichts.",
                  C("[Subtil] Dr. Renger sprach neulich von alten Urkunden, die Ihren Kunsthandel ruinieren könnten...", "herold_subtle_2"),
                  C("[Beweis vorlegen] Wie erklären Sie sich diese antike Taschenuhr, die Wachmann Rolf von Ihnen erhielt?", "herold_evidence_watch", "beweis_antike_uhr", 0, false, "herold", 20),
                  C("[Widerspruch aufdecken] Vorhin sagten Sie, Sie waren den ganzen Abend im Salon – Rolf bezeugt das Gegenteil!", "herold_contra", null, 0, true)
                ),
                N("herold_direct", "Valentin Herold", "assets/suspect_herold.webp",
                  "Ich? Am Brandherd? Ihr Zeuge muss betrunken gewesen sein. Ich habe den Abend allein bei der Lektüre einer Jean-Paul-Erstausgabe verbracht. Ungestört.",
                  C("[Widerspruch aufdecken] Allein bei der Lektüre? Schwester Maria sah Sie an der Hospitalkirche, Erna im Biengässchen!", "herold_contra", null, 0, true),
                  C("[Beweis vorlegen] Und warum zeigt dieses Polaroid einen Mann mit Ihrem Futteral auf der Flucht?", "herold_evidence_polaroid", "evidence_polaroid_station", 0, false, "herold", 25)
                ),
                N("herold_aggress", "Valentin Herold", "assets/suspect_herold.webp",
                  "Wie können Sie es wagen?! Wenn Sie keine hieb- und stichfesten Beweise haben, lasse ich Sie wegen Verleumdung aus dem Polizeidienst entfernen!",
                  C("[Beweis vorlegen] Hier, dieses Foto vom Bahnhof: Sie auf der Flucht mit der geraubten Brandkassette!", "herold_evidence_polaroid", "evidence_polaroid_station", 0, false, "herold", 25),
                  C("[Beweis vorlegen] Und Wachmann Rolfs Geständnis über Ihre Bestechung!", "herold_evidence_watch", "beweis_antike_uhr", 0, false, "herold", 20),
                  C("[Druck erhöhen] Geben Sie es zu, Herold! Sie haben das Feuer gelegt!", "herold_fail")
                ),
                N("herold_contra", "Valentin Herold", "assets/suspect_herold.webp",
                  "(Er schwitzt merklich, tupft sich die Stirn mit einem Seidentuch ab) Sie... Sie verdrehen meine Worte! Gut, ich war kurz draußen. Um frische Nachtluft zu schnappen! Das ist kein Verbrechen!",
                  C("[Konfrontativ] Um frische Luft zu schnappen bricht man nicht in Kanzleiarchive ein!", "herold_confess_theft"),
                  C("[Sachlich] Haben Sie mit Katharina von Gipser zusammengearbeitet?", "herold_blame_gipser")
                ),
                N("herold_subtle_2", "Valentin Herold", "assets/suspect_herold.webp",
                  "Renger war ein pedantischer Narr! Diese Verträge gehören in die Vitrinen von Liebhabern, nicht in ein feuchtes Kellerarchiv. Aber ich habe das Feuer nicht gelegt!",
                  C("[Sachlich] Wer hat es dann gelegt?", "herold_blame_gipser")
                ),
                N("herold_evidence_watch", "Valentin Herold", "assets/suspect_herold.webp",
                  "(Zuckt zusammen) Die Uhr... Rolf, dieser elende Verräter! Hören Sie... Ja, ich habe ihn bezahlt, um mir Zugang zum Archiv zu verschaffen. Aber als ich ankam, brannte es bereits lichterloh!",
                  C("[Konfrontativ] Sie wollten die Urkunden stehlen!", "herold_confess_theft"),
                  C("[Sachlich] Wer legte das Feuer vor Ihnen?", "herold_blame_heiden")
                ),
                N("herold_evidence_polaroid", "Valentin Herold", "assets/suspect_herold.webp",
                  "(Presst die Lippen zusammen) Verfluchte Reporter... Das beweist gar nichts! Aber gut: Ich war am Rathaus. Ich musste die Dokumente vor den Baggern der Gipser retten!",
                  C("[Konfrontativ] Retten, um sie auf dem Schwarzmarkt zu verkaufen!", "herold_confess_theft"),
                  C("[Sachlich] Was wissen Sie über Gipsers Pläne?", "herold_blame_gipser")
                ),
                N("herold_confess_theft", "Valentin Herold", "assets/suspect_herold.webp",
                  "Kunst muss frei sein! Die Bürokraten hätten alles verrotten lassen. Ja, ich habe die Brandkassette mit den Originalen genommen. Aber ich schwöre bei meiner Familienehre: Ich habe Renger nicht entführt und das Feuer nicht gelegt!",
                  C("[Verhör beenden] Geständnis des Diebstahls und Hehlerei gesichert.", "end_herold_a")
                ),
                N("herold_blame_gipser", "Valentin Herold", "assets/suspect_herold.webp",
                  "Katharina von Gipser! Sie hat Millionen in Bauland am Saaleufer investiert. Die Urkunden hätten ihre Baugenehmigungen vernichtet. Sie hat Renger verschleppen lassen, um ihn zum Schweigen zu bringen!",
                  C("[Sachlich] Und Severin Heiden?", "herold_blame_heiden"),
                  C("[Schlussfolgerung] Gipsers Motiv ist Profitgier.", "end_herold_b", null, 0, false, "gipser", 15)
                ),
                N("herold_blame_heiden", "Valentin Herold", "assets/suspect_herold.webp",
                  "Severin Heiden ist der wahre Wahnsinnige! Er hält sich für den Vollstrecker Gottes. Er hat das Feuer gelegt, um die 'Sünde' zu verbrennen, und Renger in den Kirchturm gesperrt!",
                  C("[Schlussfolgerung] Heiden ist der Brandstifter und Entführer.", "end_herold_b", null, 0, false, "heiden", 20)
                ),
                End("herold_fail", "Valentin Herold", "assets/suspect_herold.webp",
                  "Das reicht! Ich sage kein Wort mehr ohne meinen Anwalt. Verlassen Sie augenblicklich mein Anwesen!", "OUTCOME_C", true),
                End("end_herold_a", "Valentin Herold", "assets/suspect_herold.webp",
                  "Ich gestehe den Diebstahl der Kassette. Hier ist die Kombination für meinen Tresor: 18-23-0. Aber retten Sie Renger vor Heiden!", "OUTCOME_A", false, null, true),
                End("end_herold_b", "Valentin Herold", "assets/suspect_herold.webp",
                  "Nehmen Sie Gipser und Heiden fest. Die beiden zerstören diese Stadt.", "OUTCOME_B"),
                End("end_herold_d", "Valentin Herold", "assets/suspect_herold.webp",
                  "Herold ist vom Vorwurf der Brandstiftung und Entführung entlastet – bleibt aber Hehler.", "OUTCOME_D")
            };

            // 18. Katharina von Gipser
            trees["interrogate_gipser"] = new List<Node> {
                N("start", "Katharina von Gipser", "assets/suspect_gipser.webp",
                  "(Mustert Sie kühl im eleganten Kostüm) Sie haben genau zwei Minuten meiner Zeit. Ich koordiniere gerade ein millionenschweres Investoren-Konsortium für die Saaleufer-Sanierung. Machen Sie es kurz.",
                  C("[Subtil] Ein ehrgeiziges Projekt, Frau Stadträtin. Doch alte Eigentumsrechte aus dem Jahr 1823 hätten dieses Projekt augenblicklich gestoppt.", "gipser_subtle"),
                  C("[Sachlich] Eine schwarze Limousine mit dem Kennzeichen HO-KG 1823 wurde bei der Flucht vom Brandherd gefilmt. Wem gehört dieser Wagen?", "gipser_direct"),
                  C("[Konfrontativ] Sparen Sie sich die Arroganz! Ihre Kurierfahrer haben Akten aus dem Archiv geschmuggelt. Sie haben den Brand in Auftrag gegeben!", "gipser_aggress")
                ),
                N("gipser_subtle", "Katharina von Gipser", "assets/suspect_gipser.webp",
                  "Alte Eigentumsrechte sind irrelevant. Hof braucht Arbeitsplätze, Beton und Fortschritt. Wer sich dem Fortschritt in den Weg stellt, bleibt auf der Strecke.",
                  C("[Sachlich] So wie Dr. Renger auf der Strecke blieb?", "gipser_renger"),
                  C("[Beweis vorlegen] Erklären Sie mir diese brisanten Frachtpapiere mit Ihrem Amtssiegel!", "gipser_evidence_papers", "beweis_frachtpapiere", 0, false, "gipser", 25),
                  C("[Widerspruch aufdecken] Eben sagten Sie, Renger sei irrelevant – nun geben Sie zu, dass er dem Fortschritt im Weg stand?", "gipser_contra", null, 0, true)
                ),
                N("gipser_direct", "Katharina von Gipser", "assets/suspect_gipser.webp",
                  "Mein Chauffeur hatte den Auftrag, Dr. Renger ein großzügiges Angebot für seine Kooperation zu unterbreiten. Als er ankam, war Renger nicht mehr da.",
                  C("[Widerspruch aufdecken] Ihr Chauffeur wollte nur verhandeln? Zeugen sahen, wie er Aktenkisten verladen hat!", "gipser_contra", null, 0, true),
                  C("[Beweis vorlegen] Hier ist das Foto Ihrer Limousine mit Kisten im Kofferraum!", "gipser_evidence_car", "foto_gipser_auto", 0, false, "gipser", 25)
                ),
                N("gipser_aggress", "Katharina von Gipser", "assets/suspect_gipser.webp",
                  "Vorsicht! Meine Anwälte werden Sie in Grund und Boden klagen! Sie haben keinerlei handfeste Beweise gegen eine amtierende Stadträtin!",
                  C("[Beweis vorlegen] Was ist mit dem zerrissenen Drohbrief, den Fischer Jan aus der Saale fischte?", "gipser_evidence_letter", "evidence_torn_letter", 0, false, "gipser", 25),
                  C("[Beweis vorlegen] Und den Frachtpapieren, unterzeichnet von Ihrem Bauamt?", "gipser_evidence_papers", "beweis_frachtpapiere", 0, false, "gipser", 20),
                  C("[Druck erhöhen] Sie wandern heute Nacht in Untersuchungshaft!", "gipser_fail")
                ),
                N("gipser_contra", "Katharina von Gipser", "assets/suspect_gipser.webp",
                  "(Ihre Hände zittern leicht, sie ballt die Fäuste) Renger war unbelehrbar! Ein verstaubter Bürokrat, der sich an zweihundert Jahre alte Klauseln klammerte! Er hätte das gesamte Saaleufer blockiert!",
                  C("[Konfrontativ] Also haben Sie ihn verschleppen lassen!", "gipser_confess_crime"),
                  C("[Sachlich] Wer legte das Feuer im Archiv?", "gipser_blame_others")
                ),
                N("gipser_renger", "Katharina von Gipser", "assets/suspect_gipser.webp",
                  "Renger wurde von Severin Heiden entführt! Der Organist ist ein religiöser Fanatiker. Er erpresste mich mit den Verträgen. Er forderte Geld für seine Kirche!",
                  C("[Sachlich] Und was haben Sie getan?", "gipser_blame_others")
                ),
                N("gipser_evidence_papers", "Katharina von Gipser", "assets/suspect_gipser.webp",
                  "(Wird blass, fängt sich aber sofort) Das sind reine Umzugsformulare... Na schön. Ja, ich wollte die alten Papiere vernichten lassen. Im Schredder. Aber der Brand war Heidens Werk!",
                  C("[Konfrontativ] Sie geben die Urkundenvernichtung zu!", "gipser_confess_crime")
                ),
                N("gipser_evidence_car", "Katharina von Gipser", "assets/suspect_gipser.webp",
                  "Mein Chauffeur handelte auf meine Anweisung. Wir mussten verhindern, dass Herold die Akten ins Ausland verkauft. Aber das Feuer nützte mir nichts – es vernichtete die Baugrund-Nachweise!",
                  C("[Schlussfolgerung] Gipser gesteht die Aktenräumung.", "gipser_confess_crime")
                ),
                N("gipser_evidence_letter", "Katharina von Gipser", "assets/suspect_gipser.webp",
                  "Der Drohbrief... Jan hat ihn gefunden? Verdammt. Ja, ich habe Renger gedroht. Aber ich habe ihn nicht angerührt!",
                  C("[Geständnis sichern] Nötigung und Aktenvernichtung belegt.", "gipser_confess_crime")
                ),
                N("gipser_confess_crime", "Katharina von Gipser", "assets/suspect_gipser.webp",
                  "Ich gestehe die Beseitigung der Dokumente. Die Aktenreste liegen im Schredder in meinem Büro. Wenn Sie das Puzzle zusammensetzen, haben Sie die Beweise. Aber Heiden hat das Feuer gelegt und Renger entführt!",
                  C("[Verhör beenden] Gipsers Schuld vollständig dokumentiert.", "end_gipser_a")
                ),
                N("gipser_blame_others", "Katharina von Gipser", "assets/suspect_gipser.webp",
                  "Nehmen Sie Herold fest, der giert nach Gold. Und stoppen Sie Heiden an St. Michaelis, bevor er den Turm sprengt!",
                  C("[Schlussfolgerung] Heiden ist das ultimative Sicherheitsrisiko.", "end_gipser_b", null, 0, false, "heiden", 20)
                ),
                End("gipser_fail", "Katharina von Gipser", "assets/suspect_gipser.webp",
                  "Ich rufe sofort den Innenminister an! Sie sind suspendiert, Herr Ermittler! Kein Wort mehr!", "OUTCOME_C", true),
                End("end_gipser_a", "Katharina von Gipser", "assets/suspect_gipser.webp",
                  "Hier ist der Schlüssel zu meinem Büro. Das Schredder-Puzzle enthüllt den Pakt. Retten Sie Renger vor Heiden!", "OUTCOME_A", false, null, true),
                End("end_gipser_b", "Katharina von Gipser", "assets/suspect_gipser.webp",
                  "Ich werde mich vor Gericht verantworten. Aber Heiden muss gestoppt werden.", "OUTCOME_B"),
                End("end_gipser_d", "Katharina von Gipser", "assets/suspect_gipser.webp",
                  "Gipser gesteht Urkundenunterdrückung, ist aber vom Vorwurf der Brandstiftung entlastet.", "OUTCOME_D")
            };

            // 19. Severin Heiden
            trees["interrogate_heiden"] = new List<Node> {
                N("start", "Severin Heiden", "assets/suspect_heiden.webp",
                  "(Steht am Orgel-Spieltisch von St. Michaelis, dreht sich langsam mit glühenden Augen um) Sie wandeln in der Finsternis, Suchender. Hören Sie, wie das Holz knarrt? Die Sünde von 1823 lastet auf diesem Boden. Was wollen Sie vor dem Angesicht des Herrn?",
                  C("[Subtil] Herr Heiden, die Musik von Johann Sebastian Bach spricht von Gnade, nicht von Zerstörung. Warum sprechen Sie von Feuer und Strafe?", "heiden_subtle"),
                  C("[Sachlich] Am Tatort wurde ein rußiges Notenblatt mit der Tonfolge B-A-C-H gefunden. Es trägt Ihre Handschrift.", "heiden_direct"),
                  C("[Konfrontativ] Sie haben Dr. Renger entführt und im Turm eingesperrt! Öffnen Sie den Turm, bevor es zu spät ist!", "heiden_aggress")
                ),
                N("heiden_subtle", "Severin Heiden", "assets/suspect_heiden.webp",
                  "Gnade gibt es nur für die Reinen! Der Pakt der Schlappen-Erben war ein teuflischer Verrat. Die Gründerväter schworen, Hof im Glauben zu einen – stattdessen wählten sie Gold und Gier. Das Feuer muss reinigen!",
                  C("[Sachlich] Welche Reinigung meinen Sie?", "heiden_cleanse"),
                  C("[Beweis vorlegen] Diese Chor-Notiz beweist, dass Sie den Brand minutiös geplant haben!", "heiden_evidence_choir", "beweis_chorknaben_notiz", 0, false, "heiden", 25),
                  C("[Widerspruch aufdecken] Mesnerin Gertrud bezeugt, dass Sie um 21:35 Uhr die Kirche mit Petroleum verließen!", "heiden_contra", null, 0, true)
                ),
                N("heiden_direct", "Severin Heiden", "assets/suspect_heiden.webp",
                  "Die Tonfolge B-A-C-H ist der göttliche Schlüssel! Vier Töne, vier Siegel, vier Zeitalter! Das Notenblatt war mein Urteil über das sündige Archiv!",
                  C("[Widerspruch aufdecken] Karl sah Sie um 22:15 Uhr am Sonnenplatz mit rußigen Händen – Sie leugnen nicht mehr?", "heiden_contra", null, 0, true),
                  C("[Beweis vorlegen] Hier ist das gerettete Notenblatt aus dem Ruß!", "heiden_evidence_sheet", "notenblatt_heiden", 0, false, "heiden", 25)
                ),
                N("heiden_aggress", "Severin Heiden", "assets/suspect_heiden.webp",
                  "Eingesperrt?! Ich habe ihn vor den Wölfen gerettet! Gipser wollte ihn töten, Herold wollte ihn berauben! Ich habe ihn an den Altar des Höchsten gebracht!",
                  C("[Beweis vorlegen] Renger schwebt in Lebensgefahr! Sehen Sie dieses Abhörprotokoll!", "heiden_evidence_wiretap", "evidence_wiretap_log", 0, false, "heiden", 20),
                  C("[Druck erhöhen] Geben Sie auf, Heiden! Die Polizei umstellt die Kirche!", "heiden_fail")
                ),
                N("heiden_contra", "Severin Heiden", "assets/suspect_heiden.webp",
                  "(Lacht hysterisch auf, das Lachen hallt im Kirchenschiff wider) Glauben Sie, irdische Gesetze kümmern mich noch?! Ja! Ich habe das Feuer im Gewölbe gelegt! Das gereinigte Feuer von 1823!",
                  C("[Konfrontativ] Sie gestehen die Brandstiftung!", "heiden_confess_all"),
                  C("[Sachlich] Wo ist Dr. Renger?!", "heiden_renger_loc")
                ),
                N("heiden_cleanse", "Severin Heiden", "assets/suspect_heiden.webp",
                  "Die Verträge müssen vergehen, damit die Stadt neu ersteht. Renger weigerte sich, die Urkunden dem Feuer zu übergeben. Er wollte sie publizieren! Der Narr verstand die Heiligkeit des Geheimnisses nicht!",
                  C("[Konfrontativ] Deshalb haben Sie ihn gefesselt!", "heiden_confess_all")
                ),
                N("heiden_evidence_choir", "Severin Heiden", "assets/suspect_heiden.webp",
                  "Meine Chor-Notiz... ja. Ich habe die Flammen nach dem Takt der Passion dirigiert. Hof sollte brennen wie vor zweihundert Jahren!",
                  C("[Vollgeständnis festhalten] Geständnis der Brandstiftung.", "heiden_confess_all")
                ),
                N("heiden_evidence_sheet", "Severin Heiden", "assets/suspect_heiden.webp",
                  "Das Notenblatt aus der Asche! Sie haben es gerettet?! Dann ist der Pakt vollendet. Der Turm öffnet sich nur dem, der die Orgel mit den Tönen B-A-C-H bespielt!",
                  C("[Orgel-Herausforderung annehmen] Der Code zum Turm.", "end_heiden_a")
                ),
                N("heiden_evidence_wiretap", "Severin Heiden", "assets/suspect_heiden.webp",
                  "Das Abhörprotokoll... Sie wissen alles. Es ist vollbracht. Die Sünde ist offenbar.",
                  C("[Kapitulation erzwingen] Heiden bricht zusammen.", "end_heiden_a")
                ),
                N("heiden_renger_loc", "Severin Heiden", "assets/suspect_heiden.webp",
                  "Er ist oben im Südturm! Die Tür ist verriegelt durch das Orgel-Kryptex. Spielen Sie B-A-C-H auf den Pfeifen, und die Pforte weicht!",
                  C("[Zum Finale antreten] Ich werde Renger befreien.", "end_heiden_a")
                ),
                N("heiden_confess_all", "Severin Heiden", "assets/suspect_heiden.webp",
                  "Ich bekenne mich schuldig vor Gott und den Menschen! Ich legte das Feuer, ich entführte Renger, ich hütete den Pakt! Bringen Sie mich vor das Gericht, aber hören Sie vorher die Orgel!",
                  C("[Verhör beenden] Volles Geständnis des Haupttäters gesichert.", "end_heiden_a")
                ),
                End("heiden_fail", "Severin Heiden", "assets/suspect_heiden.webp",
                  "(Verfällt in lautes lateinisches Gebet, schlägt wild auf die Orgeltasten ein und reagiert auf kein Wort mehr)", "OUTCOME_C", true),
                End("end_heiden_a", "Severin Heiden", "assets/suspect_heiden.webp",
                  "Das Kryptex an der Orgel ist aktiv. Spielen Sie B-A-C-H, um Dr. Renger im Südturm zu befreien!", "OUTCOME_A", false, null, true),
                End("end_heiden_b", "Severin Heiden", "assets/suspect_heiden.webp",
                  "Der Herr sei seiner Seele gnädig. Ich habe meine Pflicht getan.", "OUTCOME_B"),
                End("end_heiden_d", "Severin Heiden", "assets/suspect_heiden.webp",
                  "Heiden handelte im religiösen Wahn ohne Geldgier.", "OUTCOME_D")
            };
        }
    }
}
