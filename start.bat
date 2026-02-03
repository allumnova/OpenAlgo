@echo off
echo Starting OpenAlgo Platform...
docker-compose up --build -d
echo OpenAlgo is starting. 
echo Dashboard: http://localhost:3000
echo API: http://localhost:8000
echo WhatsApp QR: Check "whatsapp" container logs
echo.
set /p desktop="Launch Desktop App? (y/n): "
if /i "%desktop%"=="y" (
    echo Launching Electron...
    cd desktop && npm start
)
pause
