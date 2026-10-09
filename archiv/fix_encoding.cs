using System;
using System.IO;
using System.Text;

class Program {
    static void Main() {
        string path = @"c:\Users\flaem\Desktop\Krimi\data\story.json";
        string text = File.ReadAllText(path, Encoding.UTF8);

        // Standard double-encoded utf-8 chars in german
        text = text.Replace("Ã¼", "ü");
        text = text.Replace("Ã¤", "ä");
        text = text.Replace("Ã¶", "ö");
        text = text.Replace("ÃŸ", "ß");
        text = text.Replace("Ã„", "Ä");
        text = text.Replace("Ãœ", "Ü");
        text = text.Replace("Ã–", "Ö");
        text = text.Replace("Ã©", "é");
        
        // Typographical quotes
        text = text.Replace("â€ž", "„");
        text = text.Replace("â€œ", "“");
        text = text.Replace("â€™", "’");
        text = text.Replace("â€“", "–");

        // The specific corrupted characters seen in the endings (Powershell console encoding mangled it to look like ?, but it's )
        // Instead of replacing single question marks which is dangerous, we replace the specific words.
        text = text.Replace("?z", "„");
        text = text.Replace("?o", "“");
        text = text.Replace("?\"", "–"); // The "–" replacement
        text = text.Replace("groYen", "großen");
        text = text.Replace("FraY", "Fraß");
        text = text.Replace("FǬr", "Für");
        text = text.Replace("fǬr", "für");
        text = text.Replace("Ǭber", "über");
        text = text.Replace("wǬrdigen", "würdigen");
        text = text.Replace("HǬter", "Hüter");
        text = text.Replace("nǬtzen", "nützen");
        text = text.Replace("schǬtzen", "schützen");
        text = text.Replace("GlǬck", "Glück");
        text = text.Replace("unkǬndbares", "unkündbares");
        text = text.Replace("schnǬffeln", "schnüffeln");
        
        text = text.Replace("Verzgerungen", "Verzögerungen");
        text = text.Replace("Stadtrtin", "Stadträtin");
        text = text.Replace("lcherlichen", "lächerlichen");
        text = text.Replace("lsst", "lässt");
        text = text.Replace("stren", "stören");
        text = text.Replace("anhngen", "anhängen");
        text = text.Replace("Geschften", "Geschäften");
        text = text.Replace("beschftigte", "beschäftigte");
        text = text.Replace("tatschlich", "tatsächlich");
        text = text.Replace("Vermgen", "Vermögen");
        text = text.Replace("gehrt", "gehört");
        text = text.Replace("luten", "läuten");
        
        // One specific replacement for "öffnen"
        text = text.Replace("ffnen", "öffnen");

        File.WriteAllText(path, text, new UTF8Encoding(false));
        Console.WriteLine("Fixed encoding in story.json!");
    }
}
