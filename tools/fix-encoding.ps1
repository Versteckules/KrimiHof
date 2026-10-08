$path = "..\data\stations.json"
$content = Get-Content -Path $path -Raw -Encoding UTF8

$content = $content.Replace("ä", "ä")
$content = $content.Replace("ü", "ü")
$content = $content.Replace("ö", "ö")
$content = $content.Replace("ß", "ß")
$content = $content.Replace("Ä", "Ä")
$content = $content.Replace("Ü", "Ü")
$content = $content.Replace("Ö", "Ö")
$content = $content.Replace("é", "é")
$content = $content.Replace("ó", "ó")
$content = $content.Replace("°", "°")

Set-Content -Path $path -Value $content -Encoding UTF8
Write-Host "Fixed stations.json!"
