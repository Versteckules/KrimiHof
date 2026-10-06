$brain = 'C:\Users\flaem\.gemini\antigravity-ide\brain\c03f7827-d98a-4ae6-ac69-839392f87edc'
$assets = 'c:\Users\flaem\Desktop\Krimi\assets'

Copy-Item (Get-ChildItem $brain -Filter '*kommissar_stahl*.jpg' | Select-Object -Last 1).FullName -Destination "$assets\kommissar_stahl.jpg" -Force
Copy-Item (Get-ChildItem $brain -Filter '*reporter_stift*.jpg' | Select-Object -Last 1).FullName -Destination "$assets\reporter_stift.jpg" -Force

$herold = (Get-ChildItem $brain -Filter '*suspect_herold*.jpg' | Select-Object -Last 1).FullName
Copy-Item $herold -Destination "$assets\suspect_herold.jpg" -Force
Copy-Item $herold -Destination "$assets\suspect_herold.webp" -Force

$gipser = (Get-ChildItem $brain -Filter '*suspect_gipser*.jpg' | Select-Object -Last 1).FullName
Copy-Item $gipser -Destination "$assets\suspect_gipser.jpg" -Force
Copy-Item $gipser -Destination "$assets\suspect_gipser.webp" -Force

$heiden = (Get-ChildItem $brain -Filter '*suspect_heiden*.jpg' | Select-Object -Last 1).FullName
Copy-Item $heiden -Destination "$assets\suspect_heiden.jpg" -Force
Copy-Item $heiden -Destination "$assets\suspect_heiden.webp" -Force

Copy-Item (Get-ChildItem $brain -Filter '*intro_fire_1823*.jpg' | Select-Object -Last 1).FullName -Destination "$assets\intro_fire_1823.jpg" -Force
Copy-Item (Get-ChildItem $brain -Filter '*intro_archive*.jpg' | Select-Object -Last 1).FullName -Destination "$assets\intro_archive.jpg" -Force
Copy-Item (Get-ChildItem $brain -Filter '*intro_crime_scene*.jpg' | Select-Object -Last 1).FullName -Destination "$assets\intro_crime_scene.jpg" -Force

Get-ChildItem $assets | Select-Object Name, Length
