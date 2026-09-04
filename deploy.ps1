# InfinityFree Deployment Package Generator
# Creates deploy\casagan-pigery-deploy.zip ready to upload to InfinityFree
# Usage: powershell -ExecutionPolicy Bypass -File deploy.ps1

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$distDir = Join-Path $projectRoot "deploy"
$zipFile = Join-Path $distDir "casagan-pigery-deploy.zip"

Write-Host "=== CasaganPigery InfinityFree Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Clean previous build
if (Test-Path $distDir) {
    Remove-Item $distDir -Recurse -Force
}
New-Item -ItemType Directory -Path $distDir -Force | Out-Null

# Step 1: Build frontend assets
Write-Host "[1/3] Building frontend assets..." -ForegroundColor Yellow
Set-Location $projectRoot
& npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Create deployment zip
Write-Host "[2/3] Creating deployment package..." -ForegroundColor Yellow

Add-Type -AssemblyName System.IO.Compression.FileSystem

if (Test-Path $zipFile) {
    Remove-Item $zipFile -Force
}

[System.IO.Compression.ZipFile]::CreateFromDirectory(
    (Join-Path $projectRoot "public"),
    $zipFile,
    [System.IO.Compression.CompressionLevel]::Optimal,
    $false
)

Write-Host "[3/3] Adding Laravel backend files..." -ForegroundColor Yellow

# Re-open the zip to add additional files
$tempDir = Join-Path $distDir "temp_deploy"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

Expand-Archive -Path $zipFile -DestinationPath $tempDir -Force

# Copy Laravel backend directories (including vendor for server without SSH/composer)
$laravelDirs = @("app", "bootstrap", "config", "database", "routes", "vendor")
foreach ($dir in $laravelDirs) {
    $source = Join-Path $projectRoot $dir
    if (Test-Path $source) {
        Copy-Item $source (Join-Path $tempDir $dir) -Recurse -Force
    }
}

# Copy entire storage directory (including app/, framework/, logs/)
$storageSource = Join-Path $projectRoot "storage"
$storageDest = Join-Path $tempDir "storage"
if (Test-Path $storageSource) {
    Copy-Item $storageSource $storageDest -Recurse -Force
}

# Copy essential root files
$essentialFiles = @(".env", "artisan", "composer.json", "composer.lock")
foreach ($file in $essentialFiles) {
    $source = Join-Path $projectRoot $file
    if (Test-Path $source) {
        Copy-Item $source (Join-Path $tempDir $file) -Force
    }
}

# Re-create the zip with all files
Remove-Item $zipFile -Force
[System.IO.Compression.ZipFile]::CreateFromDirectory(
    $tempDir,
    $zipFile,
    [System.IO.Compression.CompressionLevel]::Optimal,
    $false
)

# Cleanup temp dir
Remove-Item $tempDir -Recurse -Force

$size = [math]::Round((Get-Item $zipFile).Length / 1MB, 2)
Write-Host ""
Write-Host "=== Deployment package ready ===" -ForegroundColor Green
Write-Host "File: $zipFile"
Write-Host "Size: $size MB"
Write-Host ""
Write-Host "Deploy steps:" -ForegroundColor Cyan
Write-Host "  1. Upload deploy\casagan-pigery-deploy.zip to InfinityFree File Manager"
Write-Host "  2. Extract it in /htdocs/ on InfinityFree"
Write-Host "  3. Done!"
