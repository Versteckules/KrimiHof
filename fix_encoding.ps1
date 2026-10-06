$ErrorActionPreference = 'Stop'
$path = "c:\Users\flaem\Desktop\Krimi\data\stations.json"
$text = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$text = $text.Replace("ÃŸ", "ß")
$text = $text.Replace("Ã¤", "ä")
$text = $text.Replace("Ã¼", "ü")
$text = $text.Replace("Ã¶", "ö")
$text = $text.Replace("Ã–", "Ö")
$text = $text.Replace("Ã„", "Ä")
$text = $text.Replace("Ãœ", "Ü")
$text = $text.Replace("â€ž", "„")
$text = $text.Replace("â€œ", "“")
$text = $text.Replace("â€“", "–")

[System.IO.File]::WriteAllText($path, $text, [System.Text.Encoding]::UTF8)
Write-Host "Done stations.json"

$path2 = "c:\Users\flaem\Desktop\Krimi\data\story.json"
$text2 = [System.IO.File]::ReadAllText($path2, [System.Text.Encoding]::UTF8)
$text2 = $text2.Replace("ÃŸ", "ß").Replace("Ã¤", "ä").Replace("Ã¼", "ü").Replace("Ã¶", "ö").Replace("Ã–", "Ö").Replace("Ã„", "Ä").Replace("Ãœ", "Ü").Replace("â€ž", "„").Replace("â€œ", "“").Replace("â€“", "–")
[System.IO.File]::WriteAllText($path2, $text2, [System.Text.Encoding]::UTF8)
Write-Host "Done story.json"
