using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

public class ExpandWitnessDialogues {
    public static void Run() {
        string path = @"c:\Users\flaem\Desktop\Krimi\data\story.json";
        string text = File.ReadAllText(path, Encoding.UTF8);

        // Define complex dialogues for witnesses
        string witnessesComplex = @"
      ""ludwig_rolf_rolf"": [
        {
          ""id"": ""start"",
          ""speaker"": ""Wachmann Rolf"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""Was suchen Sie hier? Das Kanzleiarchiv ist strengstens abgeriegelt. In der Brandnacht war hier niemand, darauf gebe ich mein Wort!"",
          ""choices"": [
            { ""text"": ""[Subtil] Ein Wachmann hat ein hartes Leben. War die Nachtschicht anstrengend?"", ""next"": ""rolf_subtle"" },
            { ""text"": ""[Direkt] Wirklich niemand? Zeugen berichten von einem Fluchtauto."", ""next"": ""rolf_direct"" },
            { ""text"": ""[Aggressiv] Sie lügen! Wenn Sie das Archiv nicht geschützt haben, sind Sie mitschuldig!"", ""next"": ""rolf_aggress"" }
          ]
        },
        {
          ""id"": ""rolf_subtle"",
          ""speaker"": ""Wachmann Rolf"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""Anstrengend? Eher ruhig... bis zu dem Feueralarm. Ich war gerade... äh, auf einem Kontrollgang auf der anderen Seite des Geländes."",
          ""choices"": [
            { ""text"": ""[Direkt] Auf der anderen Seite? So weit weg, dass Sie die Flammen nicht rochen?"", ""next"": ""rolf_direct"" },
            { ""text"": ""[Beweis vorlegen] Was ist das für eine teure, antike Uhr an Ihrem Handgelenk? Hat man Sie bezahlt?"", ""requiresItem"": ""beweis_antike_uhr"", ""next"": ""rolf_evidence"" }
          ]
        },
        {
          ""id"": ""rolf_direct"",
          ""speaker"": ""Wachmann Rolf"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""Ich... ich kann nicht überall gleichzeitig sein! Da war ein Wagen, ja. Eine dunkle Limousine. Aber ich konnte das Kennzeichen nicht sehen!"",
          ""choices"": [
            { ""text"": ""[Beweis vorlegen] Eine dunkle Limousine wie auf diesem Foto? Das Auto von Frau von Gipser?"", ""requiresItem"": ""foto_gipser_auto"", ""next"": ""rolf_evidence2"" },
            { ""text"": ""Sie verdecken etwas. Aber ich finde die Wahrheit schon heraus."", ""isEnd"": true }
          ]
        },
        {
          ""id"": ""rolf_aggress"",
          ""speaker"": ""Wachmann Rolf"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""(Erschrocken) Mitschuldig? Nein! Ich schwöre, ich habe das Feuer nicht gelegt! Ich habe nur... weggesehen. Für einen Moment!"",
          ""choices"": [
            { ""text"": ""Wer hat Sie dafür bezahlt wegzusehen? Herold?"", ""next"": ""rolf_confess"" }
          ]
        },
        {
          ""id"": ""rolf_evidence"",
          ""speaker"": ""Wachmann Rolf"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""(Schluckt) Die Uhr? Das... das war ein Geschenk. Herr Herold war so freundlich. Er sagte, er müsse nur kurz etwas aus dem Archiv holen..."",
          ""choices"": [
            { ""text"": ""Und danach brannte es lichterloh! Danke, das reicht."", ""isEnd"": true }
          ]
        },
        {
          ""id"": ""rolf_evidence2"",
          ""speaker"": ""Wachmann Rolf"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""(Zittert) Ja! Das ist der Wagen! Die Leute von Frau von Gipser... Sie sagten, wenn ich Ärger mache, verschwinde ich genau wie Dr. Renger!"",
          ""choices"": [
            { ""text"": ""Sie sind in Sicherheit, wenn Sie aussagen."", ""isEnd"": true }
          ]
        },
        {
          ""id"": ""rolf_confess"",
          ""speaker"": ""Wachmann Rolf"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""Es... es war dunkel. Jemand gab mir eine antike Uhr. Ich sollte einfach für eine Stunde verschwinden. Ich wusste nicht, dass sie Feuer legen!"",
          ""choices"": [
            { ""text"": ""Bleiben Sie hier. Sie sind ein wichtiger Zeuge."", ""isEnd"": true }
          ]
        }
      ],
      ""post_kurier_sepp"": [
        {
          ""id"": ""start"",
          ""speaker"": ""Kurier Sepp"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""Habe heute keine Zeit zum Quatschen. Muss die Fracht zum Hafen bringen, Auftrag vom Stadtrat! Machen Sie Platz!"",
          ""choices"": [
            { ""text"": ""[Subtil] Ein wichtiger Auftrag vom Stadtrat um diese Uhrzeit? Das muss gut bezahlt sein."", ""next"": ""sepp_subtle"" },
            { ""text"": ""[Direkt] Was genau transportieren Sie da, Sepp?"", ""next"": ""sepp_direct"" },
            { ""text"": ""[Aggressiv] Halt! Polizeiliche Ermittlung. Öffnen Sie die Frachtpapiere sofort!"", ""next"": ""sepp_aggress"" }
          ]
        },
        {
          ""id"": ""sepp_subtle"",
          ""speaker"": ""Kurier Sepp"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""(Grinst) Kann man so sagen. Frau von Gipser zahlt für Diskretion. Und schnelle Räumungen."",
          ""choices"": [
            { ""text"": ""[Direkt] Räumungen aus dem Archiv?"", ""next"": ""sepp_direct"" },
            { ""text"": ""[Beweis vorlegen] Diese Frachtpapiere hier beweisen, dass Sie Beweismaterial vernichten!"", ""requiresItem"": ""beweis_frachtpapiere"", ""next"": ""sepp_evidence"" }
          ]
        },
        {
          ""id"": ""sepp_direct"",
          ""speaker"": ""Kurier Sepp"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""(Verschränkt die Arme) Geht Sie nichts an. Sind nur alte Akten, die sowieso geschreddert werden sollten."",
          ""choices"": [
            { ""text"": ""[Aggressiv] Beweismittelvernichtung ist strafbar!"", ""next"": ""sepp_aggress"" },
            { ""text"": ""Gut, dann lassen wir das vorerst."", ""isEnd"": true }
          ]
        },
        {
          ""id"": ""sepp_aggress"",
          ""speaker"": ""Kurier Sepp"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""(Tritt zurück) Hey, ganz ruhig! Ich mach nur meinen Job! Gipser hat die Entsorgung beauftragt. Ist das mein Problem, wenn da Papiere von 1823 dabei sind?"",
          ""choices"": [
            { ""text"": ""Übergeben Sie mir die Frachtpapiere."", ""isEnd"": true }
          ]
        },
        {
          ""id"": ""sepp_evidence"",
          ""speaker"": ""Kurier Sepp"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""Wo haben Sie die her?! Mist... Hören Sie, Gipser sagte, die Sachen müssen in den Schredder, bevor Renger sie veröffentlicht. Ich wollte keinen Ärger!"",
          ""choices"": [
            { ""text"": ""Sie haben sich gerade mächtig Ärger eingehandelt. Warten Sie hier."", ""isEnd"": true }
          ]
        }
      ],
      ""sonne_karl_karl"": [
        {
          ""id"": ""start"",
          ""speaker"": ""Wirt Karl"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""Was darf's sein? Ein kühles Helles? Oder suchen Sie etwa auch nach den Gespenstern von 1823, wie dieser Verrückte Heiden?"",
          ""choices"": [
            { ""text"": ""[Subtil] Herr Heiden verkehrt hier? Erzählen Sie mir mehr."", ""next"": ""karl_subtle"" },
            { ""text"": ""[Direkt] Ich suche nach Valentin Herold. War er heute Abend hier?"", ""next"": ""karl_direct"" },
            { ""text"": ""[Aggressiv] Kein Bier. Ich will Antworten. Wer hat sich hier konspiriert?"", ""next"": ""karl_aggress"" }
          ]
        },
        {
          ""id"": ""karl_subtle"",
          ""speaker"": ""Wirt Karl"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""Heiden sitzt oft in der Ecke und starrt auf seine alten Schriften. Murmelt etwas von einer 'Läuterung'. Letzte Woche hatte er einen üblen Streit mit Frau von Gipser."",
          ""choices"": [
            { ""text"": ""[Direkt] Worüber haben sie gestritten?"", ""next"": ""karl_direct_heiden"" },
            { ""text"": ""[Beweis vorlegen] Hatten sie sich wegen dieses zerrissenen Drohbriefs in den Haaren?"", ""requiresItem"": ""evidence_torn_letter"", ""next"": ""karl_evidence"" }
          ]
        },
        {
          ""id"": ""karl_direct"",
          ""speaker"": ""Wirt Karl"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""Herold? Der noble Herr Antiquitätenhändler? Ja, der saß vorhin da drüben. Hat einen Bordeaux bestellt, ist aber nach zehn Minuten hektisch aufgebrochen."",
          ""choices"": [
            { ""text"": ""[Subtil] Aufgebrochen? Er behauptet, er war den ganzen Abend hier."", ""next"": ""karl_lie"" }
          ]
        },
        {
          ""id"": ""karl_aggress"",
          ""speaker"": ""Wirt Karl"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""(Hebt die Hände) Immer mit der Ruhe! Das hier ist eine ehrliche Kneipe. Hier konspiriert niemand. Aber wenn Sie mich so fragen... Herold hat einem Wachmann draußen etwas zugesteckt."",
          ""choices"": [
            { ""text"": ""Einen Wachmann bestochen? Danke für den Tipp."", ""isEnd"": true }
          ]
        },
        {
          ""id"": ""karl_direct_heiden"",
          ""speaker"": ""Wirt Karl"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""Gipser schrie ihn an, dass seine Bruderschaft ein Märchen sei und sie ihn in die Psychiatrie stecken lässt, wenn er ihre Baustelle nochmal blockiert."",
          ""choices"": [
            { ""text"": ""Interessant. Danke."", ""isEnd"": true }
          ]
        },
        {
          ""id"": ""karl_lie"",
          ""speaker"": ""Wirt Karl"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""Dann lügt er. Der hat seinen Wein nicht mal angerührt. Als die Feuerwehrsirenen am Rathaus losgingen, rannte er wie von der Tarantel gestochen aus der Tür."",
          ""choices"": [
            { ""text"": ""Das dachte ich mir."", ""isEnd"": true }
          ]
        },
        {
          ""id"": ""karl_evidence"",
          ""speaker"": ""Wirt Karl"",
          ""avatar"": ""assets/passant.jpg"",
          ""text"": ""Ja! Genau dieses Papier! Er warf es ihr vor die Füße und rief: 'Hof wird ein zweites Mal brennen, bevor die Erben aufgeben!' Verrückter Kerl."",
          ""choices"": [
            { ""text"": ""Das ist ein starkes Motiv für Heiden. Danke."", ""isEnd"": true }
          ]
        }
      ]
";

        string pattern = @"""ludwig_rolf_rolf""\s*:\s*\[.*?\]\s*,\s*""post_kurier_sepp""\s*:\s*\[.*?\]\s*,\s*""sonne_karl_karl""\s*:\s*\[.*?\]";
        string replacement = witnessesComplex.Trim();

        string result = Regex.Replace(text, pattern, replacement, RegexOptions.Singleline);
        
        if (text == result) {
            Console.WriteLine("Could not find the target block to replace.");
            return;
        }

        File.WriteAllText(path, result, new UTF8Encoding(false));
        Console.WriteLine("Witness dialogues updated successfully.");
    }
}
