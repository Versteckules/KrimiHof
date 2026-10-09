$p = "..\data\stations.json"
$c = [System.IO.File]::ReadAllText((Resolve-Path $p).Path, [System.Text.Encoding]::UTF8)
$c = $c.Replace([string]([char]195+[char]164), [string][char]228)
$c = $c.Replace([string]([char]195+[char]188), [string][char]252)
$c = $c.Replace([string]([char]195+[char]182), [string][char]246)
$c = $c.Replace([string]([char]195+[char]159), [string][char]223)
$c = $c.Replace([string]([char]195+[char]132), [string][char]196)
$c = $c.Replace([string]([char]195+[char]156), [string][char]220)
$c = $c.Replace([string]([char]195+[char]150), [string][char]214)
$c = $c.Replace([string]([char]194+[char]176), [string][char]176)
$c = $c.Replace([string]([char]226+[char]128+[char]158), [string][char]8222)
$c = $c.Replace([string]([char]226+[char]128+[char]156), [string][char]8220)
$c = $c.Replace([string]([char]226+[char]128+[char]157), [string][char]8221)
$c = $c.Replace([string]([char]226+[char]128+[char]147), [string][char]8211)
$c = $c.Replace([string]([char]195+[char]169), [string][char]233)

[System.IO.File]::WriteAllText((Resolve-Path $p).Path, $c, [System.Text.Encoding]::UTF8)
Write-Host "Success!"
