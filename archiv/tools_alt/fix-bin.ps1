$file = "c:\Users\flaem\Desktop\Krimi\index.html"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

$broken = [char]::ConvertFromUtf32(0x00EF) + [char]::ConvertFromUtf32(0x00B8)
$fixed = [char]::ConvertFromUtf32(0xFE0F)

$content = $content.Replace($broken, $fixed)

[System.IO.File]::WriteAllText($file, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Fixed index.html variation selector."
