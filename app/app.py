# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database

    File name: app.py
    Date Created: 2024-09-03
    Date Modified: 2024-11-26
    Python version: 3.11+
"""
__author__ = "Josh Wibberley (JMW)"
__copyright__ = "Copyright © 2024 JS Prodüksiyon"
__credits__ = ["Josh Wibberley"]
__license__ = "GNU GPL 3.0"
__version__ = "1.0.0"
__maintainer__ = ["Josh Wibberley"]
__email__ = "jmw@hawke-ai.com"
__status__ = "Development"
__debugState__ = True
# ================================================================================
# Check for python version
import sys

MIN_PYTHON = (3,11)
if sys.version_info < MIN_PYTHON:
    sys.exit("Python %s.%s or later is required to run the Men of Courage Character Database.\n" % MIN_PYTHON)

# import dependencies
import os, json
from flask import Flask, current_app, redirect, request

# Import extensions
from flask_babel import Babel, gettext as _, ngettext
from flask_sqlalchemy import SQLAlchemy
from flask_debugtoolbar import DebugToolbarExtension
from flask_wtf import CSRFProtect
from jinja2 import Environment
from babel import Locale

# Import Blueprints
from app.blueprints.api import api
from app.blueprints.main import page

# initialize global db
from app.db import db

# Initialize app
def create_app(test_config=None):
    """
    Base Flask Application

    :param test_config: whether or not to use the test configuration
    :type  test_config: boolean
    """
    app = Flask(__name__, static_url_path='/assets', instance_relative_config=True, template_folder='templates')
    
    # base configuration values
    app.config.update(
        DEBUG=__debugState__,
        TESTING=__debugState__,
        SECRET_KEY='JS-Produksiyon-dev-2024',
        BABEL_DEFAULT_LOCALE='en',
        BABEL_TRANSLATION_DIRECTORIES='languages',
        APP_LANGUAGE='en'
    )

    # enable CSRF Protection 
    csrf = CSRFProtect(app)

    # enable babel
    babel = Babel(app)
    babel.init_app(app, locale_selector=get_locale)
    env = Environment(extensions=['jinja2.ext.i18n'])
    env.install_gettext_callables(_, ngettext)

    try:
        app.register_blueprint(page)
        app.register_blueprint(api)
        app.config.from_file('settings.json', load=json.load)
        app.config['MOCDB_SETUP'] = True
        db.init_app(app)

        with app.app_context():
            db.create_all()
        
    except:
        create_app_settings(app, babel)    

    # this is here so that we can reroute to setup if necessary. 
    # I kind of hate to put a directory in front of what should run off the route, but
    # this is probably the simplest and most fool-proof method to allow on-the fly 
    # setup with Flask's route() function.
    @app.route('/')
    def main_route():
        if app.config['MOCDB_SETUP']:
            return redirect('/db/')            # this loads the database. Make sure there is the extra slash on the end!
        else:
            return redirect('/setup')          # this loads the setup page

    @app.context_processor
    def mocdb_context_utility():
        def get_language_code() -> str:
            return app.config.get('APP_LANGUAGE')

        def get_text_direction() -> str:
            lang = Locale(app.config.get('APP_LANGUAGE'))
            return lang.text_direction

        return dict(language_code=get_language_code, text_direction=get_text_direction)

    return app


def create_app_settings(app, babel):
    """
    Triggers and manages the setup processes for the app

    :param app: the main application to work upon
    :type  app: Flask object
    """
    import re
    from flask import render_template, request
    from utils.util_randomstr import randomString

    app.config['MOCDB_SETUP'] = False

    # Create instance folder
    if not os.path.exists(app.instance_path):
        try:
            os.makedirs(app.instance_path)
        except OSError:
            print('Unable to create directory to contain the settings file. Please ensure you have proper write permissions in the base directory.')
            print('Unable to execute the Men of Courage Character Database application. Terminating...')
            exit()


    @app.route("/setup", methods=['GET'])
    def setup_page():
        import pkg_resources

        # instantiate variables
        postgresql = 'disabled'
        mariadb = 'disabled'
        mysql = 'disabled'
        random_secret = randomString('alphanumeric', strLength=48)

        # iterate through installed packages to check for database connectors
        for pkg in pkg_resources.working_set:
            if 'psycopg2-binary' in pkg.key:
                postgresql = ''

            if 'mariadb' in pkg.key:
                mariadb = ''

            if 'flask-mysqldb' in pkg.key:
                mysql = ''

        return render_template('setup.html.jinja', has_postgresql=postgresql, has_mariadb=mariadb, has_mysql=mysql, secret=random_secret)
        

    @app.route("/do-setup", methods=['GET','POST'])
    def save_settings():
        """
        Save and apply passed settings.
        """
        dbTypes = ['sqlite', 'postgres', 'mariadb', 'mysql']
        fnValidChars = "^[\w\-\.\$\&()\[\]\{\}!@#,]+$"
        success = False     # defines whether we
        error='general'     # defines
        
        # validate form content
        if (len(request.form) == 11) and (type(request.form['language']) == str and len(request.form['language'])  == 2) and (request.form['db_type'] in dbTypes) and (len(request.form['secret_key']) < 1 or len(request.form['secret_key']) > 12):

            # validate specifically for sqlite
            if (request.form['db_type'] == 'sqlite') and (len(request.form['sqlite_db_file']) > 0) and (re.match(fnValidChars, request.form['sqlite_db_file'])):
                success = True

            # validate for all other DB's
            else:
                try:
                    port = int(request.form['db_port'])
                except ValueError:
                    port = 0
                
                if (port > 1000) and (len(request.form['db_host']) > 0) and (re.match(fnValidChars, request.form['db_host'])) and (len(request.form['db_user']) > 0) and (re.match(fnValidChars, request.form['db_user']) )and (len(request.form['db_pwd']) > 4):
                    success = True
        
        if success:
            # generate secret key
            if len(request.form['secret_key']) == 0:
                # we iterate the secret key three times for higher entropy
                for i in range(3): 
                    secretKey = randomString('alphanumeric', strLength=48)
            else:
                secretKey = request.form['secret_key']

            # generate database URI
            SQLiteUri = 'sqlite:///{filename}'
            dbUriTpl = '{engine}://{user}:{pwd}@{host}:{port}/{name}'
            engines = { 'postgres':'postgresql+psycopg2', 
                        'mariadb': 'mariadb+mariadbconnector',
                        'mysql': 'mysql'}

            if (request.form['db_type'] == 'sqlite'):
                dbUri = SQLiteUri.format(filename=request.form['sqlite_db_file'])
                trackMods = False
            else:
                dbUri = dbUriTpl.format(engines=engines[request.form['db_type']], user=request.form['db_user'], pwd=request.form['db_pwd'], host=request.form['db_host'], port=request.form['db_port'], name=request.form['db_name'])
                trackMods = True

            setupObj = {
                        "APP_LANGUAGE" : request.form['language'],
                        "SECRET_KEY" : secretKey,
                        "SQLALCHEMY_DATABASE_URI": dbUri,
                        "SQLALCHEMY_TRACK_MODIFICATIONS": trackMods
                    }
            
            app.config.update(setupObj)

            # write the settings to system
            try:
                with open(os.path.join(app.instance_path, 'settings.json'), 'w', encoding='utf-8') as sf:
                    json.dump(setupObj, sf)

                success = True

            except Exception as e:
                print(f'Settings file write exception occurred: {e}')
                error='write'
        
            # get restart method from environment
            wsgi_server = request.environ['SERVER_SOFTWARE']

            restart_instructions = _('Use the same command to restart the application as you did before.')

            if sys.platform.startswith('win32'):
                if 'Werkzeug' in wsgi_server:
                    restart_instructions = _('You can restart the database application in development mode from the command line using the command {cmd}.').format(cmd='<code>.\startmocdb.bat dev</code>')
                elif 'waitress' in wsgi_server:
                    restart_instructions = _('You can restart the database application by double-clicking the {cmd} icon.').format(cmd="<b>startmocdb.bat</b>")
            else:
                if 'Werkzeug' in wsgi_server:
                    restart_instructions = _('You can restart the database application in development mode from the command line using the command {cmd}.').format(cmd='<code>flask --debug run --extra-files static/style.css:static/*.js</code>')
                elif 'waitress':
                    restart_instructions = _('You can restart the database application from the command line using the command {cmd}.').format(cmd='<code>python3 moccdb.py</code>')
                elif 'Apache' in wsgi_server:
                    restart_instructions = _('The Apache-based WSGI server should restart itself presently. Please wait for a few seconds, then click the Start button below.')
                elif 'gunicorn' in wsgi_server:
                    restart_instructions = _('Restart the gunicorn server that hosts the database application.')

        return render_template('setup-result.html.jinja', success=success, error=error, restart_instructions=restart_instructions)

    @app.route('/shutdown')
    def shutdown_app():
        os._exit(1)

def get_locale():
    """
    Returns the locale that was set by the application
    """
    return current_app.config.get('APP_LANGUAGE')
