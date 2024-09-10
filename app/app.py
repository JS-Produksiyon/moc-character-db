# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database

    File name: ncm.py
    Date Created: 2024-09-03
    Date Modified: 2024-09-10
    Python version: 3.11+
"""
__author__ = "Josh Wibberley (JMW)"
__copyright__ = "Copyright © 2024 JS Prodüksiyon"
__credits__ = ["Josh Wibberley"]
__license__ = "Proprietary"
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
    sys.exit("Python %s.%s or later is required to run Pulsar.\n" % MIN_PYTHON)

# import dependencies
import os, json
from flask import Flask, current_app

# Import blueprints


# Import extensions
from flask_babel import Babel, gettext as _, ngettext
from flask_sqlalchemy import SQLAlchemy
from flask_debugtoolbar import DebugToolbarExtension
from flask_wtf import CSRFProtect
from jinja2 import Environment

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
        BABEL_DEFAULT_LOCALE = 'en',
        BABEL_TRANSLATION_DIRECTORIES = 'languages',
        APP_LANGUAGE = 'en'
    )

    # enable babel
    babel = Babel(app)

    babel.init_app(app, locale_selector=get_locale)
    
    env = Environment(extensions=['jinja2.ext.i18n'])
    env.install_gettext_callables(_, ngettext)

    try:
        app.config.from_file('settings.json', load=json.load)
        app.config['MOCDB_SETUP'] = True
    except:
        create_app_settings(app, babel)    

    return app


def create_app_settings(app, babel):
    """
    Triggers and manages the setup processes for the app

    :param app: the main application to work upon
    :type  app: Flask object
    """
    from flask import render_template, request
    from lib.util_randomstr import randomString

    app.config['MOCDB_SETUP'] = False

    # Create instance folder
    if not os.path.exists(app.instance_path):
        try:
            os.makedirs(app.instance_path)
        except OSError:
            print('Unable to create directory to contain the settings file. Please ensure you have proper write permissions in the base directory.')
            print('Unable to execute the Men of Courage Character Database application. Terminating...')
            exit()


    @app.route("/", methods=['GET'])
    def setup_page():
        postgres = '' #'disabled'
        mariadb = '' #'disabled'
        mysql = '' #'disabled'
        random_secret = randomString('alphanumeric', strLength=48)

        return render_template('setup.html.jinja', has_postgres=postgres, has_mariadb=mariadb, has_mysql=mysql, secret=random_secret)
        

    @app.route("/setup", methods=['POST'])
    def save_setup():
        return request

def get_locale():
    """
    Returns the locale that was set by the application
    """
    return current_app.config.get('APP_LANGUAGE')
