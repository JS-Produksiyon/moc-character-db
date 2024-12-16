# Setting up Men of Character Database on an Apache WSGI webserver
The descriptions here assume a LAMP server running Apache 2.4. These commands were tested on Debian 12, so they should work on any Debian derivative of the same vintage. If you use another flavor of Linux your mileage may vary.

## Software Requirements:

* Apache 2.4
* Apache 2.4 developer library
* Python 3.11

## Setting up the MoC Character Database
These instructions assume that the moc-character-db repository is located in `/var/www`. It is best to clone the repository here directly, [install it](../../README.md#manual-setup-all-oses) according to the instructions, and then follow the steps in [Other Operating Systems](../../README.md#other-operating-systems) to verify the installation works.

Copy `webserver-config/apache/moccdb.wsgi` into the repository root. (It should be in the same location as moccdb.py.)

## Installing Apache WSGI Prerequisites
Assuming we have python 3.11 installed, we install the necessary Apache WSGI module with the following command:

    sudo apt install libapache2-mod-wsgi-py3

Then we enable it using:

    sudo a2enmod wsgi

Make sure that the *apache2-dev* package is installed for the next step.

Install the mod_wsgi module in the virtual environment.

    pip install mod_wsgi

## Configuring Apache
First, open `/etc/apache2/mods-available/wsgi.conf` and add the following lines:

    WSGIPythonPath /var/www/moc-character-db:/var/www/moc-character-db/venv:/var/www/moc-character-db/venv/lib/python3.11/site-packages

Then, open `/etc/apache2/mods-available/wsgi.load`. Comment out the current line beginning with LoadModule, then add the following two lines:

    LoadModule wsgi_module "/var/www/moc-character-db/venv/lib/python3.11/site-packages/mod_wsgi/server/mod_wsgi-py311.cpython-311-x86_64-linux-gnu.so"
    WSGIPythonHome "/var/www/moc-character-db/venv"

This file, `mod_wsgi-py311.cpython-311-x86_64-linux-gnu.so`, is to be used on x64 processors. If you are running your website on a different architecture (like ARM), check the full name of the file before pasting it and adjust the file accordingly (e.g. on a Raspberry PI, the file is called `mod_wsgi-py311.cpython-311-aarch64-linux-gnu.so`).


Copy `webserver-config\apache\moccdb-apache.conf` to `/etc/apache2/sites-available`, edit the `ServerName` directive in the file to point to your own server's domain, then link to the `.conf` file from `/etc/apache2/sites-enabled`. 

Add the following command to `/etc/apache2/ports.conf`

    Listen *:13153 http

Restart the apache server.

In a web browser load the main page of the character database. 

---
Last Updated: 2024-12-11