powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"cd 'D:\n8n_local\market-drip'; ^
git status; ^
git add -A; ^
git diff --cached --quiet; ^
if ($LASTEXITCODE -ne 0) { git commit -m ('n8n auto: ' + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')) }; ^
git push origin main"
