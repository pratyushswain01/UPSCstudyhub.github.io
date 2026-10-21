param(
  [string]$ProjectRoot = "C:\Users\Mr.PRATYUSH\Documents\UPSCstudyhub.github.io",
  [switch]$SkipHomepageInjection
)
$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Stop-Safe([string]$Message) {
  Write-Host "`nSTOP: $Message" -ForegroundColor Red
  exit 1
}
if (-not (Test-Path -LiteralPath $ProjectRoot -PathType Container)) { Stop-Safe "Project root not found: $ProjectRoot" }
Set-Location $ProjectRoot

if (-not (Test-Path ".git")) { Stop-Safe "This folder is not a Git repository." }
$gitStatus = (& git status --porcelain=v1 2>&1 | Out-String)
if ($LASTEXITCODE -ne 0) { Stop-Safe "Could not read Git status." }
if ($gitStatus -match '^(UU|AA|DD|AU|UA|DU|UD)\s') {
  Stop-Safe "Unresolved Git conflicts detected. Finish/abort the rebase safely before installing."
}
if ((& git rev-parse --git-dir 2>$null) -and ((& git status 2>&1 | Out-String) -match 'rebase in progress')) {
  Stop-Safe "A Git rebase is still in progress. Finish it before installing."
}

$sourceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$required = @(
  "worker\worker.js", "worker\wrangler.toml",
  "public\gurukul-mitra.js", "public\gurukul-mitra.css"
)
foreach ($rel in $required) {
  if (-not (Test-Path (Join-Path $sourceRoot $rel))) { Stop-Safe "Missing package file: $rel. Keep this script beside worker/ and public/." }
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupRoot = Join-Path $ProjectRoot ".gurukul-mitra-backups\$stamp"
New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null
foreach ($rel in @("homeUPSChub.html", "index.html")) {
  if (Test-Path $rel) { Copy-Item $rel (Join-Path $backupRoot $rel) -Force }
}
Write-Host "Backup created: $backupRoot" -ForegroundColor Green

# Copy new, namespaced assets only; never overwrite existing assets without a backup.
$assetDir = Join-Path $ProjectRoot "gurukul-mitra"
New-Item -ItemType Directory -Path $assetDir -Force | Out-Null
Copy-Item (Join-Path $sourceRoot "public\gurukul-mitra.js") (Join-Path $assetDir "gurukul-mitra.js") -Force
Copy-Item (Join-Path $sourceRoot "public\gurukul-mitra.css") (Join-Path $assetDir "gurukul-mitra.css") -Force
New-Item -ItemType Directory -Path (Join-Path $ProjectRoot "cloudflare\gurukul-mitra") -Force | Out-Null
Copy-Item (Join-Path $sourceRoot "worker\worker.js") (Join-Path $ProjectRoot "cloudflare\gurukul-mitra\worker.js") -Force
Copy-Item (Join-Path $sourceRoot "worker\wrangler.toml") (Join-Path $ProjectRoot "cloudflare\gurukul-mitra\wrangler.toml") -Force

# The widget loads its CSS next to the JS file. Rewrite the copied JS URL to the namespaced local path.
$jsPath = Join-Path $assetDir "gurukul-mitra.js"
$js = Get-Content -LiteralPath $jsPath -Raw
$js = $js.Replace('new URL("/gurukul-mitra.css", document.currentScript?.src || location.href)', 'new URL("/gurukul-mitra/gurukul-mitra.css", location.origin)')
Set-Content -LiteralPath $jsPath -Value $js -Encoding UTF8

if (-not $SkipHomepageInjection) {
  $home = Join-Path $ProjectRoot "homeUPSChub.html"
  if (-not (Test-Path $home)) { Stop-Safe "homeUPSChub.html not found. Assets copied, but homepage was not changed." }
  $html = Get-Content -LiteralPath $home -Raw
  if ($html -match '<<<<<<<|=======\s*$|>>>>>>>') { Stop-Safe "Homepage has conflict markers. Assets copied; homepage was not modified." }
  if ($html -notmatch '</body>') { Stop-Safe "No closing body tag found. Homepage was not modified." }
  if ($html -notmatch 'gurukul-mitra/gurukul-mitra\.js') {
    $tag = "`r`n<!-- Gurukul Mitra assistant: isolated integration; existing page content/styles retained -->`r`n<script defer src=`"/gurukul-mitra/gurukul-mitra.js?v=1`"></script>`r`n"
    $updated = [regex]::Replace($html, '</body>', [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $tag + $m.Value }, 1)
    Set-Content -LiteralPath $home -Value $updated -Encoding UTF8
  } else {
    Write-Host "Homepage already references Gurukul Mitra; no duplicate script added." -ForegroundColor Yellow
  }
}

Write-Host "`n=== VALIDATION ===" -ForegroundColor Cyan
$assetChecks = @(
  "gurukul-mitra\gurukul-mitra.js",
  "gurukul-mitra\gurukul-mitra.css",
  "cloudflare\gurukul-mitra\worker.js",
  "cloudflare\gurukul-mitra\wrangler.toml"
)
foreach ($p in $assetChecks) {
  if (-not (Test-Path $p)) { Stop-Safe "Validation failed: missing $p" }
  Write-Host "OK  $p" -ForegroundColor Green
}
if (-not $SkipHomepageInjection) {
  $check = Get-Content ".\homeUPSChub.html" -Raw
  if ($check -notmatch 'gurukul-mitra/gurukul-mitra\.js') { Stop-Safe "Homepage integration tag missing." }
  if ($check -match '<<<<<<<|>>>>>>>') { Stop-Safe "Homepage contains conflict markers." }
  Write-Host "OK  homepage integration tag; original copy was not rewritten intentionally." -ForegroundColor Green
}

Write-Host "`nINSTALL COMPLETE (local files only)." -ForegroundColor Green
Write-Host "Worker directory: $ProjectRoot\cloudflare\gurukul-mitra"
Write-Host "Frontend assets:  $ProjectRoot\gurukul-mitra"
Write-Host "No Git commit, push, or Cloudflare deployment was performed."
Write-Host "Set the deployed Worker URL in gurukul-mitra.js before publishing."
