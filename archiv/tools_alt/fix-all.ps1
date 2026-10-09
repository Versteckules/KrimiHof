$jsonContent = [System.IO.File]::ReadAllText("c:\Users\flaem\Desktop\Krimi\tools\fixes.json", [System.Text.Encoding]::UTF8)
$fixes = ConvertFrom-Json $jsonContent

$directories = Get-ChildItem -Path "c:\Users\flaem\Desktop\Krimi" -Recurse -Directory | Where-Object {
    $_.FullName -notmatch "\\\.git" -and 
    $_.FullName -notmatch "\\vendor" -and 
    $_.FullName -notmatch "\\assets"
}

$files = Get-ChildItem -Path "c:\Users\flaem\Desktop\Krimi" -File | Where-Object { $_.Extension -match "\.(js|html|css|json|txt|md|cs|ps1)$" }
foreach ($dir in $directories) {
    $files += Get-ChildItem -Path $dir.FullName -File | Where-Object { $_.Extension -match "\.(js|html|css|json|txt|md|cs|ps1)$" }
}

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content
    
    foreach ($prop in $fixes.psobject.properties) {
        $content = $content.Replace($prop.Name, $prop.Value)
    }
    
    if ($content -cne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, (New-Object System.Text.UTF8Encoding $false))
        Write-Host "Fixed: $($file.FullName)"
    }
}

Write-Host "Done."
