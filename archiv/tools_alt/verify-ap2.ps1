# verify-ap2.ps1 - Automated verification of AP2 data and structures
$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Verifying AP2 Data and Configurations..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Check data/stations.json
$stationsPath = "data/stations.json"
if (-not (Test-Path $stationsPath)) { throw "stations.json missing!" }
$stations = Get-Content $stationsPath -Raw | ConvertFrom-Json
Write-Host "[OK] data/stations.json parsed successfully. Total: $($stations.Count)" -ForegroundColor Green

if ($stations.Count -ne 14) { throw "Expected 14 stations, found $($stations.Count)" }

# Check mandatory vs bonus
$mandatory = @($stations | Where-Object { $_.type -eq "start" -or $_.type -eq "mandatory" })
$bonus = @($stations | Where-Object { $_.type -eq "bonus" })
Write-Host "[OK] Mandatory: $($mandatory.Count), Bonus: $($bonus.Count)" -ForegroundColor Green
if ($mandatory.Count -ne 12) { throw "Expected 12 mandatory stations, found $($mandatory.Count)" }
if ($bonus.Count -ne 2) { throw "Expected 2 bonus stations, found $($bonus.Count)" }

# Check coords regex
$coordsRegex = '^N\s*\d{1,2}°\s*\d{1,2}\.\d{3}\s*E\s*\d{1,3}°\s*\d{1,2}\.\d{3}$'
foreach ($st in $stations) {
    if (-not ($st.coords -match $coordsRegex)) {
        throw "Station $($st.id) has invalid coords format: '$($st.coords)'"
    }
    if (-not $st.riddle.question -or $st.riddle.answers.Count -eq 0) {
        throw "Station $($st.id) is missing riddle questions/answers"
    }
    if (-not $st.gadget.id) {
        throw "Station $($st.id) is missing gadget"
    }
}
Write-Host "[OK] All 14 stations have valid DMM coords, riddles, and gadgets." -ForegroundColor Green

# 2. Check data/story.json
$storyPath = "data/story.json"
if (-not (Test-Path $storyPath)) { throw "story.json missing!" }
$story = Get-Content $storyPath -Raw | ConvertFrom-Json
Write-Host "[OK] data/story.json parsed successfully." -ForegroundColor Green

if (-not $story.suspects.herold -or -not $story.suspects.gipser -or -not $story.suspects.heiden) {
    throw "Missing required suspects (herold, gipser, heiden) in story.json"
}
Write-Host "[OK] All 3 suspects (herold, gipser, heiden) validated." -ForegroundColor Green

if (-not $story.endings.herold -or -not $story.endings.gipser -or -not $story.endings.heiden) {
    throw "Missing required endings (herold, gipser, heiden) in story.json"
}
Write-Host "[OK] All 3 distinct endings validated." -ForegroundColor Green

if ($story.trackables.Count -ne 4) {
    throw "Expected 4 trackables in story.json, found $($story.trackables.Count)"
}
Write-Host "[OK] 4 trackables validated: $(($story.trackables | ForEach-Object { $_.code }) -join ', ')" -ForegroundColor Green

# 3. Check data/events.json
$eventsPath = "data/events.json"
if (-not (Test-Path $eventsPath)) { throw "events.json missing!" }
$events = Get-Content $eventsPath -Raw | ConvertFrom-Json
Write-Host "[OK] data/events.json parsed successfully. Total: $($events.Count)" -ForegroundColor Green

if ($events.Count -ne 11) { throw "Expected 11 street events, found $($events.Count)" }
Write-Host "[OK] All 11 dynamic Street-Events validated." -ForegroundColor Green

# 4. Check data/final.json
$finalPath = "data/final.json"
if (-not (Test-Path $finalPath)) { throw "final.json missing!" }
$final = Get-Content $finalPath -Raw | ConvertFrom-Json
Write-Host "[OK] data/final.json parsed successfully." -ForegroundColor Green

if (-not ($final.coordsDMM -match $coordsRegex)) {
    throw "final.json coordsDMM invalid format: '$($final.coordsDMM)'"
}
Write-Host "[OK] Final coordinates validated: $($final.coordsDMM)" -ForegroundColor Green

# 5. Check config.js and coords.js existence
if (-not (Test-Path "config.js")) { throw "config.js missing!" }
if (-not (Test-Path "js/coords.js")) { throw "js/coords.js missing!" }
if (-not (Test-Path "js/config-loader.js")) { throw "js/config-loader.js missing!" }
Write-Host "[OK] config.js, js/coords.js, js/config-loader.js exist." -ForegroundColor Green

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "ALL AP2 DATA CHECKS PASSED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
