# Men of Courage Character Database

Version: 1.0.0

Latest Update: 2024-12-02

This database is designed to track characters used in a Men of Courage localized program (radio or other visual medium). It is designed to be multilingual and to conform to the needs of the target language and culture with a minimum of effort to [translate the interface](TRANSLATE.md). 

Currently the database is available in the following languages:

* English (US)
* Turkish

**The Men of Courage Character Database *is not meant to be hosted on the open internet!* It is designed for use on personal machines or on your local network (intranet).**

The Men of Courage Character Database runs on Python 3.11 or higher and you interact with it in your web browser. Thus, it can be run on any desktop operating system that supports Python 3.11 or higher (Windows, MacOS , and many Linux flavors). 

> It is not recommended to use the Men of Courage Character Database on a mobile phone, as the screen is too small. It will work fine on a tablet, though.

The back end runs on Python/Flask and a SQLite database by default. It can also be connected to MySQL, MariaDb or PostgreSQL. The frontend is HTML served by Python-Flask for localization with Bootstrap for design look and feel and JavaScript to handle the interactions. 


## Requirements to run the Men of Courage Character Database

* Python 3.11, which works best on:
    
    * Windows 10 or 11
    * MacOS 11 and higher
    * Linux with a kernel of 5.10 or higher (e.g. Ubuntu 21.04 or Manjaro 21.0).

* The knowledge of how to download a ZIP file and decompress (unzip) it.
* On Windows: The ability to run a batch file by double-clicking it in Explorer.
* On MacOS/Linux: Experience in using the Terminal.

The instructions below are quite detailed, so you should be able to do this with a minimal amount of computer knowhow.

## Setup
Download or clone the repository using the green Code button above. Non-technical users are recommended to download the ZIP and extract it in a location where the `moc-character-db` directory is easily accessible, but won't be deleted by accident. Then, depending on your operating system (OS), you can continue with the setup as detailed below.

### Windows Automated Setup
Run `setupmoccdb.bat` either by double-clicking the file in an Explorer window, or by opening a command prompt (cmd.exe), navigating to the `moc-character-db` folder and running the batch file from the command prompt by typing its name in and executing it.

> Note: if you are using PowerShell, you'll need to execute the command as `.\setupmoccdb.bat`.


### Manual setup (all OSes)
1. Launch a terminal or command prompt (cmd.exe) window and navigate to the `moc-character-db` directory.

2. Create a Python virtual environment.

        python3 -m venv venv --prompt=moccdb

3. Enter the virtual environment using the requisite code on your OS.

    Windows: `venv/Scripts/activate.bat`

    MacOS/Linux: `source /venv/bin/activate`

4. Load the required packages.

        pip install -r requirements.txt


### Using a Database other than SQLite
If you're going to use a database other than SQLite, load the database-specific packages from PyPi in the virtual environment:

MariaDB: `pip install mariadb`

MySQL: `pip install flask-mysqldb`

PostgreSQL: `pip install psycopg2-binary`

Note that these packages will require you to have the related database and/or OS-specific necessary connector software installed on your machine. Please consult the relevant documentation for the database of your choice on how to do this.

## Usage
### Starting Up the Standalone Versions
#### Windows
Run the batch file `startmoccdb.bat`.

#### Other Operating Systems
1. Make sure you are in the `moc-character-db` directory.

2. Activate the virtual environment, if necessary:

    Windows: `venv/Scripts/activate.bat`

    MacOS/Linux: `source /venv/bin/activate`


3. Run the python executable:

        python moccdb.py

4. Point your browser to http://localhost:13153 to access the database interface

> See [Working with the Database](#working-with-the-database) below for how to access the database and use it.

---

### Hosting the Men of Courage Database on a Network
The application is designed with simplicity in mind and **IS NOT MEANT TO BE EXPOSED TO THE INTERNET**! As such there is **no security** built into the application. If you host it on the internet, it is up to you to secure the application.

* [Instructions for setting up WSGI on Apache webserver](webserver-config/apache/README.md)
* [Instructions for setting up with gunicorn and (optionally) nginx](webserver-config/gunicorn/README.md)

It is possible to set up your database locally and then copy the files in the local `instance` folder to the remote `instance` folder, thus carrying your data over to the networked instance of the Men of Courage Database

#### Docker
There is currently no Docker image available. You are, however, welcome to package the database to run in a Docker image with gunicorn.

---
### Working with the Database:
#### First run
On first run select your language and database of choice. Then you will be required to restart the application to access the newly created database. 

When you have accessed the main (Characters) page, be sure to navigate to the Relationships page and pre-load the default relationships or create your own. The database is much more useful with the relationships.

#### General Usage
The interface is quite straightforward and all options are documented. Below are a few pointers to make your use of the database more 

Use the **Characters** link to manage the various characters you wish to create. 

* For the head and body shots of the character, it is recommended to use images in the 16:9 format (e.g. 1920x1080 or 1200x768).

* To connect to characters in a relationship, at least one of the characters must already exist in the database. It is recommended to create the first character without any relationships, then add the second character and define the relationship to the first character when saving the second character. The reciprocal relationship with the first character will automatically be created (provided the *Reciprocal Relationship* checkbox is checked).

* Episodes can be added directly from the Add Episode button on the Character page.

* Character information will not be saved, unless you click the Save Character button at the bottom of the form. You can tell if a character's data is unsaved by the blue person icon in the lower right-hand corner (lower left in right-to-left langauges).

* The Characters page will also allow you to delete a given character. If you delete that character, the database will automatically remove all relationships associated with the character. Episodes, however, will remain in the system.

Use the **Episodes** link to manage the Episodes of Men of Courage in which your characters appear.

Use the **Relationships** link to manage the relationships that exist between the various characters.


## Localization (Translation)
The database comes with localization for the following languages:

* English (US)
* Turkish

> **Please note:** the database will work in a given localized language. *It will NOT allow switching back and forth between languages!* Once you select a language on setup the entire database will be populated with entries for that language only. This is especially true for the relationships.

If you want to have the database in multiple languages, please extract it to multiple directories and set up a different language in each instance.

To translate the database into a new language, please consult the [TRANSLATION.md](TRANSLATION.md) file.

## Miscellaneous

Port: 13153 = moc

Developers can run the database in developer mode in Windows using the command 

    startmoccdb.bat dev 

or by entering the app directory in virtual environment mode and executing 

    flask --debug run --extra-files static/style.css:static/*.js

---
Updated: 2025-01-13