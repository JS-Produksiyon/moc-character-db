@echo off
REM Check if the first argument is "dev"
if "%1"=="dev" (
    cd app
    flask --debug run --extra-files static/style.css:static/*.js
) else (
    cd app
    flask run --extra-files static/style.css:static/*.js
)
