# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database API calls

    File name: blueprints/api/calls.py
    Date Created: 2024-09-12
    Date Modified: 2024-09-24
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
import os, re, datetime
from flask import(
    Blueprint, jsonify, config, redirect, request, url_for, current_app
)
from flask_babel import lazy_gettext as _
from app.blueprints.api.models import (Character, Episode, Relationship, RelationTypes, Residence, Actor)
from app.languages.jsstrings import JS_STRINGS

api = Blueprint('api', __name__, url_prefix='/api')

# define routes
@api.route('/fetch', methods=['GET', 'POST'])
def fetch_from_db():
    """
    Fetches data from the database

    :arg what: Defines what to fetch: actors, character, character_list, episodes, relation_types or residence
    :arg id  : used with characters to fetch individual character data
    :returns : JSON string
    """
    out = {}
    what = request.args.get('what')
    
    if what == 'actors':
        query = Actor.query.order_by(Actor.name)
        if query.count() > 0:
            pass

    elif what == 'character':
        try:
            id = int(request.args.get('id'))
        except (TypeError, ValueError):
            return jsonify({'error':'character_invalid_id'})
        
        out = {'character':id}

    elif what == 'character_list':
        query = Character.query.order_by(Character.first_name, Character.last_name)
        if query.count() > 0:
            pass
        

    elif what == 'episodes':
        query = Episode.query.order_by(Episode.id)
        if query.count() > 0:
            pass

    elif what == 'relation_types':
        query = RelationTypes.query.order_by(RelationTypes.name)
        if query.count() > 0:
            pass

    elif what == 'residence':
        query = Residence.query.order_by(Residence.name)
        if query.count() > 0:
            pass
    else:
        what = 'error'
        out = 'invalid_query'

    return jsonify({what:out})


@api.route('/imageupload', methods=['POST'])
def temp_image_upload():
    """
    Temporarily uploads and validates an image

    :returns: JSON string containing base64-encoded image
    """
    pass


@api.route('/jsstrings', methods=['GET'])
def localized_js_strings():
    """
    Returns the localized JavaScript strings
    """
    return jsonify(JS_STRINGS)


@api.route('/write', methods=['POST'])
def write_to_db():
    """
    Writes sent data to the database
    """
    if request.args.get('what') == 'actors':
        return jsonify({'success': True});
