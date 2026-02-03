@echo off
echo [1/2] Killing processes on Dashboard port (3001)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do taskkill /f /pid %%a

echo [2/2] Killing processes on API port (8001)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8001 ^| findstr LISTENING') do taskkill /f /pid %%a

echo Port cleanup complete.
pause
