using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

class Program {
    static void Main() {
        string path = @"c:\Users\flaem\Desktop\Krimi\data\story.json";
        string text = File.ReadAllText(path, Encoding.UTF8);

        // We know we replaced `?"` with `–`. 
        // This resulted in `–, ` or `–}` or `–\n` where there should be `?", ` or `?"}` or `?"\n`.
        // Let's replace `–, ` with `?", `
        text = text.Replace("–, ", "?\", ");
        
        // Let's replace `– }` with `?" }`
        text = text.Replace("– }", "?\" }");

        // Let's replace `–}` with `?"}`
        text = text.Replace("–}", "?\"}");

        // For line 382, we already manually replaced `Nacht?` but we might have left a trailing comma without a quote.
        // Wait, at line 382 I replaced `Nacht–,` with `Nacht?",`. So that is already fixed.

        // Are there any other `–` that are broken?
        // Let's use regex to find `–` followed by `,` or `}` or whitespace and `}` etc.
        // But the Replace above covers the main JSON cases: `–, ` (for next property) and `– }` (for end of object).

        File.WriteAllText(path, text, new UTF8Encoding(false));
        Console.WriteLine("Fixed corrupted quotes in story.json!");
    }
}
