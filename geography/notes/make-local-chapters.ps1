# Creates a ".js" copy next to every chapter ".json" so reader.html can also be opened
# straight from the folder (file://). Websites do not use these files.
$root = Join-Path $PSScriptRoot 'chapters'
$utf8 = New-Object System.Text.UTF8Encoding($false)
Get-ChildItem -Path $root -Recurse -Filter *.json | ForEach-Object {
    $rel  = $_.FullName.Substring($root.Length + 1) -replace '\\', '/'
    $json = ([System.IO.File]::ReadAllText($_.FullName, $utf8)).Trim()
    $js   = '(window.__UG_CHAPTERS = window.__UG_CHAPTERS || {})["' + $rel + '"] = ' + $json + ';'
    $out  = $_.FullName -replace '\.json$', '.js'
    [System.IO.File]::WriteAllText($out, $js, $utf8)
    Write-Host "Wrote $out"
}
