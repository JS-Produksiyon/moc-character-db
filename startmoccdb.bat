@echo off
cd /d %~dp0

echo.
echo Starting up the Men of Courage Character Database
echo ------------------------------------------------
echo.

REM Check if Python is installed and get its version
set VERSION=
for /f "tokens=2 delims= " %%i in ('python --version 2^>^&1') do set VERSION=%%i

REM Check if the VERSION variable is empty (Python is not installed)
if "%VERSION%"=="" (
    echo Python is not installed.
    pause
    exit /b
)

REM Split the version number into major, minor, and patch components
for /f "tokens=1,2,3 delims=." %%a in ("%VERSION%") do (
    set MAJOR=%%a
    set MINOR=%%b
    set PATCH=%%c
)

REM Check if the Python version is 3.11 or greater
if %MAJOR% LSS 3 (
    echo Python 3.11 or greater is not installed. Men of Courage Character Database will not run.
) else if %MAJOR% EQU 3 (
    if %MINOR% LSS 11 (
        echo Python 3.11 or greater is not installed. Men of Courage Character Database will not run.
    ) else (
        goto letsGo
    )
) ELSE (
    goto letsGo
)

:letsGo
IF EXIST "venv" (
    call venv/Scripts/activate.bat
) ELSE (
    echo The Men of Courage Character Database requires the proper python virtual environment
    echo to work. That virtual environment could not be found. Terminating the application.
    exit /b
)

REM Check if the first argument is "dev"
if "%1"=="dev" (
    echo Starting the database in debug mode
    cd app
    flask --debug run --extra-files static/style.css:static/*.js
    cd /d %~dp0
    call deactivate
) else (
    python moccdb.py        
    call deactivate
)
echo.
echo The Men of Courage Character Database has been shut down.
echo Good bye!
echo.