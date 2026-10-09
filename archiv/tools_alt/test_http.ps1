$urls = @(
  'http://localhost:8080/index.html',
  'http://localhost:8080/data/stations.json',
  'http://localhost:8080/data/story.json',
  'http://localhost:8080/js/ui/station.js',
  'http://localhost:8080/js/ui/intro.js',
  'http://localhost:8080/js/ui/landing.js',
  'http://localhost:8080/js/ui/dialogue.js',
  'http://localhost:8080/js/ui/dossier.js',
  'http://localhost:8080/js/ui/map.js',
  'http://localhost:8080/assets/kommissar_stahl.jpg',
  'http://localhost:8080/assets/reporter_stift.jpg',
  'http://localhost:8080/assets/suspect_herold.jpg',
  'http://localhost:8080/assets/suspect_gipser.jpg',
  'http://localhost:8080/assets/suspect_heiden.jpg',
  'http://localhost:8080/assets/intro_fire_1823.jpg',
  'http://localhost:8080/assets/intro_archive.jpg',
  'http://localhost:8080/assets/intro_crime_scene.jpg'
)

$allPassed = $true
foreach ($u in $urls) {
  try {
    $res = Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 5
    Write-Host "[OK $($res.StatusCode)] $u" -ForegroundColor Green
  } catch {
    Write-Host "[FAIL] $u" -ForegroundColor Red
    $allPassed = $false
  }
}

if ($allPassed) {
  Write-Host "ALL ASSETS AND ENDPOINTS SERVED SUCCESSFULLY!" -ForegroundColor Cyan
} else {
  Write-Host "SOME ENDPOINTS FAILED!" -ForegroundColor Magenta
}
