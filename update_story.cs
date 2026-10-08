using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

public class StoryUpdater {
    public static void Run() {
        string path = @"c:\Users\flaem\Desktop\Krimi\data\story.json";
        string text = File.ReadAllText(path, Encoding.UTF8); // Assuming it is UTF8 or UTF16? PowerShell Select-String worked, meaning File.ReadAllText with default encoding should handle it. Wait, File.ReadAllText detects BOM.

        string newTrees = @",
      ""event_call_herold"": [
        {
          ""id"": ""start"",
          ""speaker"": ""Valentin Herold"",
          ""avatar"": ""assets/suspect_herold.jpg"",
          ""text"": ""Ich weiß, dass Sie in Hof herumschnüffeln! Halten Sie sich aus meinen Antiquitätengeschäften heraus. Ich habe nichts mit diesem lächerlichen Brand zu tun!"",
          ""choices"": [
            { ""text"": ""Warum so nervös, Herold?"", ""next"": ""nervous"", ""impact"": {""suspect"": ""herold"", ""value"": 2} },
            { ""text"": ""Jemand will Ihnen den Brand anhängen?"", ""next"": ""setup"", ""impact"": {""suspect"": ""herold"", ""value"": 0} }
          ]
        },
        {
          ""id"": ""nervous"",
          ""speaker"": ""Valentin Herold"",
          ""avatar"": ""assets/suspect_herold.jpg"",
          ""text"": ""Nervös? Ich warne Sie nur! Wenn Sie weiter graben, verbrennen Sie sich die Finger!"",
          ""isEnd"": true
        },
        {
          ""id"": ""setup"",
          ""speaker"": ""Valentin Herold"",
          ""avatar"": ""assets/suspect_herold.jpg"",
          ""text"": ""Exakt. Jemand lenkt den Verdacht gezielt auf mich, um von den wirklichen Plänen abzulenken."",
          ""isEnd"": true
        }
      ],
      ""event_call_gipser"": [
        {
          ""id"": ""start"",
          ""speaker"": ""Katharina von Gipser"",
          ""avatar"": ""assets/suspect_gipser.jpg"",
          ""text"": ""Herr {PLAYER_NAME}. Man flüstert mir, Sie stellen unbequeme Fragen. Stören Sie nicht mein Baukonsortium."",
          ""choices"": [
            { ""text"": ""Ein Baukonsortium, das von abgebrannten Archiven profitiert?"", ""next"": ""profit"", ""impact"": {""suspect"": ""gipser"", ""value"": 2} },
            { ""text"": ""Ich suche nur die Wahrheit, Frau von Gipser."", ""next"": ""truth"", ""impact"": {""suspect"": ""gipser"", ""value"": 0} }
          ]
        },
        {
          ""id"": ""profit"",
          ""speaker"": ""Katharina von Gipser"",
          ""avatar"": ""assets/suspect_gipser.jpg"",
          ""text"": ""Wir erbauen die Zukunft. Ein paar alte Akten sind der Preis des Fortschritts. Guten Abend."",
          ""isEnd"": true
        },
        {
          ""id"": ""truth"",
          ""speaker"": ""Katharina von Gipser"",
          ""avatar"": ""assets/suspect_gipser.jpg"",
          ""text"": ""Wahrheit ist ein Luxus, den sich Hof nicht mehr leisten kann. Denken Sie darüber nach."",
          ""isEnd"": true
        }
      ],
      ""event_call_heiden"": [
        {
          ""id"": ""start"",
          ""speaker"": ""Severin Heiden"",
          ""avatar"": ""assets/suspect_heiden.jpg"",
          ""text"": ""Das Feuer reinigt, Ermittler. Die Erben wachen über Hof. Stellen Sie sich nicht gegen das Schicksal!"",
          ""choices"": [
            { ""text"": ""Welches Schicksal? Der Brand im Rathaus?"", ""next"": ""fate"", ""impact"": {""suspect"": ""heiden"", ""value"": 2} },
            { ""text"": ""Ich fürchte mich nicht vor falschen Erben."", ""next"": ""fear"", ""impact"": {""suspect"": ""heiden"", ""value"": 0} }
          ]
        },
        {
          ""id"": ""fate"",
          ""speaker"": ""Severin Heiden"",
          ""avatar"": ""assets/suspect_heiden.jpg"",
          ""text"": ""Ein bloßes Fanal! Die wahre Läuterung steht noch bevor. Die Orgelpfeifen werden den Untergang anstimmen."",
          ""isEnd"": true
        },
        {
          ""id"": ""fear"",
          ""speaker"": ""Severin Heiden"",
          ""avatar"": ""assets/suspect_heiden.jpg"",
          ""text"": ""Dann sind Sie ein Narr. Die Flammen von 1823 sind nie wirklich erloschen."",
          ""isEnd"": true
        }
      ]
";

        text = text.Replace("  },\r\n    \"dialogueDecisions\": {", newTrees + "\r\n  },\r\n    \"dialogueDecisions\": {");
        text = text.Replace("  },\n    \"dialogueDecisions\": {", newTrees + "\n  },\n    \"dialogueDecisions\": {");
        
        File.WriteAllText(path, text, new UTF8Encoding(false));
        Console.WriteLine("story.json updated.");
    }
}
