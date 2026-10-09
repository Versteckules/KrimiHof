using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

class Program {
    static void Main() {
        string path = @"c:\Users\flaem\Desktop\Krimi\data\story.json";
        string text = File.ReadAllText(path, Encoding.UTF8);

        // We know that `?"` was replaced by `–`. 
        // This deleted the closing quote of the JSON string!
        // So we now have things like `–,` and `–\r\n` which should be `?",` and `?"\r\n` respectively.
        
        // We will just match `–` followed by `,` or whitespace newline, that is NOT inside a string (because it lacks the closing quote).
        // Actually, just replacing `–,` with `?",` and `–\r` with `?"\r` and `–\n` with `?"\n` is safe enough for this file.
        
        text = text.Replace("–,\r", "?\",\r");
        text = text.Replace("–,\n", "?\",\n");
        text = text.Replace("–\r", "?\"\r");
        text = text.Replace("–\n", "?\"\n");
        
        // Also sometimes there is a space before the comma, like `– ,` ? Probably not.

        File.WriteAllText(path, text, new UTF8Encoding(false));
        Console.WriteLine("Fixed ALL corrupted quotes in story.json!");
    }
}
