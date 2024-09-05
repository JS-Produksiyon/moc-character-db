# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database

    File name: ncm.py
    Date Created: 2024-09-03
    Date Modified: 2024-09-03
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
from flask import Flask


# Import blueprints


# Import extensions


# Initialize app
def create_app(test_config=None):
    """
    Base Flask Application

    :param test_config: whether or not to use the test configuration
    :type  test_config: boolean
    """
    app = Flask(__name__, instance_relative_config=True)
    
    # base configuration values
    app.config.update(
        DEBUG=__debugState__,
        TESTING=__debugState__,
        SECRET_KEY='JS-Produksiyon-dev-2024'
    )

    try:
        app.config.from_file('settings.json', load=json.load)
        app.config['MOCDB_SETUP'] = True
    except:
        create_app_settings(app)    

    return app


def create_app_settings(app):
    """
    Triggers and manages the setup processes for the app

    :param app: the main application to work upon
    :type  app: Flask object
    """

    print('run setup script')
    app.config['MOCDB_SETUP'] = False

    print(app.config)

    @app.route("/setup", methods=['GET', 'POST'])
    def setup_page():
        return "Displays Setup Page"

