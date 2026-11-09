# ================================================================
# UPSC Gurukul - Upgrade "Ask doubt" to Beautiful Modal
# ================================================================

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Clear-Host
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Upgrading Ask Doubt → Premium Modal UI" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# ---------- 1. Locate reader.html ----------
$repoRoot = Get-Location
$target   = Join-Path $repoRoot "geography\notes\reader.html"

if (-not (Test-Path -LiteralPath $target)) {
    Write-Host "ERROR: reader.html not found at:" -ForegroundColor Red
    Write-Host $target -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please run this script from your repository root." -ForegroundColor Yellow
    exit 1
}

Write-Host "Target found : $target" -ForegroundColor Green

# ---------- 2. Create backup ----------
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backup    = "$target.backup-askdoubt-$timestamp"

Copy-Item -LiteralPath $target -Destination $backup -Force
Write-Host "Backup created: $backup" -ForegroundColor Green
Write-Host ""

# ---------- 3. Read file ----------
$html = Get-Content -LiteralPath $target -Raw -Encoding UTF8

# ---------- 4. Check if already upgraded ----------
if ($html -match 'ugDoubtBackdrop') {
    Write-Host "Ask Doubt modal is already installed." -ForegroundColor Yellow
    Write-Host "No changes made." -ForegroundColor Yellow
    exit 0
}

# ---------- 5. New Ask Doubt JavaScript ----------
$newAskDoubtJS = @'

// ---------- Premium Ask Doubt Modal (ug-pdf-tools) ----------
document.getElementById('ugAsk')?.addEventListener('click', function () {
  let selectedText = (window.getSelection && window.getSelection().toString() || '').trim();

  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.id = 'ugDoubtBackdrop';
  backdrop.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(5px);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: ugFadeIn 0.2s ease;
  `;

  // Modal box
  const modal = document.createElement('div');
  modal.style.cssText = `
    background: #ffffff;
    border-radius: 16px;
    width: 100%;
    max-width: 490px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    animation: ugSlideUp 0.25s ease;
  `;

  modal.innerHTML = `
    <div style="padding: 18px 22px 14px; border-bottom: 1px solid #f1f5f9; display:flex; align-items:center; justify-content:space-between;">
      <div style="display:flex; align-items:center; gap:10px;">
        <div style="width:32px; height:32px; background:linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius:8px; display:flex; align-items:center; justify-content:center; color:white; font-weight:600; font-size:14px;">G</div>
        <div>
          <div style="font-size:16px; font-weight:600; color:#0f172a;">Ask Gurukul Mitra</div>
          <div style="font-size:12px; color:#64748b;">NCERT Class 8 Geography</div>
        </div>
      </div>
      <button id="ugDoubtClose" style="background:none; border:none; font-size:22px; cursor:pointer; color:#94a3b8; line-height:1; padding:4px 8px; border-radius:6px;">×</button>
    </div>

    <div style="padding: 20px 22px;">
      ${selectedText ? `
        <div style="font-size:12px; font-weight:500; color:#64748b; margin-bottom:6px;">Selected from NCERT:</div>
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px; font-size:13.5px; color:#334155; max-height:100px; overflow:auto; margin-bottom:16px; line-height:1.5;">
          ${selectedText.replace(/</g,'&lt;').replace(/>/g,'&gt;')}
        </div>
      ` : ''}

      <label style="font-size:13px; font-weight:500; color:#334155; display:block; margin-bottom:7px;">
        Your doubt / question
      </label>
      <textarea id="ugDoubtInput" rows="4" 
        placeholder="Example: Explain the difference between weathering and erosion in simple words..."
        style="width:100%; padding:12px 14px; border:1.5px solid #cbd5e1; border-radius:10px; font-size:14px; resize:vertical; outline:none; font-family:inherit; transition:border-color 0.2s; box-sizing:border-box;"
      ></textarea>
    </div>

    <div style="padding: 14px 22px 18px; display:flex; gap:10px; justify-content:flex-end; background:#f8fafc; border-top:1px solid #f1f5f9;">
      <button id="ugDoubtCancel" 
        style="padding:9px 18px; border-radius:8px; border:1px solid #cbd5e1; background:white; cursor:pointer; font-size:13.5px; color:#475569; font-weight:500;">
        Cancel
      </button>
      <button id="ugDoubtSubmit" 
        style="padding:9px 20px; border-radius:8px; border:none; background:linear-gradient(135deg, #3b82f6, #2563eb); color:white; cursor:pointer; font-size:13.5px; font-weight:500; box-shadow:0 2px 8px rgba(37,99,235,0.25);">
        Ask Gurukul Mitra
      </button>
    </div>
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  // Add keyframe animations
  if (!document.getElementById('ugDoubtStyles')) {
    const style = document.createElement('style');
    style.id = 'ugDoubtStyles';
    style.textContent = `
      @keyframes ugFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes ugSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      #ugDoubtInput:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
      #ugDoubtClose:hover { background: #f1f5f9; color: #64748b; }
    `;
    document.head.appendChild(style);
  }

  const input = modal.querySelector('#ugDoubtInput');
  setTimeout(() => input.focus(), 50);

  function closeModal() {
    backdrop.style.animation = 'ugFadeIn 0.15s ease reverse';
    setTimeout(() => backdrop.remove(), 140);
  }

  modal.querySelector('#ugDoubtClose').onclick = closeModal;
  modal.querySelector('#ugDoubtCancel').onclick = closeModal;

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  // Submit action
  modal.querySelector('#ugDoubtSubmit').onclick = function () {
    const question = input.value.trim();
    if (!question && !selectedText) {
      input.style.borderColor = '#ef4444';
      input.focus();
      return;
    }

    const finalQuery = question || selectedText;
    const searchText = `Explain this NCERT Class 8 Geography concept in simple language with examples: ${finalQuery}`;

    // Open Google (you can later replace this with real Gurukul Mitra API)
    window.open('https://www.google.com/search?q=' + encodeURIComponent(searchText), '_blank', 'noopener,noreferrer');
    closeModal();
  };

  // Ctrl + Enter to submit
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      modal.querySelector('#ugDoubtSubmit').click();
    }
    if (e.key === 'Escape') closeModal();
  });
});
'@

