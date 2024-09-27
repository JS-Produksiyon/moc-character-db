# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database API calls

    File name: blueprints/api/calls.py
    Date Created: 2024-09-12
    Date Modified: 2024-09-27
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
import os, re, datetime, importlib
from flask import(
    Blueprint, jsonify, config, redirect, request, url_for, current_app
)
from flask_babel import lazy_gettext as _
from utils.util_validators import sanitizeString, validateDataType
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
    count = 0
    what = request.values.get('what')
    
    if what == 'actors':
        query = Actor.query.all()
        count = len(query)

        if count > 0:
            for row in query:
                out[row.id] = {'id': row.id, 'name': row.name}

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
        query = RelationTypes.query.all()
        count = len(query)
        
        if count > 0:
            for row in query:
                out[row.id] = {'id': row.id, 'name': row.name, 'slug': row.slug, 
                                  'reciprocal_male': row.reciprocal_male,
                                  'reciprocal_female': row.reciprocal_female }

    elif what == 'residences':
        query = Residence.query.all()
        count = len(query)

        if count > 0:
            for row in query:
                out[row.id] = {'id': row.id, 'name': row.name}

    else:
        what = 'error'
        out = 'Invalid query: ' + request.data

    return jsonify({what: out, 'records': count})


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
    if 'what' in request.form.keys():

        # write actor or residence data to database
        if request.form['what'] == 'actors' or request.form['what'] == 'residences':
            if 'id' in request.form.keys() and 'name' in request.form.keys():
                print(type(request.form['id']), type(request.form['name']))
                if validateDataType({'id': request.form['id'], 'name': request.form['name']}, {'id': int, 'name': str}):
                    try:
                        if request.form['what'] == 'actors':
                            q = Actor()
                        elif request.form['what'] == 'residences':
                            q = Residence()

                        q.id = int(request.form['id'])
                        q.name = sanitizeString(request.form['name'])
                        q.save()
                        return jsonify({'success': True})

                    except Exception as e:
                        return jsonify({'error': _('Unable to save {item}: {error}').format(item=f'{request.form["id"]}: {request.form["name"]}', error={e})});

                else:
                    return jsonify({'error': _('Invalid data passed')})
            else:
                return jsonify({'error': _('No data passed')})       
        
    else:
        return jsonify({'error': _('No action passed')})

@api.route('/write-default-relation-types', methods=['GET'])
def write_default_relation_types():
    """
    Writes the default relationship types to the database
    This only works if no relationship types are there!
    """
    if RelationTypes.query.count() < 1:
        relationListModule = f"app.languages.{current_app.config['APP_LANGUAGE']}.relation_list" if current_app.config['APP_LANGUAGE'] != 'en' else "app.languages.relation_list"

        try:
            relationList = importlib.import_module(relationListModule)
            
            for key in relationList.RELATIONSHIP_STRINGS:
                query = RelationTypes(slug=key, name=relationList.RELATIONSHIP_STRINGS[key],
                               reciprocal_male = relationList.RECIPROCAL_RELATIONSHIPS[key]['male'],
                               reciprocal_female = relationList.RECIPROCAL_RELATIONSHIPS[key]['female'])
                query.multiple()
            query.save()
            return jsonify({'success': 'all_loaded'})

        except ModuleNotFoundError:
            return jsonify({'error': 'no_relations_defined'})

    else:
        return jsonify({'success':'already_loaded'})
