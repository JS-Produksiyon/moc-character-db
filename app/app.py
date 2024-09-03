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
import os
from flask import Flask


# Import blueprints


# Import extensions


# Initialize app
def create_app(test_config=None):
    """
    Base Flask Application
    """
    app = Flask(__name__, instance_relative_config=True)
    
    # base configuration values
    app.config.update(
        DEBUG=__debugState__,
        TESTING=__debugState__,
        SECRET_KEY='JS-Produksiyon-dev-2024'
    )



    return app