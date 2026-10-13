# ============================================================
# tools/encrypt_final.ps1 - Krimi Hof (GCBYXW0)
# Verschluesselt die Final- und Bonus-Koordinaten fuer GitHub
# ============================================================

[CmdletBinding()]
param()

$MASTER_SALT = "KrimiHof1823_Salt_GCBYXW0"
$DEFAULT_PASSPHRASE = "SchlappenPakt_Hof_1823_Geheimnis_GCBYXW0"

function Get-StandardPassphrase {
    return "$DEFAULT_PASSPHRASE`_standard_coords"
}

function Get-BonusPassphrase([string]$murdererId = "herold") {
    return "$DEFAULT_PASSPHRASE`_bonus_$murdererId`_75perc"
}

function Encrypt-AesCbc([string]$plainText, [string]$passphrase) {
    $saltBytes = [System.Text.Encoding]::UTF8.GetBytes($MASTER_SALT)
    $kdf = New-Object System.Security.Cryptography.Rfc2898DeriveBytes($passphrase, $saltBytes, 10000, [System.Security.Cryptography.HashAlgorithmName]::SHA256)
    $keyBytes = $kdf.GetBytes(32) # 256 Bit

    $aes = [System.Security.Cryptography.Aes]::Create()
    $aes.KeySize = 256
    $aes.Mode = [System.Security.Cryptography.CipherMode]::CBC
    $aes.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7
    $aes.Key = $keyBytes
    $aes.GenerateIV()
    $ivBytes = $aes.IV

    $encryptor = $aes.CreateEncryptor()
    $plainBytes = [System.Text.Encoding]::UTF8.GetBytes($plainText)
    $cipherBytes = $encryptor.TransformFinalBlock($plainBytes, 0, $plainBytes.Length)

    $ivHex = [BitConverter]::ToString($ivBytes).Replace("-", "").ToLower()
    $dataHex = [BitConverter]::ToString($cipherBytes).Replace("-", "").ToLower()

    return @{
        iv = $ivHex
        data = $dataHex
    }
}

$inputPath = Join-Path $PSScriptRoot "..\data\final_plain.json"
if (-not (Test-Path $inputPath)) {
    $inputPath = Join-Path $PSScriptRoot "..\data\final.json"
}

Write-Host "Lese Quelldatei: $inputPath ..." -ForegroundColor Cyan
$rawJson = Get-Content -Raw -Encoding UTF8 $inputPath | ConvertFrom-Json

# 1. Standard-Final verschluesseln
$stdJsonStr = $rawJson.standardFinal | ConvertTo-Json -Compress
$encStd = Encrypt-AesCbc -plainText $stdJsonStr -passphrase (Get-StandardPassphrase)

# 2. Bonus-Final verschluesseln
$bonusJsonStr = $rawJson.bonusFinal | ConvertTo-Json -Compress
$encBonus = Encrypt-AesCbc -plainText $bonusJsonStr -passphrase (Get-BonusPassphrase "herold")

# 3. Encrypted Payload zusammenbauen
$encryptedData = [ordered]@{
    "_hinweis" = "DIESE DATEI IST MIT AES-256-CBC VERSCHLUESSELT. Sie kann bedenkenlos auf GitHub hochgeladen werden!"
    "_bearbeitung" = "Zum Aendern der Koordinaten nutze data/final_plain.json oder tools/encrypt_final.html"
    "encrypted" = $true
    "algorithm" = "AES-CBC"
    "standardFinal" = $encStd
    "bonusFinal" = $encBonus
    "diploma" = [ordered]@{
        "title" = "Meister-Ermittler der Stadt Hof"
        "subtitle" = "Im Fall des verschwundenen Bundespakts von 1823"
        "signature" = "Der Hohe Rat der Hofer Schlappen-Erben"
        "bonusBadgeTitle" = "Ehren-Detektiv mit Auszeichnung (Alle Bonus-Faelle geloest)"
    }
}

$outputPath = Join-Path $PSScriptRoot "..\data\final.json"
$outputJson = $encryptedData | ConvertTo-Json -Depth 10

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($outputPath, $outputJson, $utf8NoBom)
Write-Host "Erfolg! data/final.json wurde verschluesselt gespeichert (UTF-8 ohne BOM)." -ForegroundColor Green
Write-Host "Die Koordinaten sind nun vor Geocaching-Spoilern auf GitHub geschuetzt!" -ForegroundColor Yellow
