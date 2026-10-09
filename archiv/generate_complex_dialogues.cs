using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

public class GenerateComplexDialogues {
    public static void Run() {
        string path = @"c:\Users\flaem\Desktop\Krimi\data\story.json";
        string text = File.ReadAllText(path, Encoding.UTF8);

        // Define complex dialogues
        string heroldComplex = @"
      ""interrogate_herold"": [
        {
          ""id"": ""start"",
          ""speaker"": ""Valentin Herold"",
          ""avatar"": ""assets/suspect_herold.webp"",
          ""text"": ""Ein Schnüffler um diese nachtschlafende Zeit? Wenn Sie antike Hofer Fayencen erwerben möchten, beehren Sie mich morgen zu den Geschäftszeiten. Was wollen Sie?"",
          ""choices"": [
            { ""text"": ""[Subtil] Herr Herold, die Altstadt ist heute sehr unruhig. Haben Sie etwas vom Feuer am Rathaus mitbekommen?"", ""next"": ""h_subtle_1"", ""impact"": {""suspect"": ""herold"", ""value"": 2} },
            { ""text"": ""[Direkt] Wo waren Sie in der letzten Stunde? Ein Zeuge hat Sie in Rathausnähe gesehen."", ""next"": ""h_direct_1"", ""impact"": {""suspect"": ""herold"", ""value"": 5} },
            { ""text"": ""[Aggressiv] Sparen Sie sich das Schauspiel! Sie haben das Archiv angezündet, um Ihre Spuren zu verwischen!"", ""next"": ""h_aggress_1"", ""impact"": {""suspect"": ""herold"", ""value"": 10} }
          ]
        },
        {
          ""id"": ""h_subtle_1"",
          ""speaker"": ""Valentin Herold"",
          ""avatar"": ""assets/suspect_herold.webp"",
          ""text"": ""Feuer? Bedauerlich für die historische Substanz, aber meine Sammlungen ruhen sicher in meinem Gewölbe. Mehr weiß ich nicht."",
          ""choices"": [
            { ""text"": ""[Subtil] Dr. Renger sprach neulich von alten Verträgen, die Ihren Kunsthandel ruinieren könnten..."", ""next"": ""h_subtle_2"", ""impact"": {""suspect"": ""herold"", ""value"": 5} },
            { ""text"": ""[Beweis vorlegen] Wie erklären Sie sich dann diese antike Taschenuhr, die beim Wachmann gefunden wurde?"", ""requiresItem"": ""beweis_antike_uhr"", ""next"": ""h_evidence_1"", ""impact"": {""suspect"": ""herold"", ""value"": 20} },
            { ""text"": ""[Direkt] Sie weichen aus. Es geht hier um Brandstiftung und Entführung!"", ""next"": ""h_direct_2"", ""impact"": {""suspect"": ""herold"", ""value"": 5} }
          ]
        },
        {
          ""id"": ""h_direct_1"",
          ""speaker"": ""Valentin Herold"",
          ""avatar"": ""assets/suspect_herold.webp"",
          ""text"": ""Ich? In Rathausnähe? Ihr Zeuge muss betrunken gewesen sein. Ich habe den Abend beim Lesen einer Erstausgabe von Jean Paul verbracht. Alleine."",
          ""choices"": [
            { ""text"": ""[Subtil] Komisch, vorhin sagten Sie noch, Sie wären im Gasthaus am Sonnenplatz gewesen..."", ""next"": ""h_lie_caught"", ""impact"": {""suspect"": ""herold"", ""value"": 15} },
            { ""text"": ""[Beweis vorlegen] Und warum zeigt dieses unscharfe Polaroid einen Mann mit Ihrem ledernen Futteral auf der Flucht?"", ""requiresItem"": ""evidence_polaroid_station"", ""next"": ""h_evidence_2"", ""impact"": {""suspect"": ""herold"", ""value"": 25} }
          ]
        },
        {
          ""id"": ""h_aggress_1"",
          ""speaker"": ""Valentin Herold"",
          ""avatar"": ""assets/suspect_herold.webp"",
          ""text"": ""Wie können Sie es wagen?! Wenn Sie keine hieb- und stichfesten Beweise haben, lasse ich Sie wegen Verleumdung einsperren!"",
          ""choices"": [
            { ""text"": ""[Beweis vorlegen] Hier, dieses Polaroid vom Bahnhof. Sie auf der Flucht mit einem Futteral!"", ""requiresItem"": ""evidence_polaroid_station"", ""next"": ""h_evidence_2"", ""impact"": {""suspect"": ""herold"", ""value"": 25} },
            { ""text"": ""[Einlenken] Entschuldigen Sie, die Nerven liegen blank. Lassen Sie uns sachlich reden."", ""next"": ""h_subtle_1"", ""impact"": {""suspect"": ""herold"", ""value"": -5} },
            { ""text"": ""Dann sehen wir uns eben vor Gericht, Herold."", ""isEnd"": true }
          ]
        },
        {
          ""id"": ""h_lie_caught"",
          ""speaker"": ""Valentin Herold"",
          ""avatar"": ""assets/suspect_herold.webp"",
          ""text"": ""(Er schwitzt leicht) Sie verdrehen meine Worte! Gut, ich war kurz draußen. Aber nur um frische Luft zu schnappen!"",
          ""choices"": [
            { ""text"": ""[Aggressiv] Geben Sie es auf. Sie wollten die Akten des Schlappen-Pakts vor Gipser retten, oder?"", ""next"": ""h_confess_1"", ""impact"": {""suspect"": ""herold"", ""value"": 15} },
            { ""text"": ""[Direkt] Frau von Gipser profitiert am meisten. Arbeiten Sie zusammen?"", ""next"": ""h_blame_gipser"", ""impact"": {""suspect"": ""gipser"", ""value"": 10} }
          ]
        },
        {
          ""id"": ""h_evidence_1"",
          ""speaker"": ""Valentin Herold"",
          ""avatar"": ""assets/suspect_herold.webp"",
          ""text"": ""Das... das ist ein Erbstück meiner Familie! Wie kommen Sie daran?! Rolf hat sie mir gestern gestohlen! Ein elender Dieb!"",
          ""choices"": [
            { ""text"": ""[Direkt] Oder es war ein Bestechungsgeld, damit er wegsieht?"", ""next"": ""h_confess_1"", ""impact"": {""suspect"": ""herold"", ""value"": 15} }
          ]
        },
        {
          ""id"": ""h_evidence_2"",
          ""speaker"": ""Valentin Herold"",
          ""avatar"": ""assets/suspect_herold.webp"",
          ""text"": ""Das beweist gar nichts! Jeder trägt nachts dunkle Mäntel. Aber... gut. Ja, ich war am Rathaus. Ich musste Dr. Rengers Dokumente vor den Baggern der Gipser retten!"",
          ""choices"": [
            { ""text"": ""[Aggressiv] Retten? Um sie an dubiose Sammler zu verscherbeln!"", ""next"": ""h_confess_2"", ""impact"": {""suspect"": ""herold"", ""value"": 15} },
            { ""text"": ""[Subtil] Dann haben Sie das Feuer nicht gelegt? Wer dann?"", ""next"": ""h_blame_gipser"", ""impact"": {""suspect"": ""gipser"", ""value"": 10} }
          ]
        },
        {
          ""id"": ""h_blame_gipser"",
          ""speaker"": ""Valentin Herold"",
          ""avatar"": ""assets/suspect_herold.webp"",
          ""text"": ""Gipser hat Millionen in Bauland am Saaleufer gesteckt. Hätte Renger die alten Urkunden publiziert, wären ihre Genehmigungen Makulatur gewesen. Sie schreckt vor nichts zurück."",
          ""choices"": [
            { ""text"": ""[Direkt] Und Heiden? Hat der Orgelspieler ein Motiv?"", ""next"": ""h_blame_heiden"", ""impact"": {""suspect"": ""heiden"", ""value"": 10} },
            { ""text"": ""Ich werde Gipser befragen."", ""isEnd"": true }
          ]
        },
        {
          ""id"": ""h_blame_heiden"",
          ""speaker"": ""Valentin Herold"",
          ""avatar"": ""assets/suspect_herold.webp"",
          ""text"": ""Severin Heiden hält sich für den letzten wahren Blutsnachfahren der Gründerväter. Er verbringt die Nächte an den Orgeln und schwört Rache an jedem, der den Pakt entweiht."",
          ""choices"": [
            { ""text"": ""Danke für die Auskunft. Bleiben Sie in der Stadt."", ""isEnd"": true }
          ]
        },
        {
          ""id"": ""h_confess_1"",
          ""speaker"": ""Valentin Herold"",
          ""avatar"": ""assets/suspect_herold.webp"",
          ""text"": ""(Eingeschüchtert) Hören Sie... Der Pakt der Schlappen-Erben ist zu wertvoll für ein staubiges Archiv. Er gehört in die Hände von Liebhabern. Aber ich schwöre bei meinem Leben: Ich habe das Feuer nicht gelegt und Renger nicht entführt!"",
          ""choices"": [
            { ""text"": ""Wer hat es dann getan?"", ""next"": ""h_blame_gipser"", ""impact"": {""suspect"": ""herold"", ""value"": -5} }
          ]
        },
        {
          ""id"": ""h_confess_2"",
          ""speaker"": ""Valentin Herold"",
          ""avatar"": ""assets/suspect_herold.webp"",
          ""text"": ""(Verzweifelt) Kunst muss frei sein! Die Bürokraten hätten alles im Archiv verrotten lassen. Aber als ich am Rathaus ankam, brannte es bereits lichterloh. Ich nahm, was ich tragen konnte, und rannte."",
          ""choices"": [
            { ""text"": ""Ich werde Ihre Aussage überprüfen. Wagen Sie nicht, die Stadt zu verlassen."", ""isEnd"": true }
          ]
        }
      ],
      ""interrogate_gipser"": [
        {
          ""id"": ""start"",
          ""speaker"": ""Katharina von Gipser"",
          ""avatar"": ""assets/suspect_gipser.webp"",
          ""text"": ""Sie haben genau zwei Minuten meiner wertvollen Zeit. Ich bereite gerade das größte Immobilien-Portfolio der Hofer Geschichte vor. Machen Sie es kurz."",
          ""choices"": [
            { ""text"": ""[Subtil] Ein Portfolio am Saaleufer? Ein mutiger Schritt, wenn man die alten Eigentumsverhältnisse bedenkt."", ""next"": ""g_subtle_1"", ""impact"": {""suspect"": ""gipser"", ""value"": 5} },
            { ""text"": ""[Direkt] Frau von Gipser, das Stadtarchiv brennt. Und Dr. Renger ist verschwunden."", ""next"": ""g_direct_1"", ""impact"": {""suspect"": ""gipser"", ""value"": 2} },
            { ""text"": ""[Aggressiv] Sie haben Renger aus dem Weg räumen lassen, um Ihre illegalen Bauprojekte zu schützen!"", ""next"": ""g_aggress_1"", ""impact"": {""suspect"": ""gipser"", ""value"": 10} }
          ]
        },
        {
          ""id"": ""g_subtle_1"",
          ""speaker"": ""Katharina von Gipser"",
          ""avatar"": ""assets/suspect_gipser.webp"",
          ""text"": ""(Ihre Augen verengen sich) Alte Eigentumsverhältnisse sind irrelevant. Die Stadt braucht Fortschritt. Wer sich dem Fortschritt in den Weg stellt, bleibt auf der Strecke."",
          ""choices"": [
            { ""text"": ""[Direkt] So wie Dr. Renger auf der Strecke blieb?"", ""next"": ""g_direct_1"", ""impact"": {""suspect"": ""gipser"", ""value"": 5} },
            { ""text"": ""[Beweis vorlegen] Dann erklären Sie mir diese brisanten Frachtpapiere mit Ihrem Siegel!"", ""requiresItem"": ""beweis_frachtpapiere"", ""next"": ""g_evidence_1"", ""impact"": {""suspect"": ""gipser"", ""value"": 25} }
          ]
        },
        {
          ""id"": ""g_direct_1"",
          ""speaker"": ""Katharina von Gipser"",
          ""avatar"": ""assets/suspect_gipser.webp"",
          ""text"": ""Tragisch. Alte Gebäude sind ein Sicherheitsrisiko. Ich habe dem Stadtrat ohnehin geraten, das marode Rathaus-Gewölbe räumen zu lassen. Das Problem hat sich nun offenbar selbst gelöst."",
          ""choices"": [
            { ""text"": ""[Subtil] Sehr bequem für Sie. Jemand hat behauptet, Sie hätten Schlägertrupps engagiert."", ""next"": ""g_blame_herold"", ""impact"": {""suspect"": ""gipser"", ""value"": 10} },
            { ""text"": ""[Aggressiv] Sie geben also zu, dass Ihnen der Brand nützt!"", ""next"": ""g_aggress_2"", ""impact"": {""suspect"": ""gipser"", ""value"": 15} }
          ]
        },
        {
          ""id"": ""g_aggress_1"",
          ""speaker"": ""Katharina von Gipser"",
          ""avatar"": ""assets/suspect_gipser.webp"",
          ""text"": ""Vorsicht! Meine Anwälte werden Sie in Grund und Boden klagen, wenn Sie solche absurden Behauptungen äußern. Sie haben keinerlei Beweise!"",
          ""choices"": [
            { ""text"": ""[Beweis vorlegen] Was ist mit dem Foto Ihrer schwarzen Limousine am Tatort?"", ""requiresItem"": ""foto_gipser_auto"", ""next"": ""g_evidence_2"", ""impact"": {""suspect"": ""gipser"", ""value"": 25} },
            { ""text"": ""[Einlenken] Gut, vielleicht war ich zu vorschnell. Aber wer könnte es gewesen sein?"", ""next"": ""g_blame_herold"", ""impact"": {""suspect"": ""gipser"", ""value"": -5} }
          ]
        },
        {
          ""id"": ""g_aggress_2"",
          ""speaker"": ""Katharina von Gipser"",
          ""avatar"": ""assets/suspect_gipser.webp"",
          ""text"": ""Es nützt der ganzen Stadt! Endlich können wir moderne Komplexe bauen, statt in der Vergangenheit zu leben. Das macht mich aber nicht zur Brandstifterin!"",
          ""choices"": [
            { ""text"": ""[Direkt] Wer hätte sonst ein Motiv?"", ""next"": ""g_blame_herold"", ""impact"": {""suspect"": ""herold"", ""value"": 5} }
          ]
        },
        {
          ""id"": ""g_evidence_1"",
          ""speaker"": ""Katharina von Gipser"",
          ""avatar"": ""assets/suspect_gipser.webp"",
          ""text"": ""(Sie wird bleich, fängt sich aber sofort) Das sind Standard-Umzugsformulare! Ich wollte die alten Papiere legal in ein Außenlager verlegen lassen. Zu meinem Schutz!"",
          ""choices"": [
            { ""text"": ""[Aggressiv] Legal? Das war eine geheime Entsorgungsaktion!"", ""next"": ""g_confess_1"", ""impact"": {""suspect"": ""gipser"", ""value"": 15} }
          ]
        },
        {
          ""id"": ""g_evidence_2"",
          ""speaker"": ""Katharina von Gipser"",
          ""avatar"": ""assets/suspect_gipser.webp"",
          ""text"": ""(Sie presst die Lippen zusammen) Mein Chauffeur hat Renger lediglich einen Hausbesuch abgestattet. Um ihm ein Angebot zu machen, das er nicht ablehnen konnte. Aber er war nicht zuhause!"",
          ""choices"": [
            { ""text"": ""[Subtil] Oder Ihr Chauffeur hat das Problem 'permanent' gelöst?"", ""next"": ""g_confess_1"", ""impact"": {""suspect"": ""gipser"", ""value"": 15} }
          ]
        },
        {
          ""id"": ""g_blame_herold"",
          ""speaker"": ""Katharina von Gipser"",
          ""avatar"": ""assets/suspect_gipser.webp"",
          ""text"": ""Wenn Sie einen Schuldigen suchen, nehmen Sie Herold ins Visier. Der giert nach den alten Relikten. Und unterschätzen Sie diesen Heiden nicht. Der Organist ist ein Wahnsinniger."",
          ""choices"": [
            { ""text"": ""Ich werde beide im Auge behalten."", ""isEnd"": true }
          ]
        },
        {
          ""id"": ""g_confess_1"",
          ""speaker"": ""Katharina von Gipser"",
          ""avatar"": ""assets/suspect_gipser.webp"",
          ""text"": ""(Leise) Na schön. Ich wollte Renger einschüchtern. Ich habe meine Leute hingeschickt, um die Akten zu 'bereinigen'. Aber als sie ankamen, war das Gewölbe bereits aufgebrochen und Renger weg. Jemand ist mir zuvorgekommen."",
          ""choices"": [
            { ""text"": ""Wer könnte Ihnen zuvorgekommen sein?"", ""next"": ""g_blame_herold"", ""impact"": {""suspect"": ""gipser"", ""value"": 0} },
            { ""text"": ""Das glaube ich Ihnen nicht. Wir sind hier fertig."", ""isEnd"": true }
          ]
        }
      ],
      ""interrogate_heiden"": [
        {
          ""id"": ""start"",
          ""speaker"": ""Severin Heiden"",
          ""avatar"": ""assets/suspect_heiden.webp"",
          ""text"": ""(Er blickt starr auf die Orgel) Die Flammen sind ein Zeichen. Das Vermächtnis von 1823 fordert seinen Tribut. Treten Sie nicht näher, Ungläubiger."",
          ""choices"": [
            { ""text"": ""[Subtil] Ein Zeichen? Meinen Sie damit den Brand im Rathaus?"", ""next"": ""hei_subtle_1"", ""impact"": {""suspect"": ""heiden"", ""value"": 5} },
            { ""text"": ""[Direkt] Herr Heiden, wo haben Sie Dr. Renger versteckt?"", ""next"": ""hei_direct_1"", ""impact"": {""suspect"": ""heiden"", ""value"": 10} },
            { ""text"": ""[Aggressiv] Sie fanatischer Irrer haben das Feuer gelegt und den Archivar entführt!"", ""next"": ""hei_aggress_1"", ""impact"": {""suspect"": ""heiden"", ""value"": 15} }
          ]
        },
        {
          ""id"": ""hei_subtle_1"",
          ""speaker"": ""Severin Heiden"",
          ""avatar"": ""assets/suspect_heiden.webp"",
          ""text"": ""Dr. Renger wagte es, die heiligen Siegel zu brechen! Die Geheimnisse der Schlappen-Erben sind nicht für die profanen Augen der Öffentlichkeit bestimmt!"",
          ""choices"": [
            { ""text"": ""[Direkt] Deshalb haben Sie ihn zum Schweigen gebracht?"", ""next"": ""hei_direct_1"", ""impact"": {""suspect"": ""heiden"", ""value"": 10} },
            { ""text"": ""[Beweis vorlegen] Ich habe Ihre Notizen gefunden. Dieses Notenblatt spricht Bände."", ""requiresItem"": ""notenblatt_heiden"", ""next"": ""hei_evidence_1"", ""impact"": {""suspect"": ""heiden"", ""value"": 25} }
          ]
        },
        {
          ""id"": ""hei_direct_1"",
          ""speaker"": ""Severin Heiden"",
          ""avatar"": ""assets/suspect_heiden.webp"",
          ""text"": ""Ich verberge nichts. Ich bin der Wächter! Die wahre Schuld tragen die Gierschlunde, die aus Hof einen Parkplatz machen wollen. Gipser und Konsorten!"",
          ""choices"": [
            { ""text"": ""[Subtil] Dann schützen Sie Renger also vor Gipser?"", ""next"": ""hei_subtle_2"", ""impact"": {""suspect"": ""heiden"", ""value"": -5} },
            { ""text"": ""[Beweis vorlegen] Dieses Chiffrierpapier beweist, dass Sie den Pakt manipulieren!"", ""requiresItem"": ""evidence_cipher_paper"", ""next"": ""hei_evidence_2"", ""impact"": {""suspect"": ""heiden"", ""value"": 20} }
          ]
        },
        {
          ""id"": ""hei_aggress_1"",
          ""speaker"": ""Severin Heiden"",
          ""avatar"": ""assets/suspect_heiden.webp"",
          ""text"": ""(Er schreit auf) Gotteslästerung! Ich bewahre das Feuer der Tradition! Ein Irrer ist der, der die Relikte des Paktes an Höchstbietende verkauft. So wie Herold!"",
          ""choices"": [
            { ""text"": ""[Direkt] Herold verkauft Antiquitäten. Sie entführen Menschen."", ""next"": ""hei_direct_1"", ""impact"": {""suspect"": ""heiden"", ""value"": 5} },
            { ""text"": ""[Beweis vorlegen] Erklären Sie mir dieses rußige Notenblatt. Es lag am Tatort!"", ""requiresItem"": ""notenblatt_heiden"", ""next"": ""hei_evidence_1"", ""impact"": {""suspect"": ""heiden"", ""value"": 25} }
          ]
        },
        {
          ""id"": ""hei_subtle_2"",
          ""speaker"": ""Severin Heiden"",
          ""avatar"": ""assets/suspect_heiden.webp"",
          ""text"": ""Ich schütze das Erbe! Aber Renger... Renger hat uns alle verraten. Er wollte die Schande öffentlich machen."",
          ""choices"": [
            { ""text"": ""Welche Schande? Den Pakt?"", ""next"": ""hei_confess_1"", ""impact"": {""suspect"": ""heiden"", ""value"": 10} }
          ]
        },
        {
          ""id"": ""hei_evidence_1"",
          ""speaker"": ""Severin Heiden"",
          ""avatar"": ""assets/suspect_heiden.webp"",
          ""text"": ""(Er bricht zusammen) Mein Choral! Ja... ich war dort. Ich wollte Renger anflehen, das Geheimnis der Bruderschaft zu bewahren. Er wollte nicht hören."",
          ""choices"": [
            { ""text"": ""[Aggressiv] Also haben Sie ihn niedergeschlagen und das Feuer entfacht!"", ""next"": ""hei_confess_1"", ""impact"": {""suspect"": ""heiden"", ""value"": 15} }
          ]
        },
        {
          ""id"": ""hei_evidence_2"",
          ""speaker"": ""Severin Heiden"",
          ""avatar"": ""assets/suspect_heiden.webp"",
          ""text"": ""Das sind die heiligen Schriften der Erben! Woher haben Sie das?! Die Bruderschaft wird Sie dafür bestrafen!"",
          ""choices"": [
            { ""text"": ""[Direkt] Es gibt keine Bruderschaft mehr. Nur Sie, Heiden."", ""next"": ""hei_confess_1"", ""impact"": {""suspect"": ""heiden"", ""value"": 10} }
          ]
        },
        {
          ""id"": ""hei_confess_1"",
          ""speaker"": ""Severin Heiden"",
          ""avatar"": ""assets/suspect_heiden.webp"",
          ""text"": ""Vielleicht haben Sie Recht. Ich bin der Letzte. Aber als ich ins Gewölbe kam, stank es bereits nach Benzin. Ein Schatten floh in die Dunkelheit, und die Akten brannten bereits."",
          ""choices"": [
            { ""text"": ""Ein Schatten? Konnten Sie ihn erkennen?"", ""next"": ""hei_blame_others"", ""impact"": {""suspect"": ""heiden"", ""value"": -5} },
            { ""text"": ""Ich glaube Ihnen kein Wort."", ""isEnd"": true }
          ]
        },
        {
          ""id"": ""hei_blame_others"",
          ""speaker"": ""Severin Heiden"",
          ""avatar"": ""assets/suspect_heiden.webp"",
          ""text"": ""Nein... aber das Lederfutteral... es sah aus wie eines von Herold. Oder war es der Chauffeur von Gipser? Alles ist im Rauch verschwunden. Der Pakt ist verloren."",
          ""choices"": [
            { ""text"": ""Bleiben Sie hier. Wir sind noch nicht fertig."", ""isEnd"": true }
          ]
        }
      ]
";

        // We replace the old interrogate blocks using a robust regex.
        // Match from "interrogate_herold": [ ... up to the end of interrogate_heiden's array ],
        
        string pattern = @"""interrogate_herold""\s*:\s*\[.*?\]\s*,\s*""interrogate_gipser""\s*:\s*\[.*?\]\s*,\s*""interrogate_heiden""\s*:\s*\[.*?\]";
        string replacement = heroldComplex.Trim();

        // The old file might have newlines or different spacing. RegexOptions.Singleline allows .*? to match across newlines
        string result = Regex.Replace(text, pattern, replacement, RegexOptions.Singleline);
        
        if (text == result) {
            Console.WriteLine("Could not find the target block to replace.");
            return;
        }

        File.WriteAllText(path, result, new UTF8Encoding(false));
        Console.WriteLine("Complex dialogues updated successfully.");
    }
}
