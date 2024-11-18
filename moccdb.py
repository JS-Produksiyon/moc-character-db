# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database 
    Waitress Startup Script

    File name: moccdb.py
    Date Created: 2024-11-18
    Date Modified: 2024-11-18
    Python version: 3.11+
"""
__author__ = "Josh Wibberley (JMW)"
__copyright__ = "Copyright © 2024 JS Prodüksiyon"
__credits__ = ["Josh Wibberley"]
__license__ = "GNU GPL 3.0"
__version__ = "1.0.0"
__maintainer__ = ["Josh Wibberley"]
__email__ = "jmw@hawke-ai.com"
__status__ = "Production"
# ================================================================================
# Check for python version
import sys

MIN_PYTHON = (3,11)
if sys.version_info < MIN_PYTHON:
    sys.exit("Python %s.%s or later is required to run the Men of Courage Character Database.\n" % MIN_PYTHON)

from app.app import create_app

app = create_app()

if __name__ == '__main__':
    from waitress import serve
    print("Men of Courage Character Database is running.")
    if sys.platform == 'win32':
        print("To shut down the database, press [Ctrl]+[C] or close this window.")
    else:
        print("Press [Ctrl]+[C] to shut the database down.")

    print(' ')
    print('The Men of Courage Character Database can be accessed in your web browser from http://127.0.0.1:13153')

    serve(app, host='0.0.0.0', port=13153, threads=4)
