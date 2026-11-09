$ErrorActionPreference = 'Stop'

# Locate reader.html in the same folder as this script
$File = Join-Path $PSScriptRoot 'reader.html'

if (-not (Test-Path -LiteralPath $File)) {
    throw "reader.html not found: $File"
}

# Create backup
$Backup = "$File.backup-askdoubt-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item -LiteralPath $File -Destination $Backup

$html = [System.IO.File]::ReadAllText($File)

# Remove old prompt-based Ask Doubt listener
$oldPattern = '(?s)document\.getElementById\([''"]ugAsk[''"]\)\.addEventListener\([''"]click[''"],\s*async\s+function\s*\(\s*\)\s*\{.*?\n\s*\}\s*\);'

$html = [regex]::Replace($html, $oldPattern, '', 1)

# Replace premium modal Google Search submission
$submitPattern = '(?s)// Submit action\s*modal\.querySelector\(''#ugDoubtSubmit''\)\.onclick\s*=\s*function\s*\(\s*\)\s*\{.*?\n\s*\};'

$replacement = @'
// Submit action: Gurukul Mitra API
modal.querySelector('#ugDoubtSubmit').onclick = async function () {
    const question = input.value.trim();

    if (!question && !selectedText) {
        input.style.borderColor = '#ef4444';
        input.focus();
        return;
    }

    const finalQuery = question || selectedText;
    const button = this;
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = 'Thinking...';

    let answerBox = modal.querySelector('#ugDoubtAnswer');

    if (!answerBox) {
        answerBox = document.createElement('div');
        answerBox.id = 'ugDoubtAnswer';
        answerBox.style.cssText =
            'margin-top:16px;padding:16px;border-radius:12px;' +
            'background:rgba(14,140,140,0.10);color:inherit;' +
            'white-space:pre-wrap;line-height:1.65;font-size:14px;' +
            'max-height:320px;overflow-y:auto;';

        modal.querySelector('#ugDoubtSubmit')
            .parentElement.insertAdjacentElement('beforebegin', answerBox);
    }

    answerBox.textContent = 'Gurukul Mitra is preparing your explanation...';

    try {
        const prompt = (
            'You are Gurukul Mitra, an NCERT Geography tutor. ' +
            'Explain this question accurately in simple language with examples: ' +
            finalQuery
        ).slice(0, 1750);

        const response = await fetch(
            'https://gurukul-mitra-ai.pratyushkumarswain2005.workers.dev/api/chat',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: prompt,
                    history: []
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed: ' + response.status);
        }

        if (!data.reply) {
            throw new Error('No answer returned by Gurukul Mitra.');
        }

        answerBox.textContent = data.reply;

        if (data.fallback === true) {
            answerBox.textContent +=
                '\n\nNote: The Worker returned its fallback response. Check its AI binding and logs.';
        }

    } catch (error) {
        answerBox.textContent =
            'Unable to connect to Gurukul Mitra.\n\n' + error.message;

    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
};
'@

if ([regex]::Matches($html, $submitPattern).Count -ne 1) {
    throw 'Expected exactly one premium modal Submit handler. No changes saved.'
}

$html = [regex]::Replace(
    $html,
    $submitPattern,
    [System.Text.RegularExpressions.MatchEvaluator]{
        param($match)
        return $replacement
    },
    1
)

# Save updated HTML
$encoding = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($File, $html, $encoding)

Write-Host ''
Write-Host 'SUCCESS: Gurukul Mitra integration updated.' -ForegroundColor Green
Write-Host "Updated: $File"
Write-Host "Backup:  $Backup"
Write-Host 'Test locally before publishing.' -ForegroundColor Yellow