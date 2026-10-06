@echo off
REM Doppelklick-Start: lokaler Webserver + Browser (http://localhost:8080)
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\serve.ps1" -Open
