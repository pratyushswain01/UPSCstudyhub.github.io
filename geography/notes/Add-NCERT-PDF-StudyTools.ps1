# ============================================================
# UPSC Gurukul - PDF Study Workspace Upgrade (v2 - Production)
# Safely adds annotation tools to the EXISTING reader.html
# Does NOT replace the reader or touch NCERT content
# ============================================================

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# ---------- 1. Locate repository & target ----------
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$target   = Join-Path $repoRoot 'geography\notes\reader.html'

if (-not (Test-Path -LiteralPath $target)) {
    Write-Host "ERROR: reader.html not found at:`n$target" -ForegroundColor Red
    Write-Host "Please run this script from the repository root (UPSCstudyhub.github.io)." -ForegroundColor Yellow
    exit 1
}

Write-Host "Target found: $target" -ForegroundColor Cyan

# ---------- 2. Create timestamped backup ----------
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup    = "$target.backup-pdf-tools-$timestamp"

Copy-Item -LiteralPath $target -Destination $backup -Force
Write-Host "Backup created: $backup" -ForegroundColor Green

# ---------- 3. Read current file ----------
$html = Get-Content -LiteralPath $target -Raw -Encoding UTF8

# ---------- 4. Idempotency check ----------
if ($html -match 'ug-pdf-tools-v2') {
    Write-Host "PDF study tools (v2) already installed. No changes made." -ForegroundColor Yellow
    exit 0
}

# ---------- 5. Safety check - original PDF body must exist ----------
$oldBodyPattern = '<div class="pdfp__body"><iframe id="pdfFrame" title="NCERT chapter PDF"></iframe></div>'
if ($html -notmatch [regex]::Escape($oldBodyPattern)) {
    # Try a slightly more flexible match
    if ($html -notmatch 'pdfp__body.*pdfFrame') {
        Write-Host "ERROR: Expected original PDF iframe markup was not found." -ForegroundColor Red
        Write-Host "Your reader.html appears to have a different structure. No changes made." -ForegroundColor Yellow
        exit 1
    }
}

# ---------- 6. New PDF workspace HTML ----------
$newBody = @'
<div class="pdfp__body" id="ugPdfWorkspace" data-ug-pdf-tools-v2>
  <div class="ug-pdf-toolbar" role="toolbar" aria-label="PDF study tools">
    <button type="button" data-ug-tool="select" class="is-active" title="Select text">Select</button>
    <button type="button" data-ug-tool="pen" title="Freehand pen">Pen</button>
    <button type="button" data-ug-tool="highlight" title="Highlight">Highlight</button>
    <button type="button" data-ug-tool="eraser" title="Eraser">Eraser</button>
    <button type="button" data-ug-tool="text" title="Add text note">Text</button>
    <button type="button" id="ugUndo" title="Undo last action">Undo</button>
    <button type="button" id="ugClear" title="Clear annotations on this page">Clear</button>
    <button type="button" id="ugGoogle" title="Search selected text on Google">Ask Google</button>
    <button type="button" id="ugAsk" title="Ask Gurukul Mitra">Ask doubt</button>
    <label class="ug-color-label" title="Annotation colour">
      Colour <input id="ugColor" type="color" value="#f4d35e" aria-label="Choose colour">
    </label>
    <span id="ugSaveStatus" aria-live="polite">Saved on this device</span>
  </div>
  <div id="ugPdfPages" class="ug-pdf-pages">
    <p class="ug-pdf-loading">Open the NCERT PDF panel to load pagesâ€¦</p>
  </div>
  <!-- Original iframe kept (hidden) so existing reader logic continues to work -->
  <iframe id="pdfFrame" title="NCERT chapter PDF" aria-hidden="true" tabindex="-1" style="position:absolute;width:1px;height:1px;left:-9999px;opacity:0;pointer-events:none;"></iframe>
</div>
'@

# Replace the original body
$html = $html -replace [regex]::Escape($oldBodyPattern), $newBody

# ---------- 7. Inject CSS ----------
$cssAnchor = '.pdfp__body{position:relative;flex:1;min-height:0;background:var(--paper-2)}'
if (-not $html.Contains($cssAnchor)) {
    # Fallback: try a shorter unique part
    $cssAnchor = '.pdfp__body{'
}

$css = @'

/* ========== ug-pdf-tools-v2 : Premium PDF Study Workspace ========== */
#ugPdfWorkspace {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f7f5f0;
}

.ug-pdf-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  background: #faf9f6;
  border-bottom: 1px solid #e5e1d8;
  z-index: 5;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}

.ug-pdf-toolbar button {
  border: 1px solid #d9d4c8;
  border-radius: 6px;
  background: #fff;
  color: #3d3a34;
  padding: 5px 10px;
  font: 500 12px/1.3 system-ui, -apple-system, "Segoe UI", sans-serif;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  white-space: nowrap;
}

