# Watches geography/notes/chapters and rebuilds each chapter's .js copy whenever its .json is saved.
$root = Join-Path $PSScriptRoot 'chapters'
$utf8 = New-Object System.Text.UTF8Encoding($false)

function Convert-Chapter([System.IO.FileInfo]$f) {
    $rel  = $f.FullName.Substring($root.Length + 1) -replace '\\', '/'
    $json = $null
    for ($i = 0; $i -lt 5 -and -not $json; $i++) {
        try { $json = ([System.IO.File]::ReadAllText($f.FullName, $utf8)).Trim() }
        catch { Start-Sleep -Milliseconds 200 }
    }
    if (-not $json) { Write-Host "Skipped (empty or unreadable): $rel" -ForegroundColor Yellow; return }
    try { $null = $json | ConvertFrom-Json }
    catch { Write-Host "Skipped (invalid JSON, fix it and save again): $rel" -ForegroundColor Yellow; return }
    $js  = '(window.__UG_CHAPTERS = window.__UG_CHAPTERS || {})["' + $rel + '"] = ' + $json + ';'
    $out = $f.FullName -replace '\.json$', '.js'
    [System.IO.File]::WriteAllText($out, $js, $utf8)
    Write-Host ("{0}  updated {1}" -f (Get-Date -Format HH:mm:ss), ($rel -replace '\.json$', '.js')) -ForegroundColor Green
}

$seen = @{}
Write-Host "Watching $root  (Ctrl+C to stop)"
while ($true) {
    if (Test-Path $root) {
        Get-ChildItem -Path $root -Recurse -Filter *.json -File | ForEach-Object {
            $t = $_.LastWriteTimeUtc.Ticks
            if ($seen[$_.FullName] -ne $t) { $seen[$_.FullName] = $t; Convert-Chapter $_ }
        }
    }
    Start-Sleep -Seconds 1
}
