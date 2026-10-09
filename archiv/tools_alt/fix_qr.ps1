$url = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
$outFile = "c:\Users\flaem\Desktop\Krimi\vendor\qrcode.min.js"
$text = (Invoke-WebRequest -Uri $url -UseBasicParsing).Content
$text = "var QRCode;`n" + $text + "`nexport default QRCode;"
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($outFile, $text, $utf8NoBom)
Write-Output "Done"
