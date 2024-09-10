@echo off
cd app
flask --debug run --extra-files static/style.css:static/*.js
