# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database API calls

    File name: blueprints/main/routes.py
    Date Created: 2024-09-12
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
__status__ = "Production"
# ================================================================================
import os, re, json, datetime, importlib
from flask import(
    Blueprint, config, redirect, request, url_for, current_app, render_template, jsonify
)
from app.blueprints.api.models import RelationTypes
from app.languages.jsstrings import JS_STRINGS;

page = Blueprint('page', __name__, template_folder='templates')

@page.route('/db/')
def main_page():  
    # load JavaScript Files
    jsFiles = ['ui.js']
    for f in (os.listdir(os.path.join(current_app.root_path, 'static'))):
        if f.startswith('ui.') and f != 'ui.js':
            jsFiles.append(f)

    # prepare default relationship list
    relationList = {}
    meshedRelationList = []

    if RelationTypes.query.count() < 1:
        relationListModule = f"app.languages.{current_app.config['APP_LANGUAGE']}.relation_list" if current_app.config['APP_LANGUAGE'] != 'en' else "app.languages.relation_list"

        try:
            relationList = importlib.import_module(relationListModule)

            sortRelations = sorted(relationList.RELATIONSHIP_STRINGS.items(), key=lambda item: item[1]);

            for item in sortRelations:
                row = {'name': item[1], 'reciprocal_male': '', 'reciprocal_female': ''}
                row['reciprocal_male'] = '' if relationList.RECIPROCAL_RELATIONSHIPS[item[0]]['male'] == '' else relationList.RELATIONSHIP_STRINGS[relationList.RECIPROCAL_RELATIONSHIPS[item[0]]['male']]
                row['reciprocal_female'] = '' if relationList.RECIPROCAL_RELATIONSHIPS[item[0]]['female'] == '' else relationList.RELATIONSHIP_STRINGS[relationList.RECIPROCAL_RELATIONSHIPS[item[0]]['female']]
                meshedRelationList.append(row)

        except ModuleNotFoundError:
            print(f"Could not import module {relationListModule}")
            pass # do nothing...

    return render_template('main.html.jinja', js_files=jsFiles, js_strings=JS_STRINGS, relation_list=meshedRelationList)

@page.route('/wsgi-environment')
def wsgi_environment():
    # Retrieve the WSGI environment variables
    wsgi_env = request.environ
    # Convert the environment variables to a dictionary
    wsgi_env_dict = {key: str(value) for key, value in wsgi_env.items()}
    # Return the environment variables as a JSON response
    print (request.environ['SERVER_NAME'])
    print(request.environ['SERVER_PORT'])

    return jsonify(wsgi_env_dict)

