@echo off
REM Starts the Smart Gated Industrial Community dashboard on http://localhost:5180
cd /d "%~dp0"
start "" http://localhost:5180/
python -m http.server 5180 --bind 127.0.0.1
