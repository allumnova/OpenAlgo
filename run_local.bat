@echo off
echo [1/4] Installing Python dependencies...
pip install -r api/requirements.txt
pip install -r engine/requirements.txt

echo [2/4] Installing Dashboard dependencies...
cd dashboard
call npm install
cd ..

echo [3/4] Starting Services...

:: Start API
start "OpenAlgo API" cmd /c "cd api && uvicorn main:app --port 8001 --reload"

:: Start Engine
start "OpenAlgo Engine" cmd /c "cd engine && python orchestrator.py"

:: Start Dashboard
start "OpenAlgo Dashboard" cmd /c "cd dashboard && npm run dev -- --port 3001"

:: Start WhatsApp Agent
start "OpenAlgo WhatsApp" cmd /c "cd whatsapp && npm start"

echo.
echo All services are starting up!
echo Dashboard: http://localhost:3001
echo API: http://localhost:8001
echo.
echo Note: If you changed ports in .env, you may need to update them in the start commands above.
pause
