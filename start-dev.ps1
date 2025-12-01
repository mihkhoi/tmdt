param([switch]$UsePostgres)
Set-StrictMode -Version Latest
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root 'shop-backend'
$frontend = Join-Path $root 'shop-frontend'

$backendJob = Start-Job -ScriptBlock {
  Set-Location $using:backend
  if (-not $using:UsePostgres) {
    $env:SPRING_DATASOURCE_URL = 'jdbc:h2:file:./shopdb;AUTO_SERVER=TRUE;DB_CLOSE_DELAY=-1;MODE=PostgreSQL'
    $env:SPRING_DATASOURCE_USERNAME = 'sa'
    $env:SPRING_DATASOURCE_PASSWORD = ''
    $env:SPRING_DATASOURCE_DRIVER_CLASS_NAME = 'org.h2.Driver'
    $env:HIBERNATE_DIALECT = 'org.hibernate.dialect.H2Dialect'
  }
  .\mvnw.cmd -q spring-boot:run
}
Start-Sleep -Seconds 2
$frontendJob = Start-Job -ScriptBlock { Set-Location $using:frontend; npm start }

Write-Host "Backend: http://localhost:8080" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green

Wait-Job -Any $backendJob, $frontendJob
