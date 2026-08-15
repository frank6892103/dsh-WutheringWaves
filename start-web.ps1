$ErrorActionPreference = 'Stop'

$runtimeRoot = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies'
$nodePath = Join-Path $runtimeRoot 'node\bin\node.exe'
$pnpmPath = Join-Path $runtimeRoot 'bin\fallback\pnpm.cmd'

if (-not (Test-Path -LiteralPath $nodePath) -or -not (Test-Path -LiteralPath $pnpmPath)) {
    throw 'Codex bundled Node.js runtime was not found. Install Node.js 24 and pnpm, then run: pnpm run web'
}

$env:PATH = "$(Join-Path $runtimeRoot 'bin\override');$(Join-Path $runtimeRoot 'node\bin');$(Join-Path $runtimeRoot 'bin\fallback');$env:PATH"
Set-Location -LiteralPath $PSScriptRoot

& $pnpmPath run web
exit $LASTEXITCODE
