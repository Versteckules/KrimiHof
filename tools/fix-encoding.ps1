$path = "..\data\stations.json"
$content = Get-Content -Path $path -Raw -Encoding UTF8

$content = $content.Replace("Ã¤", "ä")
$content = $content.Replace("Ã¼", "ü")
$content = $content.Replace("Ã¶", "ö")
$content = $content.Replace("ÃŸ", "ß")
$content = $content.Replace("Ã„", "Ä")
$content = $content.Replace("Ãœ", "Ü")
$content = $content.Replace("Ã–", "Ö")
$content = $content.Replace("Ã©", "é")
$content = $content.Replace("Ã³", "ó")
$content = $content.Replace("Â°", "°")

Set-Content -Path $path -Value $content -Encoding UTF8
Write-Host "Fixed stations.json!"
