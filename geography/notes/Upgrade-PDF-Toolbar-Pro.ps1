# ================================================================
# UPSC Gurukul - Premium PDF Toolbar with Icons + Menu
# ================================================================

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Clear-Host
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Installing Premium PDF Toolbar (Icons + Menu)" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

$repoRoot = Get-Location
$target   = Join-Path $repoRoot "geography\notes\reader.html"

if (-not (Test-Path -LiteralPath $target)) {
    Write-Host "ERROR: reader.html not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Target found : $target" -ForegroundColor Green

# Backup
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backup    = "$target.backup-toolbar-pro-$timestamp"
Copy-Item -LiteralPath $target -Destination $backup -Force
Write-Host "Backup created: $backup" -ForegroundColor Green
Write-Host ""

$html = Get-Content -LiteralPath $target -Raw -Encoding UTF8

# ---------- New Premium Toolbar HTML ----------
$newToolbar = @'
<div class="ug-pdf-toolbar" role="toolbar" aria-label="PDF study tools">

  <!-- Left tools -->
  <div class="ug-toolbar-group">
    <button type="button" data-ug-tool="select" class="is-active" title="Select (V)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>
      <span>Select</span>
    </button>

    <button type="button" data-ug-tool="pen" title="Pen (P)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/></svg>
      <span>Pen</span>
    </button>

    <button type="button" data-ug-tool="highlight" title="Highlight (H)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      <span>Highlight</span>
    </button>

    <button type="button" data-ug-tool="eraser" title="Eraser (E)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 20H7L3 16c-1.5-1.5-1.5-3.5 0-5l7-7 11 11c1.5 1.5 1.5 3.5 0 5z"/><path d="M6 11l5 5"/></svg>
      <span>Eraser</span>
    </button>

    <button type="button" data-ug-tool="text" title="Text Note (T)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
      <span>Text</span>
    </button>
  </div>

  <div class="ug-toolbar-divider"></div>

  <!-- Middle tools -->
  <div class="ug-toolbar-group">
    <button type="button" id="ugUndo" title="Undo (Ctrl+Z)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
      <span>Undo</span>
    </button>

    <button type="button" id="ugClear" title="Clear page">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      <span>Clear</span>
    </button>
  </div>

  <div class="ug-toolbar-divider"></div>

  <!-- Right tools -->
  <div class="ug-toolbar-group">
    <button type="button" id="ugGoogle" title="Search on Google">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <span>Ask Google</span>
    </button>

    <button type="button" id="ugAsk" title="Ask Gurukul Mitra">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span>Ask doubt</span>
    </button>

    <label class="ug-color-label" title="Annotation colour">
      <input id="ugColor" type="color" value="#f4d35e">
    </label>
  </div>

  <!-- Menu button (opens full panel) -->
  <button type="button" id="ugMenuBtn" class="ug-menu-btn" title="More options">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  </button>

  <span id="ugSaveStatus" class="ug-save-status">Saved on this device</span>
</div>

<!-- Full Menu Side Panel -->
<div id="ugSidePanel" class="ug-side-panel">
  <div class="ug-side-header">
    <strong>Study Tools</strong>
    <button id="ugSideClose" title="Close">×</button>
  </div>

  <div class="ug-side-body">
    <div class="ug-side-section">
      <div class="ug-side-title">Drawing</div>
      <button data-ug-tool="pen">Pen</button>
      <button data-ug-tool="highlight">Highlight</button>
      <button data-ug-tool="eraser">Eraser</button>
      <button data-ug-tool="text">Text Note</button>
    </div>

    <div class="ug-side-section">
      <div class="ug-side-title">Actions</div>
      <button id="ugSideUndo">Undo last</button>
      <button id="ugSideClear">Clear this page</button>
      <button id="ugSideClearAll">Clear all pages</button>
    </div>

    <div class="ug-side-section">
      <div class="ug-side-title">Help</div>
      <button id="ugSideGoogle">Ask Google</button>
      <button id="ugSideAsk">Ask Gurukul Mitra</button>
    </div>

    <div class="ug-side-section">
      <div class="ug-side-title">Colour</div>
      <input id="ugSideColor" type="color" value="#f4d35e" style="width:100%; height:36px; border:none; border-radius:6px;">
    </div>
  </div>
</div>
'@

# ---------- Replace old toolbar ----------
if ($html -match 'ug-pdf-toolbar') {
    # Replace existing toolbar block
    $html = [regex]::Replace($html, '(?s)<div class="ug-pdf-toolbar".*?</div>\s*(?=<div id="ugPdfPages"|<div class="ug-pdf-pages")', $newToolbar)
} else {
    Write-Host "Could not find existing toolbar. Please run the main PDF tools installer first." -ForegroundColor Yellow
    exit 1
}

# ---------- Add Premium CSS ----------
$extraCSS = @'

/* ===== Premium Toolbar Styles ===== */
.ug-pdf-toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 10px;
  background: #faf9f6;
  border-bottom: 1px solid #e5e1d8;
  flex-wrap: wrap;
}

