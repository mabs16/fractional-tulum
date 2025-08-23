# Script para mantener el servidor de desarrollo ejecutándose permanentemente
# Uso: .\start-dev-server.ps1

Write-Host "Iniciando servidor de desarrollo Fractional Tulum..." -ForegroundColor Green
Write-Host "Para detener el servidor, presiona Ctrl+C" -ForegroundColor Yellow
Write-Host "El servidor se reiniciará automáticamente si se detiene" -ForegroundColor Cyan
Write-Host "" 

while ($true) {
    try {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Iniciando npm run dev..." -ForegroundColor Blue
        
        # Ejecutar npm run dev
        npm run dev
        
        # Si llegamos aquí, el proceso se detuvo
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] El servidor se detuvo. Reiniciando en 3 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
        
    } catch {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Reiniciando en 5 segundos..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
}