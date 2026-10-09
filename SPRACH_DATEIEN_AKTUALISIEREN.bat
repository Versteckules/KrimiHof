@echo off
cls
echo ======================================================================
echo    DER PAKT DER SCHLAPPEN-ERBEN: SPRACHDATEIEN AKTUALISIEREN
echo ======================================================================
echo.
echo Generiere saemtliche Dialog-Audios aus data\story.json neu...
cd /d "%~dp0"
"%LOCALAPPDATA%\Programs\Python\Python312\python.exe" tools\generate_all_voices.py
echo.
echo Generiere Intro-, Verdaechtigen- und Outro-Audios...
"%LOCALAPPDATA%\Programs\Python\Python312\python.exe" tools\generate_story_voices.py
echo.
echo ======================================================================
echo   FERTIG! Alle Dialog- und Story-Audios sind auf dem neuesten Stand.
echo ======================================================================
echo.
pause
