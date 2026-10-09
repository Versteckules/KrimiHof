$path = "..\data\stations.json"
$c = [System.IO.File]::ReadAllText((Resolve-Path $path).Path, [System.Text.Encoding]::UTF8)

# UTF-8 double encoding replacements
$replacements = @{
    ([char]195 + [char]164) = "ä"
    ([char]195 + [char]188) = "ü"
    ([char]195 + [char]182) = "ö"
    ([char]195 + [char]159) = "ß"
    ([char]195 + [char]132) = "Ä"
    ([char]195 + [char]156) = "Ü"
    ([char]195 + [char]150) = "Ö"
    ([char]194 + [char]176) = "°"
    ([char]226 + [char]128 + [char]158) = "„"
    ([char]226 + [char]128 + [char]156) = "“"
    ([char]226 + [char]128 + [char]157) = "”"
    ([char]226 + [char]128 + [char]147) = "–"
    ([char]195 + [char]169) = "é"
}

foreach ($key in $replacements.Keys) {
    $c = $c.Replace($key, $replacements[$key])
}

# Also fixing coords inside stations.json in case degrees broke
$c = $c -replace 'N (\d\d)[^\d]+([\d.]+)[^\dEOW]+([EOW]) (\d\d\d)[^\d]+([\d.]+)', 'N $1° $2 $3 $4° $5'

[System.IO.File]::WriteAllText((Resolve-Path $path).Path, $c, [System.Text.Encoding]::UTF8)
Write-Host "Success!"
