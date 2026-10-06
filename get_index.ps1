$content = Get-Content -Path .git\index -Encoding UTF8 -Raw
[regex]::Matches($content, '[a-zA-Z0-9_\-\/]+\.js') | ForEach-Object { $_.Value } | Sort-Object -Unique
