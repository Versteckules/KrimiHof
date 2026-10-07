$gadgetsDir = "..\js\ui\gadgets"
$files = Get-ChildItem -Path $gadgetsDir -Filter "*.js" | Where-Object { $_.Name -ne "gadget-manager.js" }

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    $updated = $false

    if (-not $content.Contains("import * as FX")) {
        $content = "import * as FX from '../../fx.js';`r`n" + $content
        $updated = $true
    }

    # Overlay.innerHTML replacement
    $regex = 'overlay\.innerHTML\s*=\s*`([\s\S]*?)`;'
    $match = [regex]::Match($content, $regex)
    while ($match.Success) {
        $inner = $match.Groups[1].Value
        if (-not $inner.Contains("cl-gadget-wrapper")) {
            $newStr = "overlay.innerHTML = ``<div class=`"cl-gadget-wrapper`"><div class=`"cl-gadget-screws`"></div>" + $inner + "</div>``;"
            $content = $content.Replace($match.Value, $newStr)
            $updated = $true
        }
        $match = $match.NextMatch()
    }

    # onSuccess() replacement
    $successRegex = [regex]'(?<!function.*)(?<!=>.*)(?<!then\(\(\)\s*=>\s*)\bonSuccess\(\)'
    $matches = $successRegex.Matches($content)
    if ($matches.Count -gt 0) {
        $content = $successRegex.Replace($content, "FX.playSuccessWumms().then(() => onSuccess())")
        $updated = $true
    }

    # Error shake
    $alertRegex = [regex]'alert\([''"](.*?)[''"]\)'
    $content = $alertRegex.Replace($content, {
        param($m)
        $msg = $m.Groups[1].Value
        if ($msg -match 'falsch|fehler|nope') {
            return "FX.shakeElement(document.getElementById('gadget-fullscreen-overlay') || document.querySelector('.cl-gadget-wrapper'));`r`n      " + $m.Value
        }
        return $m.Value
    })

    if ($updated) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Updated $($file.Name)"
    }
}
