@echo off
cd /d "%~dp0"
set "PORTFOLIO_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%PORTFOLIO_NODE%" (
  "%PORTFOLIO_NODE%" scripts\serve.mjs
) else (
  node scripts\serve.mjs
)
pause
