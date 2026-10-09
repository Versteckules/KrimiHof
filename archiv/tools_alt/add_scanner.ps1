$file = "..\data\stations.json"
$stations = Get-Content -Path $file -Raw | ConvertFrom-Json

$found = $false
foreach ($s in $stations) {
    if ($s.gadget.id -eq "scanner") {
        $found = $true
        break
    }
}

if (-not $found) {
    $newStation = @{
        id = "geheimes_versteck"
        number = "B3"
        name = "Geheimes Versteck (Scanner)"
        type = "bonus"
        zone = "altstadt"
        coords = "N 50° 19.500 E 011° 55.300"
        radius = 20
        description = "[BONUS-ERMITTLUNG 3] Ein unscheinbarer Hinterhof. Jemand meinte, hier gäbe es Infrarot-Spuren."
        riddle = @{
            question = "Nutze den IR-Scanner, um die unsichtbare Markierung an der Wand zu finden."
            answers = @("fertig", "erledigt")
            hint = "Klicke einfach auf die Antwort-Schaltfläche oder öffne das Gadget direkt."
            solutionDebug = "fertig"
            choices = @(
                @{ id = "c1"; text = "Scanner aktivieren!"; value = "fertig" }
            )
        }
        gadget = @{
            id = "scanner"
            name = "IR-Scanner"
            description = "Nutze die Handykamera mit dem IR-Filter, um die versteckte Spur an der Wand zu entdecken."
        }
        witness = @{
            name = "Nachtwächter"
            role = "Zeuge"
            image = "assets/avatar.jpg"
            dialogue = "„Ich hab hier jemanden mit einer komischen Taschenlampe rumfuchteln sehen. Was haben Sie denn da auf dem Schirm gefunden?!“"
        }
        bonusReward = "+20 Detektiv-Punkte & IR-Spezialist"
    }

    $stations += $newStation
    $json = $stations | ConvertTo-Json -Depth 10
    [System.IO.File]::WriteAllText((Resolve-Path $file).Path, $json, [System.Text.Encoding]::UTF8)
    Write-Host "Scanner station added!"
} else {
    Write-Host "Scanner already integrated."
}
