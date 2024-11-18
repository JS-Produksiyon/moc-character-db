# Men of Courage Character Development Database

Version: 0.1

This database is designed to track characters used in Men of Courage localization. The backend runs on Python/Flask and a SQLite database by default. It can also be connected to MySQL, MariaDb or Postgresql. The frontend is HTML served by PHP for localization with Bootstrap for design look and feel and JavaScript to handle the interactions.

## Backend Minimum System Requirements

* Python 3.8


## Setup
Download the repository.

### Windows Automated Setup
Run `setupmocdb.bat` either by double-clicking in an Explorer window, or by opening a command prompt (cmd.exe), navigating to the folder and running the batch file from the command prompt by typing its name in and executing it.

> Note: if you are using PowerShell, you'll need to execute the command as `.\setupmocdb.bat`.


### Manual setup
`setupmocdb.bat` completes the following steps:

Create a virtual environment

    python3 -m venv venv --prompt=mocdb

Enter the virtual environment using the requisite code on your OS.

Windows: `venv/Scripts/activate.bat`

Linux / MacOS: `source /venv/bin/activate`

Load the requirements:

    pip install -r requirements.txt


### Using a Database other than SQLite
If you're going to use a database other than SQLite, load the database-specific packages from PyPi:

MariaDB: `pip install mariadb`

MySQL: `pip install flask-mysqldb`

PostgreSQL: `pip install psycopg2-binary`


## Usage
### Standalone
#### Windows
Run the batch file `startmoc.bat`.

#### Other Operating Systems
Make sure you are in the `moc-character-db` directory.

Run the python executable:

    python moccdb.py

Point your browser to `http://localhost:13153`.

On first run select your language and database of choice.

### On a Network
The application is designed with simplicity in mind and **IS NOT MEANT TO BE EXPOSED TO THE INTERNET**! As such there is **no security** built into the application. 

### WSGI on Apache


### Gunicorn and nginx


### Docker
There is currently no Docker image available. You are, however, welcome to package the database to run in a Docker image with gunicorn.


## Localization
The database comes with localization for the following languages:

* English (US)
* Turkish

> Please note: the database will work in a given localized language. It will NOT allow switching back and forth between languages! Once you select a language on setup the entire database will be populated with entries for that language only. This is especially true for the relationships.

To localize to a new language, execute the following command from the repository root:

    pybabel init -i ./app/languages/messages.pot -d ./app/languages -l [language]

Translate the strings in the .po file and then compile using:

    pybabel compile -d ./app/languages


Once these have been compiled, edit `app/static/setup_strings.js` to add the new language to the strings stored there.

Extracting strings (from repository root):
    
    pybabel extract -F babel.cfg -o ./app/languages/messages.pot ./app

Updating existing translation strings:

     pybabel update -i ./app/languages/messages.pot -d ./app/languages -l [language]

Port: 13153 = moc
---
Updated: 2024-09-03