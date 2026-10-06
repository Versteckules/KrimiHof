using System;
using System.IO;
using System.Text;

public class Uncorrupt {
    public static void Run() {
        string path = @"c:\Users\flaem\Desktop\Krimi\data\story.json";
        string text = File.ReadAllText(path, Encoding.UTF8);
        byte[] bytes = Encoding.GetEncoding(1252).GetBytes(text);
        string fixedText = Encoding.UTF8.GetString(bytes);
        File.WriteAllText(path, fixedText, new UTF8Encoding(false));
    }
}
