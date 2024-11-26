@echo off
REM Enter directory where batch file is located
cd /d %~dp0

echo.
echo Setting up the Men of Courage Character Database
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
    goto failure
) else if %MAJOR% EQU 3 (
    if %MINOR% LSS 11 (
        goto failure
    ) else (
        goto letsGo
    )
) ELSE (
    goto letsGo
)

:failure
echo Python 3.11 or greater is requred for the Men of Courage character database to work.
echo This batch file can only install the standalone database on 
echo Windows if python 3.11 or greater is installed
echo.
goto end

:letsGo
REM Check if the venv folder does not exist
IF NOT EXIST "venv" (
    echo Creating Python 3.11 virtual environment.
    echo This may take a few minutes depending on the speed of your machine.
    echo.
    python -m venv venv --prompt="moccdb"
    IF EXIT "venv" (
        echo Python virtual environment installed.
        echo.
    ) ELSE (
        echo Unable to install virtual environment. Please check the README.md file
        echo and try to install it manually.
        pause
        exit /b
    )
    echo Installing required packages
    echo.
    call venv/Scripts/activate.bat
    pip install -r requirements.txt
    echo.

    IF ERRORLEVEL 1 (
        echo Errors have occured while trying to install the required packages.
        echo Please check the errors and try installing the packages manually. Refer
        echo to README.md in the Git repository for how to do this.
    ) ELSE (
        echo The required packages have installed successfully.
        echo.
    )
) ELSE (
    echo Python 3.11 virtual environment is already created and the application
    echo is ready to be used.
    echo.
)

REM Check if the instance/settings.json file does not exist
IF EXIST "instance\settings.json" (
    echo An instance of the Men of Courage Character Database settings file
    echo has been found on your hard drive. The database will start up with the 
    echo previously created settings. If you wish to use a different setup, please
    echo delete the instance\settings.json file so the database triggers the setup
    echo feature again.
    echo.
    echo If you delete the instance\settings.json file, it is also strongly
    echo recommended to ^(re^)move the instance\moccharacters.db file, as it changing
    echo the database language may adversely affect the previously extant database.
    echo.
    
) ELSE (
    echo.
)

echo The Men of Courage Character Database is ready for use. You can start it
echo by executing .\startmoccdb.bat
echo.

:end
REM Pause execution until Enter is pressed
pause
