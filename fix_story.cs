using System;
using System.IO;
using System.Text;

public class FixerStory {
    public static void Run() {
        string path = @"c:\Users\flaem\Desktop\Krimi\data\story.json";
        
        string text = File.ReadAllText(path, Encoding.UTF8);
        
        text = text.Replace("ÃŸ", "ß");
        text = text.Replace("Ã¤", "ä");
        text = text.Replace("Ã¼", "ü");
        text = text.Replace("Ã¶", "ö");
        text = text.Replace("Ã–", "Ö");
        text = text.Replace("Ã„", "Ä");
        text = text.Replace("Ãœ", "Ü");
        text = text.Replace("â€ž", "„");
        text = text.Replace("â€œ", "“");
        text = text.Replace("â€“", "–");
        text = text.Replace("Â°", "°");
        
        File.WriteAllText(path, text, new UTF8Encoding(false));
        Console.WriteLine("Fixed story.json");
    }
}
