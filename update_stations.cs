using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

public class Updater {
    public static void Run() {
        string path = @"c:\Users\flaem\Desktop\Krimi\data\stations.json";
        string text = File.ReadAllText(path, Encoding.UTF8);
        
        // 1. Rename 'Kino Lorenzstraße' to 'Rotary Brunnen' and change coords
        text = text.Replace("\"name\":  \"Kino Lorenzstraße\"", "\"name\":  \"Rotary Brunnen\"");
        // The old coords for 'hauptpost' (now 'Rotary Brunnen') were: N 50° 19.123 E 011° 54.962 ... Wait, 
        // Let's replace the whole block for hauptpost's coords.
        text = Regex.Replace(text, "\"id\":\\s*\"hauptpost\"[\\s\\S]*?\"coords\":\\s*\"[^\"]+\"", match => {
            return match.Value.Substring(0, match.Value.LastIndexOf("\"coords\":")) + "\"coords\":  \"N 50° 19.123 E 011° 54.962\"";
        });
        
        // 2. Hospitalkirche coords to N 50° 19.455 E 011° 55.147
        text = Regex.Replace(text, "\"id\":\\s*\"hospitalkirche\"[\\s\\S]*?\"coords\":\\s*\"[^\"]+\"", match => {
            return match.Value.Substring(0, match.Value.LastIndexOf("\"coords\":")) + "\"coords\":  \"N 50° 19.455 E 011° 55.147\"";
        });

        // 3. Add avatars
        text = Regex.Replace(text, "(\"name\":\\s*\"Nachtkurier Sepp\",\\s*\"role\":\\s*\"Kurierfahrer\")", "$1,\n                          \"image\": \"assets/kurier.jpg\"");
        text = Regex.Replace(text, "(\"name\":\\s*\"Chorsängerin Helene\",\\s*\"role\":\\s*\"Sopranistin an St. Michaelis\")", "$1,\n                          \"image\": \"assets/helene.jpg\"");
        text = Regex.Replace(text, "(\"name\":\\s*\"Wärschtlamo-Stammgast\",\\s*\"role\":\\s*\"Nachtschwärmer\")", "$1,\n                          \"image\": \"assets/stammgast.jpg\"");
        
        File.WriteAllText(path, text, new UTF8Encoding(false));
        Console.WriteLine("stations.json updated successfully.");
    }
}
