@echo off
REM Enter directory where batch file is located
cd /d %~dp0

echo.
echo Setting up the Men of Courage Character Database
echo ------------------------------------------------
echo.

REM check for python 3.11 
python --version 2>&1 | find "3.11" >nul

IF ERRORLEVEL 1 (
    echo Python 3.11 or greater is requred for the Men of Courage character database to work.
    echo This batch file can only install the standalone database on 
    echo Windows if python 3.11 is installed. If you are running a newer version
    echo please manually install the Men of Courage database using the directions
    echo in the Git repository.
    echo.
) ELSE (
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
    echo by executing .\startmocdb.bat
    echo.

)
REM Pause execution until Enter is pressed
pause
