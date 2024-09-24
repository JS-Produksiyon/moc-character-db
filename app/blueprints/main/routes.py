# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database API calls

    File name: blueprints/main/routes.py
    Date Created: 2024-09-12
    Date Modified: 2024-09-12
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
import os, re, json, datetime
from flask import(
    Blueprint, config, redirect, request, url_for, current_app, render_template
)

page = Blueprint('page', __name__, template_folder='templates')

@page.route('/')
def main_page():
    jsFiles = []
    for f in (os.listdir(os.path.join(current_app.root_path, 'static'))):
        if f.startswith('ui.') and f != 'ui.js':
            jsFiles.append(f)
    jsFiles.append('ui.js')
    return render_template('main.html.jinja', js_files=jsFiles)

