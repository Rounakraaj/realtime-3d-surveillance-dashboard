# PowerShell script to test build
Write-Host "Testing build for errors..." -ForegroundColor Green

# Run npm build
npm run build 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Build successful!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n✗ Build failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit 1
}
