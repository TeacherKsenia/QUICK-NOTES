$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
$TemplatePath = Join-Path $Root 'styles\icons.template.css'
$OutputPath = Join-Path $Root 'styles\icons.css'

if (-not (Test-Path -LiteralPath $TemplatePath)) {
  throw "Template not found: $TemplatePath"
}

$css = Get-Content -LiteralPath $TemplatePath -Raw -Encoding UTF8
$pattern = 'url\("\.\./assets/icons/([^"\)]+\.svg)"\)'

$css = [regex]::Replace($css, $pattern, {
  param($m)
  $relative = $m.Groups[1].Value -replace '/', '\\'
  $svgPath = Join-Path (Join-Path $Root 'assets\icons') $relative
  if (-not (Test-Path -LiteralPath $svgPath)) {
    throw "SVG not found: $svgPath"
  }
  $bytes = [System.IO.File]::ReadAllBytes($svgPath)
  $base64 = [Convert]::ToBase64String($bytes)
  return 'url("data:image/svg+xml;base64,' + $base64 + '")'
})

[System.IO.File]::WriteAllText($OutputPath, $css, [System.Text.UTF8Encoding]::new($false))

# Force Chrome/file:// to request the freshly generated icon stylesheet instead of
# reusing a cached copy. Every successful rebuild gets a new query-string version.
$IndexPath = Join-Path $Root 'index.html'
if (-not (Test-Path -LiteralPath $IndexPath)) {
  throw "index.html not found: $IndexPath"
}
$index = Get-Content -LiteralPath $IndexPath -Raw -Encoding UTF8
$stamp = [DateTimeOffset]::Now.ToUnixTimeMilliseconds()
$iconHrefPattern = 'href="styles/icons\.css(?:\?v=[^"\s]+)?"'
if (-not [regex]::IsMatch($index, $iconHrefPattern)) {
  throw "Icon stylesheet link not found in index.html"
}
$index = [regex]::Replace($index, $iconHrefPattern, 'href="styles/icons.css?v=' + $stamp + '"', 1)
[System.IO.File]::WriteAllText($IndexPath, $index, [System.Text.UTF8Encoding]::new($false))

Write-Host "Icons updated successfully." -ForegroundColor Green
Write-Host ("Project: " + $Root) -ForegroundColor DarkGray
Write-Host ("Generated: styles\icons.css") -ForegroundColor DarkGray
Write-Host ("Cache version: " + $stamp) -ForegroundColor DarkGray
Write-Host "Now refresh the already-open QUICK NOTES tab once (Ctrl+R)." -ForegroundColor Cyan
