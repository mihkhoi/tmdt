# Script to expose ShopEase app publicly using ngrok or localtunnel
# Usage: .\expose-public.ps1 [ngrok|localtunnel] [port]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("ngrok", "localtunnel")]
    [string]$Tool = "ngrok",
    
    [Parameter(Mandatory=$false)]
    [int]$Port = 3000
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ShopEase - Public URL Exposer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if port is in use
$portInUse = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if (-not $portInUse) {
    Write-Host "⚠️  Warning: Port $Port is not in use. Make sure your app is running!" -ForegroundColor Yellow
    Write-Host ""
}

if ($Tool -eq "ngrok") {
    Write-Host "Using ngrok to expose port $Port..." -ForegroundColor Green
    Write-Host ""
    
    # Check if ngrok is installed
    $ngrokInstalled = Get-Command ngrok -ErrorAction SilentlyContinue
    if (-not $ngrokInstalled) {
        Write-Host "❌ ngrok is not installed!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Install ngrok:" -ForegroundColor Yellow
        Write-Host "  1. Download from: https://ngrok.com/download" -ForegroundColor Yellow
        Write-Host "  2. Extract ngrok.exe to a folder in your PATH" -ForegroundColor Yellow
        Write-Host "  3. Or run: choco install ngrok (if you have Chocolatey)" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Alternative: Use localtunnel instead:" -ForegroundColor Yellow
        Write-Host "  .\expose-public.ps1 -Tool localtunnel -Port $Port" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "Starting ngrok tunnel on port $Port..." -ForegroundColor Green
    Write-Host "Your public URL will be displayed below:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the tunnel" -ForegroundColor Yellow
    Write-Host ""
    
    # Start ngrok
    ngrok http $Port
}
else {
    Write-Host "Using localtunnel to expose port $Port..." -ForegroundColor Green
    Write-Host ""
    
    # Check if npx is available (comes with Node.js)
    $npxInstalled = Get-Command npx -ErrorAction SilentlyContinue
    if (-not $npxInstalled) {
        Write-Host "❌ npx is not installed! Please install Node.js first." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Starting localtunnel on port $Port..." -ForegroundColor Green
    Write-Host "Your public URL will be displayed below:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the tunnel" -ForegroundColor Yellow
    Write-Host ""
    
    # Start localtunnel with a custom subdomain (optional)
    $subdomain = "shopease-$(Get-Random -Minimum 1000 -Maximum 9999)"
    Write-Host "Requesting subdomain: $subdomain" -ForegroundColor Cyan
    Write-Host ""
    
    npx --yes localtunnel --port $Port --subdomain $subdomain
}
