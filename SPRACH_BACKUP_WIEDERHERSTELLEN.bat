@echo off
cls
echo ======================================================================
echo    DER PAKT DER SCHLAPPEN-ERBEN: SPRACH-BACKUP WIEDERHERSTELLEN
echo ======================================================================
echo.
echo WARNUNG:
echo Dieser Vorgang stellt alle Texte, Dialogbaeume und Sprachverknuepfungen
echo aus dem Sprach-Backup-Ordner (backup\) wieder her.
echo.
echo Wiederherzustellende Dateien:
echo   - data\story.json    (aus backup\SPRACH_BACKUP_story_dialoge.json)
echo   - data\stations.json (aus backup\SPRACH_BACKUP_stations.json)
echo   - data\events.json   (aus backup\SPRACH_BACKUP_events.json)
echo   - data\final.json    (aus backup\SPRACH_BACKUP_final.json)
echo.
set /p confirm="Moechten Sie das Sprach-Backup jetzt wiederherstellen? (J/N): "
if /i not "%confirm%"=="J" (
    echo.
    echo Vorgang abgebrochen. Keine Aenderungen vorgenommen.
    pause
    exit /b
)

echo.
echo Kopiere Sprach-Backup-Dateien zurueck nach data\...
cd /d "%~dp0"

if exist "backup\SPRACH_BACKUP_story_dialoge.json" (
    copy /y "backup\SPRACH_BACKUP_story_dialoge.json" "data\story.json" >nul
    echo   [OK] data\story.json erfolgreich aus Sprach-Backup wiederhergestellt.
) else (
    echo   [FEHLER] backup\SPRACH_BACKUP_story_dialoge.json wurde nicht gefunden!
)

if exist "backup\SPRACH_BACKUP_stations.json" (
    copy /y "backup\SPRACH_BACKUP_stations.json" "data\stations.json" >nul
    echo   [OK] data\stations.json erfolgreich wiederhergestellt.
)

if exist "backup\SPRACH_BACKUP_events.json" (
    copy /y "backup\SPRACH_BACKUP_events.json" "data\events.json" >nul
    echo   [OK] data\events.json erfolgreich wiederhergestellt.
)

if exist "backup\SPRACH_BACKUP_final.json" (
    copy /y "backup\SPRACH_BACKUP_final.json" "data\final.json" >nul
    echo   [OK] data\final.json erfolgreich wiederhergestellt.
)

echo.
echo ======================================================================
echo   SPRACH-BACKUP ERFOLGREICH WIEDERHERGESTELLT!
echo   Saemtliche Dialoge und Texte sind wieder im gesicherten Zustand.
echo ======================================================================
echo.
pause
