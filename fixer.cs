using System;
using System.IO;
using System.Text;

public class Fixer {
    public static void Run() {
        string path = @"c:\Users\flaem\Desktop\Krimi\data\stations.json";
        
        // The file is currently encoded in UTF-8, but it contains bytes that were meant to be 
        // Windows-1252 mapped to UTF-8. 
        // e.g. 'ß' (0xDF in Win-1252) was interpreted as "ÃŸ" (0xC3 0x9F) when saved as UTF-8.
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
        Console.WriteLine("Fixed stations.json");
    }
}