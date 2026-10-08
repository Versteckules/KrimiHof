$fixes = @{
    "ðŸ”“" = "🔓"
    "ðŸŽ" = "🎁"
    "ðŸ †" = "🏆"
    "ðŸ—£ï¸ " = "🗣️"
    "ðŸ” " = "🔎"
    "ðŸ“–" = "📖"
    "ðŸ“ž" = "📞"
    "ðŸŽ©" = "🎩"
    "ðŸ•¶ï¸ " = "🕶️"
    "ðŸ§”" = "🧔"
    "ðŸ§¢" = "🧢"
    "ðŸ•µï¸ " = "🕵️"
    "ðŸ‘·" = "👷"
    "ðŸ˜ " = "😠"
    "ðŸ˜³" = "😳"
    "ðŸ§ " = "🧐"
    "ðŸ‘„" = "👄"
    "ðŸ¥¸" = "🥺"
    "ðŸ˜ " = "😐"
}

$files = Get-ChildItem -Path "c:\Users\flaem\Desktop\Krimi" -Recurse -Include *.html,*.js,*.css,*.json | Where-Object { !($_.FullName -match "\\node_modules\\") }

foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        $original = $content
        foreach ($bad in $fixes.Keys) {
            $good = $fixes[$bad]
            $content = $content.Replace($bad, $good)
        }
        if ($content -cne $original) {
            [System.IO.File]::WriteAllText($file.FullName, $content, (New-Object System.Text.UTF8Encoding($false)))
            Write-Host "Fixed: $($file.FullName)"
        }
    } catch {
        Write-Host "Error processing $($file.FullName)"
    }
}
Write-Host "Done!"
