$stationsJson = Get-Content -Raw .\data\stations.json
$stations = ConvertFrom-Json $stationsJson
Write-Host "Stations parsed successfully! Count: $($stations.Length)"

$storyJson = Get-Content -Raw .\data\story.json
$story = ConvertFrom-Json $storyJson
Write-Host "Story parsed successfully! Title: $($story.title)"

Write-Host "Station 1 name: $($stations[0].name)"
Write-Host "Station 1 characters:"
foreach ($c in $stations[0].characters) {
    Write-Host " - $($c.name) ($($c.role)) -> $($c.image)"
}

Write-Host "Station 2 choices:"
foreach ($ch in $stations[1].riddle.choices) {
    Write-Host " - $($ch.text) [val: $($ch.value)]"
}

Write-Host "Dialogue trees:"
foreach ($prop in $story.dialogueTrees.PSObject.Properties) {
    Write-Host " - $($prop.Name)"
}
