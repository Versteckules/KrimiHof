using System;
using System.IO;
using System.Text;

public class FixerStory {
    public static void Run() {
        string path = @"c:\Users\flaem\Desktop\Krimi\data\story.json";
        
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
        Console.WriteLine("Fixed story.json");
    }
}