.ug-pdf-toolbar button:hover {
  background: #f0ede6;
  border-color: #c9c3b5;
}

.ug-pdf-toolbar button.is-active {
  background: #e8f0e6;
  border-color: #7a9e6e;
  color: #2f4a28;
  font-weight: 600;
}

.ug-color-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font: 12px system-ui, sans-serif;
  color: #6b6560;
  margin-left: 4px;
}

#ugColor {
  width: 28px;
  height: 24px;
  border: 1px solid #d9d4c8;
  border-radius: 4px;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

#ugSaveStatus {
  margin-left: auto;
  font: 11px system-ui, sans-serif;
  color: #8a847a;
  white-space: nowrap;
}

.ug-pdf-pages {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 18px 12px;
  background: #6b6560;
}

.ug-pdf-page {
  position: relative;
  width: max-content;
  max-width: 100%;
  margin: 0 auto 22px;
  background: #fff;
  box-shadow: 0 3px 14px rgba(0,0,0,0.25);
  border-radius: 2px;
}

.ug-pdf-page canvas.ug-page-render {
  display: block;
  max-width: 100%;
  height: auto;
}

.ug-pdf-page canvas.ug-ink {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  touch-action: none;
  cursor: crosshair;
  z-index: 2;
}

.ug-pdf-loading {
  padding: 28px;
  color: #eee;
  font: 14px system-ui, sans-serif;
  text-align: center;
}

.ug-pdf-textnote {
  position: absolute;
  min-width: 100px;
  max-width: 240px;
  padding: 6px 8px;
  border: 1px solid #c9a84c;
  background: #fff8e1;
  color: #3d3218;
  font: 13px/1.35 system-ui, sans-serif;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  white-space: pre-wrap;
  z-index: 3;
  border-radius: 3px;
  cursor: move;
}

.ug-pdf-textnote:focus {
  outline: 2px solid #7a9e6e;
}

@media (max-width: 720px) {
  .ug-pdf-toolbar {
    gap: 4px;
    padding: 6px 8px;
  }
  .ug-pdf-toolbar button {
    padding: 5px 7px;
    font-size: 11px;
  }
  #ugSaveStatus {
    width: 100%;
    margin-left: 0;
    margin-top: 4px;
    text-align: center;
  }
}
/* ========== end ug-pdf-tools-v2 ========== */
'@

if ($html.Contains($cssAnchor)) {
    $html = $html.Replace($cssAnchor, $cssAnchor + "`r`n" + $css)
} else {
    # Fallback: inject before </head> or at the end of style block
    if ($html -match '</style>') {
        $html = $html -replace '</style>', ($css + "`r`n</style>")
    } else {
        Write-Host "WARNING: Could not find CSS injection point. CSS may be missing." -ForegroundColor Yellow
    }
}

# ---------- 8. Inject JavaScript (improved) ----------
$script = @'

<!-- ug-pdf-tools-v2 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script>
(function () {
  'use strict';

  const workspace = document.getElementById('ugPdfWorkspace');
  if (!workspace) return;

  const frame   = document.getElementById('pdfFrame');
  const pagesEl = document.getElementById('ugPdfPages');
  const colorEl = document.getElementById('ugColor');
  const statusEl = document.getElementById('ugSaveStatus');

  let tool = 'select';
  let activePage = 1;
  let history = [];
  let pdfDoc = null;
  let loading = false;
  let currentStroke = null;

  // Unique key per chapter / page
  const baseKey = 'ug-pdf-v2:' + location.pathname + location.search;

  function status(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  function storeKey(page) {
    return baseKey + ':p' + page;
  }

  function loadPage(page) {
    try {
      return JSON.parse(localStorage.getItem(storeKey(page)) || '[]');
    } catch (e) {
      return [];
    }
  }

  function savePage(page, items) {
    try {
      localStorage.setItem(storeKey(page), JSON.stringify(items));
      status('Saved on this device');
    } catch (e) {
      status('Storage full / unavailable');
    }
  }

  function setTool(t) {
    tool = t;
    workspace.querySelectorAll('[data-ug-tool]').forEach(btn => {
      btn.classList.toggle('is-active', btn.getAttribute('data-ug-tool') === t);
    });
    // Update cursor on all ink canvases
    pagesEl.querySelectorAll('canvas.ug-ink').forEach(c => {
      c.style.cursor = (t === 'select') ? 'default' : 'crosshair';
    });
  }

  workspace.querySelectorAll('[data-ug-tool]').forEach(btn => {
    btn.addEventListener('click', () => setTool(btn.getAttribute('data-ug-tool')));
  });

  // ---------- Drawing helpers ----------
  function redraw(canvas, items) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    items.forEach(a => {
      if (a.type === 'path') {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = a.width;
        ctx.strokeStyle = a.color;
        ctx.globalAlpha = a.alpha || 1;
        a.points.forEach((pt, i) => {
          const x = pt[0] * canvas.width;
          const y = pt[1] * canvas.height;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });
  }

  function renderNotes(holder, items) {
    holder.querySelectorAll('.ug-pdf-textnote').forEach(n => n.remove());
    items.forEach(a => {
      if (a.type !== 'note') return;
      const note = document.createElement('div');
      note.className = 'ug-pdf-textnote';
      note.contentEditable = true;
      note.textContent = a.text;
      note.style.left = (a.x * 100) + '%';
      note.style.top  = (a.y * 100) + '%';
      note.addEventListener('blur', () => {
        a.text = note.textContent;
        const page = Number(holder.dataset.page);
        const items = loadPage(page);
        const idx = items.findIndex(i => i === a);
        if (idx >= 0) {
          items[idx].text = a.text;
          savePage(page, items);
        }
      });
      holder.appendChild(note);
    });
  }

  function attachInk(canvas, pageNum) {
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let points = [];
    let items = loadPage(pageNum);
    redraw(canvas, items);
    renderNotes(canvas.parentElement, items);

    function getPos(e) {
      const r = canvas.getBoundingClientRect();
      return [
        (e.clientX - r.left) / r.width,
        (e.clientY - r.top)  / r.height
      ];
    }

    canvas.addEventListener('pointerdown', function (e) {
      if (tool === 'select') return;
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      drawing = true;
      points = [getPos(e)];

      if (tool === 'text') {
        const text = prompt('Enter study note:');
        if (text && text.trim()) {
          history.push({ page: pageNum, items: JSON.parse(JSON.stringify(items)) });
          items.push({ type: 'note', x: points[0][0], y: points[0][1], text: text.trim() });
          savePage(pageNum, items);
          renderNotes(canvas.parentElement, items);
        }
        drawing = false;
        return;
      }

      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const isHighlight = tool === 'highlight';
      const isEraser = tool === 'eraser';
      ctx.lineWidth = (isHighlight ? 22 : 3.2) * (window.devicePixelRatio || 1);
      ctx.strokeStyle = isEraser ? '#ffffff' : colorEl.value;
      ctx.globalAlpha = isHighlight ? 0.32 : 1;
      ctx.moveTo(points[0][0] * canvas.width, points[0][1] * canvas.height);
    });

    canvas.addEventListener('pointermove', function (e) {
      if (!drawing || tool === 'text' || tool === 'select') return;
      const p = getPos(e);
      points.push(p);
      ctx.lineTo(p[0] * canvas.width, p[1] * canvas.height);
      ctx.stroke();
    });

    function finishStroke() {
      if (!drawing) return;
      drawing = false;
      ctx.globalAlpha = 1;
      if (points.length > 1) {
        history.push({ page: pageNum, items: JSON.parse(JSON.stringify(items)) });
        const isHighlight = tool === 'highlight';
        const isEraser = tool === 'eraser';
        items.push({
          type: 'path',
          points: points,
          color: isEraser ? '#ffffff' : colorEl.value,
          width: (isHighlight ? 22 : 3.2) * (window.devicePixelRatio || 1),
          alpha: isHighlight ? 0.32 : 1
        });
        savePage(pageNum, items);
      }
    }

    canvas.addEventListener('pointerup', finishStroke);
    canvas.addEventListener('pointercancel', finishStroke);
    canvas.addEventListener('pointerleave', finishStroke);
  }

  // ---------- Render PDF with PDF.js ----------
  async function renderDocument(url) {
    if (loading || !url || !window.pdfjsLib) return;
    loading = true;
    status('Loading PDFâ€¦');
    pagesEl.innerHTML = '<p class="ug-pdf-loading">Loading pagesâ€¦</p>';

    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      pdfDoc = await pdfjsLib.getDocument({ url: url, withCredentials: false }).promise;
      pagesEl.innerHTML = '';

      for (let p = 1; p <= pdfDoc.numPages; p++) {
        const page = await pdfDoc.getPage(p);
        const viewport = page.getViewport({ scale: 1.4 });

        const holder = document.createElement('div');
        holder.className = 'ug-pdf-page';
        holder.dataset.page = p;

        const renderCanvas = document.createElement('canvas');
        renderCanvas.className = 'ug-page-render';
        renderCanvas.width  = Math.floor(viewport.width);
        renderCanvas.height = Math.floor(viewport.height);

        const inkCanvas = document.createElement('canvas');
        inkCanvas.className = 'ug-ink';
        inkCanvas.width  = renderCanvas.width;
        inkCanvas.height = renderCanvas.height;

        holder.appendChild(renderCanvas);
        holder.appendChild(inkCanvas);
        pagesEl.appendChild(holder);

        await page.render({
          canvasContext: renderCanvas.getContext('2d'),
          viewport: viewport
        }).promise;

        attachInk(inkCanvas, p);
      }

      status('Page 1 of ' + pdfDoc.numPages + ' Â· Saved on this device');
      activePage = 1;
    } catch (err) {
      console.error('UPSC Gurukul PDF tools error:', err);
      pagesEl.innerHTML = '<p class="ug-pdf-loading">Could not load PDF with PDF.js.<br>Use â€œOpen in new tabâ€ to read the original file.</p>';
      status('PDF load failed');
    } finally {
      loading = false;
    }
  }

  // Watch for the original reader setting the iframe src
  const observer = new MutationObserver(() => {
    const src = frame.getAttribute('src');
    if (src && !workspace.closest('[hidden]')) {
      renderDocument(src.split('#')[0]);
    }
  });
  observer.observe(frame, { attributes: true, attributeFilter: ['src'] });

  // Also trigger when user clicks the existing PDF open buttons
  document.querySelectorAll('.js-pdf, [data-pdf], .pdf-open').forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        const src = frame.getAttribute('src');
        if (src) renderDocument(src.split('#')[0]);
      }, 400);
    });
  });

  // ---------- Toolbar actions ----------
  document.getElementById('ugUndo').addEventListener('click', () => {
    const last = history.pop();
    if (!last) return;
    savePage(last.page, last.items);
    const canvas = pagesEl.querySelector('.ug-pdf-page[data-page="' + last.page + '"] canvas.ug-ink');
    if (canvas) {
      redraw(canvas, last.items);
      renderNotes(canvas.parentElement, last.items);
    }
  });

  document.getElementById('ugClear').addEventListener('click', () => {
    if (!confirm('Clear all annotations on page ' + activePage + '?')) return;
    history.push({ page: activePage, items: loadPage(activePage) });
    savePage(activePage, []);
    const canvas = pagesEl.querySelector('.ug-pdf-page[data-page="' + activePage + '"] canvas.ug-ink');
    if (canvas) {
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      renderNotes(canvas.parentElement, []);
    }
  });

  document.getElementById('ugGoogle').addEventListener('click', () => {
    let q = (window.getSelection && window.getSelection().toString() || '').trim();
    if (!q) q = prompt('What do you want to search on Google?') || '';
    if (q) {
      window.open('https://www.google.com/search?q=' + encodeURIComponent(q), '_blank', 'noopener,noreferrer');
    }
  });

  document.getElementById('ugAsk').addEventListener('click', () => {
    let selected = (window.getSelection && window.getSelection().toString() || '').trim();
    let question = prompt('Type your doubt (or leave empty to explain the selected text):', selected ? '' : '') || '';
    const finalQ = question.trim() || selected;
    if (!finalQ) return;

    // Safe fallback â€“ opens a well-formed search. Replace this block later
    // if you have a real Gurukul Mitra endpoint.
    const promptText = 'Explain this NCERT Geography concept simply with examples: ' + finalQ;
    window.open('https://www.google.com/search?q=' + encodeURIComponent(promptText), '_blank', 'noopener,noreferrer');
  });

  // Track which page is currently most visible
  pagesEl.addEventListener('scroll', () => {
    const pageEls = pagesEl.querySelectorAll('.ug-pdf-page');
    let best = 1, minDist = Infinity;
    const top = pagesEl.getBoundingClientRect().top;
    pageEls.forEach(el => {
      const dist = Math.abs(el.getBoundingClientRect().top - top);
      if (dist < minDist) {
        minDist = dist;
        best = Number(el.dataset.page);
      }
    });
    activePage = best;
  });

})();
</script>
'@

if ($html -notmatch '</body>') {
    Write-Host "ERROR: Closing </body> tag not found. Aborting." -ForegroundColor Red
    exit 1
}

$html = $html.Replace('</body>', $script + "`r`n</body>")

# ---------- 9. Write the updated file ----------
Set-Content -LiteralPath $target -Value $html -Encoding UTF8 -NoNewline

Write-Host ''
Write-Host 'SUCCESS - PDF Study Workspace v2 installed' -ForegroundColor Green
Write-Host ('File updated : ' + $target)
Write-Host ('Backup saved : ' + $backup)
Write-Host ''
Write-Host 'Next steps:' -ForegroundColor Cyan
Write-Host '1. Open geography/notes/reader.html in your browser'
Write-Host '2. Open any chapter PDF panel'
Write-Host '3. Test Select / Pen / Highlight / Eraser / Text / Undo / Clear'
Write-Host '4. Verify annotations survive a page refresh'
Write-Host ''
Write-Host 'Do NOT commit or push until you have tested thoroughly.' -ForegroundColor Yellow
