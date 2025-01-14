# Setting up Men of Character Database with gunicorn and nginx
These commands were tested on Debian 12, so they should work on any Debian derivatie of the same vintage. If you use another flavor of Linux your mileage may vary.

## Software Requirements:

* Gunicorn 23.0^
* nginx 1.22
* Python 3.11 

## Setting up the MoC Character Database
These instructions assume that the moc-character-db repository is located in `/var/www`. It is best to clone the repository here directly, [install it](../../README.md#manual-setup-all-oses) according to the instructions, and then follow the steps in [Other Operating Systems](../../README.md#other-operating-systems) to verify the installation works.

Make sure that the Linux web service users that will run the database have write access to the `instance` directory and all that is in it. It is best to run the following command in the `/var/www/moc-character-db` directory.

    sudo chown -R www-data:www-data instance

Then the application will work properly.


## Installing the Gunicorn prerequisites
Assuming we have python 3.11 installed and are in the virtual environment, install the gunicorn module with the following command:

    pip install Gunicorn

At this point you can run the moc-character-db directly with the command executed from within the moc-character-db directory:

    gunicorn -w 4 -b 0.0.0.0:13153 'app.app:create_app()'


## Setting up the Gunicorn service
Edit the *moccdb.service* file in `webserver-config/gunicorn` directory to be tailored to where you cloned the MoC Character Database to. If you installed the database at `/var/www/moc-character-db`, then you do not need to edit it.

Copy *moccdb.service* to `/etc/systemd/system`.

Execute the following command from the command line:

    sudo systemctl start moccdb

Check to see if the database is running by connecting to `http://<your server ip>:13153`. If the database setup page comes up, you are ready to go on your intranet. To make sure that the application starts up each time you restart server you can run 

    sudo systemctl enable moccdb

## Serving Gunicorn with Nginx
While the Gunicorn-served version of the Character Database should suffice for any internal network and you can easily access the interface by simply pointing your browser to the proper port, you may want to serve the database up at port 80 or add SSL and serve it on port 443. This can be accomplished by copying the code below into a file called `moccdb` in the `/etc/nginx/sites-available` folder

    server {
       listen 80;
        server_name your_domain www.your_domain;

        location / {
            include proxy_params;
            proxy_pass http://127.0.0.1:13153;
        }
    }

Link to the file to `/etc/nginx/sites-available` and restart the nginx process. The Men of Courage Database will now be accessbible

---
2025-01-13