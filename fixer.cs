using System;
using System.IO;
using System.Text;

public class Fixer {
    public static void Run() {
        string path = @"c:\Users\flaem\Desktop\Krimi\data\stations.json";
        
        // The file is currently encoded in UTF-8, but it contains bytes that were meant to be 
        // Windows-1252 mapped to UTF-8. 
        // e.g. 'ß' (0xDF in Win-1252) was interpreted as "ß" (0xC3 0x9F) when saved as UTF-8.
        string text = File.ReadAllText(path, Encoding.UTF8);
        
        text = text.Replace("ß", "ß");
        text = text.Replace("ä", "ä");
        text = text.Replace("ü", "ü");
        text = text.Replace("ö", "ö");
        text = text.Replace("Ö", "Ö");
        text = text.Replace("Ä", "Ä");
        text = text.Replace("Ü", "Ü");
        text = text.Replace("„", "„");
        text = text.Replace("“", "“");
        text = text.Replace("–", "–");
        text = text.Replace("°", "°");
        
        File.WriteAllText(path, text, new UTF8Encoding(false));
        Console.WriteLine("Fixed stations.json");
    }
}