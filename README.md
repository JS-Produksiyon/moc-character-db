# Men of Courage Character Development Database

This database is designed to track characters used in Men of Courage localization. The backend runs on PHP and a MariaDB (MySQL) database. The frontend is HTML served by PHP for localization with Bootstrap for design look and feel and JavaScript to handle the interactions.

## Backend Minimum System Requirements

* PHP: 8.2
* MariaDB: 10.5


## Setup
Download or clone the repository to your machine. Either install the `web` folder to your server and edit `settings.php` to connect it to your local database. Or else using [Lando](https://devwithlando.io), start the lando package.

The interface language defaults to English. The default language can be set in `settings.php` (see documentation there) and can be set before the database is activated.

## Localization
The database comes with localization for the following languages:

* English (US)
* Turkish