# ---------- 6. Replace the old Ask doubt handler ----------
# We look for the old simple version and replace it

$oldPattern1 = "document.getElementById\('ugAsk'\).*?addEventListener\('click'.*?\}\);"
$oldPattern2 = "document\.getElementById\('ugAsk'\)\.addEventListener\('click'.*?window\.open.*?\)\;"

if ($html -match 'id="ugAsk"') {
    # Remove any previous simple prompt version
    $html = [regex]::Replace($html, "(?s)document\.getElementById\('ugAsk'\)\.addEventListener\('click'.*?window\.open\([^;]+;", $newAskDoubtJS)
    
    # If the above didn't catch it (different formatting), append the new code before </body>
    if ($html -notmatch 'ugDoubtBackdrop') {
        $html = $html.Replace('</body>', "<script>`n$newAskDoubtJS`n</script>`n</body>")
    }
} else {
    Write-Host "WARNING: Could not find ugAsk button. Appending modal code anyway..." -ForegroundColor Yellow
    $html = $html.Replace('</body>', "<script>`n$newAskDoubtJS`n</script>`n</body>")
}

# ---------- 7. Write the file ----------
Set-Content -LiteralPath $target -Value $html -Encoding UTF8

Write-Host ""
Write-Host "SUCCESS! Ask Doubt upgraded to Premium Modal." -ForegroundColor Green
Write-Host "------------------------------------------------" -ForegroundColor Green
Write-Host "Updated file : $target"
Write-Host "Backup saved : $backup"
Write-Host ""
Write-Host "Test it now:" -ForegroundColor Cyan
Write-Host "1. Open any chapter in the reader"
Write-Host "2. Click the PDF button"
Write-Host "3. Click 'Ask doubt'"
Write-Host "4. You should see a beautiful modal instead of the browser prompt"
Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan