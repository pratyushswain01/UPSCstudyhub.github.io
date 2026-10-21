# Build-Chapters.ps1  -  run from geography\notes
# For every chapters\**\*.json:  1) downloads its NCERT PDF into .\pdfs  2) adds the "pdf" field
# 3) rebuilds the matching .js (for file:// use).   Options: -Force (redo PDFs)  -Watch (keep running)
param([switch]$Force,[switch]$Watch)
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12
$root=$PSScriptRoot; if(-not $root){$root=(Get-Location).Path}
$ChaptersDir=Join-Path $root 'chapters'; $PdfDir=Join-Path $root 'pdfs'
# NCERT book codes (file = code + 2-digit chapter, e.g. iess101.pdf). Override per chapter with meta.ncertBook
$Books=@{'8'='hess4';'9'='iess1';'10'='jess1';'11'='kegy1';'12'='legy1'}
$utf8=New-Object Text.UTF8Encoding($false)
New-Item -ItemType Directory -Force $PdfDir | Out-Null
$pdfFull=(Resolve-Path $PdfDir).Path
$base=(Resolve-Path $ChaptersDir).Path.TrimEnd('\')+'\'
$readerDir=New-Object Uri($root.TrimEnd('\')+'\')
$first=New-Object Text.RegularExpressions.Regex('^[^{]*\{')

function Build-All {
  foreach($f in Get-ChildItem $ChaptersDir -Recurse -Filter *.json){
    $raw=[IO.File]::ReadAllText($f.FullName).TrimStart([char]0xFEFF)
    try{$j=$raw|ConvertFrom-Json}catch{Write-Warning "$($f.Name): invalid JSON - $($_.Exception.Message)";continue}
    if(-not $j.meta){continue}
    $cls=[regex]::Match([string]$j.meta.class,'\d+').Value
    $code=if($j.meta.ncertBook){[string]$j.meta.ncertBook}else{$Books[$cls]}
    $num=[int]$j.meta.chapterNo
    $has=$raw -match '"pdf"\s*:'
    if($Force -or -not $has){
      if(-not $code -or $num -lt 1){ Write-Warning "$($f.Name): no NCERT book for class '$cls' (add meta.ncertBook)" }
      else{
        $name='{0}{1:00}.pdf' -f $code,$num; $dest=Join-Path $pdfFull $name; $got=Test-Path $dest
        if(-not $got){
          $url="https://ncert.nic.in/textbook/pdf/$name"
          try{
            Invoke-WebRequest $url -OutFile "$dest.tmp" -UseBasicParsing -UserAgent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            if([Text.Encoding]::ASCII.GetString([IO.File]::ReadAllBytes("$dest.tmp")[0..3]) -ne '%PDF'){throw 'not a PDF'}
            Move-Item "$dest.tmp" $dest -Force; $got=$true; Start-Sleep -Milliseconds 600
          }catch{Remove-Item "$dest.tmp" -ErrorAction SilentlyContinue;Write-Warning "$($f.Name): could not get $url ($($_.Exception.Message))"}
        }
        if($got){
          $rel=[Uri]::UnescapeDataString($readerDir.MakeRelativeUri((New-Object Uri $dest)).ToString())
          $line='"pdf": { "href": "'+$rel+'", "title": "NCERT Class '+$cls+', Chapter '+$num+'" }'
          if($has){$raw=[regex]::Replace($raw,'"pdf"\s*:\s*("[^"]*"|\{[^}]*\})',{param($m)$line},'None')}
          else{$raw=$first.Replace($raw,[Text.RegularExpressions.MatchEvaluator]{param($m)$m.Value+"`n  "+$line+','},1)}
          [IO.File]::WriteAllText($f.FullName,$raw,$utf8); Write-Host "PDF  $($f.Name) -> $rel"
        }
      }
    }
    $key=$f.FullName.Substring($base.Length).Replace('\','/')
    $js=[IO.Path]::ChangeExtension($f.FullName,'.js')
    $out='window.__UG_CHAPTERS = window.__UG_CHAPTERS || {};'+"`r`n"+'window.__UG_CHAPTERS["'+$key+'"] = '+$raw.Trim()+';'+"`r`n"
    if(-not (Test-Path $js) -or [IO.File]::ReadAllText($js) -ne $out){[IO.File]::WriteAllText($js,$out,$utf8);Write-Host "JS   $key"}
  }
}
function Sig { (Get-ChildItem $ChaptersDir -Recurse -Filter *.json | ForEach-Object {"$($_.FullName)|$($_.LastWriteTime.Ticks)"}) -join ';' }
Build-All
Write-Host 'Done.' -ForegroundColor Green
if($Watch){ Write-Host 'Watching chapters... (Ctrl+C to stop)'; $s=Sig
  while($true){ Start-Sleep 2; $n=Sig; if($n -ne $s){ Build-All; $s=Sig } } }