.ug-toolbar-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ug-toolbar-divider {
  width: 1px;
  height: 22px;
  background: #e0dbd0;
  margin: 0 4px;
}

.ug-pdf-toolbar button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid #d9d4c8;
  border-radius: 6px;
  background: #fff;
  color: #3d3a34;
  padding: 5px 9px;
  font: 500 12px/1 system-ui, sans-serif;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ug-pdf-toolbar button:hover {
  background: #f0ede6;
  border-color: #c9c3b5;
}

.ug-pdf-toolbar button.is-active {
  background: #e8f0e6;
  border-color: #7a9e6e;
  color: #2f4a28;
}

.ug-pdf-toolbar button svg {
  flex-shrink: 0;
}

.ug-color-label input {
  width: 28px;
  height: 26px;
  border: 1px solid #d9d4c8;
  border-radius: 5px;
  padding: 0;
  cursor: pointer;
  background: transparent;
}

.ug-menu-btn {
  margin-left: 4px;
  padding: 5px 8px !important;
}

.ug-save-status {
  margin-left: auto;
  font-size: 11px;
  color: #8a847a;
  white-space: nowrap;
}

/* Side Panel */
.ug-side-panel {
  position: fixed;
  top: 0;
  right: -320px;
  width: 300px;
  height: 100%;
  background: #fff;
  box-shadow: -8px 0 30px rgba(0,0,0,0.12);
  z-index: 9998;
  transition: right 0.28s ease;
  display: flex;
  flex-direction: column;
}

.ug-side-panel.open {
  right: 0;
}

.ug-side-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid #eee;
  font-size: 15px;
}

.ug-side-header button {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #94a3b8;
  padding: 0 6px;
}

.ug-side-body {
  padding: 12px 16px;
  overflow-y: auto;
  flex: 1;
}

.ug-side-section {
  margin-bottom: 20px;
}

.ug-side-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.ug-side-section button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 9px 12px;
  margin-bottom: 4px;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  color: #374151;
}

.ug-side-section button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

@media (max-width: 700px) {
  .ug-pdf-toolbar button span {
    display: none;
  }
  .ug-pdf-toolbar button {
    padding: 6px 8px;
  }
  .ug-save-status {
    width: 100%;
    text-align: center;
    margin-top: 4px;
  }
}
'@

# Inject CSS
if ($html -match '</style>') {
    $html = $html -replace '</style>', ($extraCSS + "`n</style>")
}

# ---------- Add Side Panel JavaScript ----------
$sidePanelJS = @'

// ===== Side Panel Logic =====
(function() {
  const menuBtn = document.getElementById('ugMenuBtn');
  const sidePanel = document.getElementById('ugSidePanel');
  const sideClose = document.getElementById('ugSideClose');

  if (!menuBtn || !sidePanel) return;

  menuBtn.addEventListener('click', () => {
    sidePanel.classList.add('open');
  });

  sideClose.addEventListener('click', () => {
    sidePanel.classList.remove('open');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (sidePanel.classList.contains('open') && 
        !sidePanel.contains(e.target) && 
        e.target !== menuBtn && 
        !menuBtn.contains(e.target)) {
      sidePanel.classList.remove('open');
    }
  });

  // Sync colour
  const mainColor = document.getElementById('ugColor');
  const sideColor = document.getElementById('ugSideColor');
  if (mainColor && sideColor) {
    sideColor.addEventListener('input', () => mainColor.value = sideColor.value);
    mainColor.addEventListener('input', () => sideColor.value = mainColor.value);
  }

  // Side panel buttons trigger same actions
  document.getElementById('ugSideUndo')?.addEventListener('click', () => document.getElementById('ugUndo')?.click());
  document.getElementById('ugSideClear')?.addEventListener('click', () => document.getElementById('ugClear')?.click());
  document.getElementById('ugSideGoogle')?.addEventListener('click', () => document.getElementById('ugGoogle')?.click());
  document.getElementById('ugSideAsk')?.addEventListener('click', () => document.getElementById('ugAsk')?.click());
})();
'@

$html = $html.Replace('</body>', "<script>`n$sidePanelJS`n</script>`n</body>")

# Write file
Set-Content -LiteralPath $target -Value $html -Encoding UTF8

Write-Host ""
Write-Host "SUCCESS! Premium Toolbar with Icons + Menu installed." -ForegroundColor Green
Write-Host "------------------------------------------------" -ForegroundColor Green
Write-Host "Updated : $target"
Write-Host "Backup  : $backup"
Write-Host ""
Write-Host "Refresh the page and open any PDF to see the new toolbar." -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan