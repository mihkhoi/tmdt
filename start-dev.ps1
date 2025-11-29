Set-StrictMode -Version Latest
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root 'shop-backend'
$frontend = Join-Path $root 'shop-frontend'

$backendJob = Start-Job -ScriptBlock { Set-Location $using:backend; .\mvnw.cmd -q spring-boot:run }
Start-Sleep -Seconds 2
$frontendJob = Start-Job -ScriptBlock { Set-Location $using:frontend; npm start }

Write-Host "Backend: http://localhost:8080" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green

Wait-Job -Any $backendJob, $frontendJob
