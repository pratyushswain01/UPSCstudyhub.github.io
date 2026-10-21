
$ErrorActionPreference = "Stop"

$repo = "C:\Users\Mr.PRATYUSH\Documents\UPSCstudyhub.github.io"
$chapter = "geography/notes/chapters/class-8/ch02.json"
$pdf = "geography/notes/pdfs/hess402.pdf"

Set-Location $repo

# Ensure Git is available and this is a repository
git rev-parse --show-toplevel
if ($LASTEXITCODE -ne 0) { throw "Not a Git repository." }

# Verify both files exist
foreach ($file in @($chapter, $pdf)) {
    if (!(Test-Path -LiteralPath $file -PathType Leaf)) {
        throw "Required file not found: $file. Nothing was committed or pushed."
    }
}

# Validate Chapter 2 JSON
try {
    $data = Get-Content -LiteralPath $chapter -Raw |
        ConvertFrom-Json -ErrorAction Stop
} catch {
    throw "Chapter JSON is invalid. Nothing was committed or pushed."
}

if ($data.meta.chapterNo -ne 2) {
    throw "The JSON does not identify itself as Chapter 2."
}

if ($data.pdf.href -ne "pdfs/hess402.pdf") {
    throw "Chapter 2 PDF reference is unexpected: $($data.pdf.href)"
}

Write-Host "`nChapter: $($data.meta.title)" -ForegroundColor Cyan
Write-Host "PDF: $pdf" -ForegroundColor Cyan

# Verify Git identity and current branch
$branch = (git branch --show-current).Trim()
if (!$branch) { throw "Could not determine current branch." }

# Refuse to mix in existing staged changes
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    throw "Other changes are already staged. Unstage/review them before running this script."
}

# Stage only the JSON and its PDF
git add -- $chapter $pdf
if ($LASTEXITCODE -ne 0) { throw "Git staging failed." }

# Confirm exactly these two files are staged
$staged = @(git diff --cached --name-only)
$expected = @($chapter, $pdf)

if ($staged.Count -ne 2 -or
    ($staged | Sort-Object) -join "`n" -ne
    ($expected | Sort-Object) -join "`n") {

    git restore --staged -- $chapter $pdf
    throw "Unexpected staged files. Staging of these two files was undone."
}

git diff --cached --check
if ($LASTEXITCODE -ne 0) {
    git restore --staged -- $chapter $pdf
    throw "Whitespace validation failed. Nothing was committed."
}

Write-Host "`nFiles to be committed:" -ForegroundColor Yellow
git diff --cached --name-only

$confirm = Read-Host "Type YES to commit and push these two files to origin/$branch"
if ($confirm -cne "YES") {
    git restore --staged -- $chapter $pdf
    Write-Host "Cancelled. No commit or push performed."
    return
}

git commit -m "Add Class 8 Geography Chapter 2 notes and PDF"
if ($LASTEXITCODE -ne 0) {
    throw "Commit failed. Review Git output; push was not attempted."
}

git push origin $branch
if ($LASTEXITCODE -ne 0) {
    throw "Push failed. The local commit exists; resolve the Git error before retrying."
}

Write-Host "`nChapter 2 JSON and PDF pushed successfully!" -ForegroundColor Green
Write-Host "JSON: $chapter"
Write-Host "PDF:  $pdf"
git status --short
