# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database API calls

    File name: blueprints/api/calls.py
    Date Created: 2024-09-12
    Date Modified: 2024-10-15
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
import os, re, datetime, importlib, json
from flask import(
    Blueprint, jsonify, config, redirect, request, url_for, current_app
)
from flask_babel import lazy_gettext as _, format_date
from utils.util_validators import sanitizeString, validateDataType
from app.blueprints.api.models import (Character, Episode, Relationship, RelationTypes, Residence, Actor)
from app.languages.jsstrings import JS_STRINGS

api = Blueprint('api', __name__, url_prefix='/api')

# define routes
@api.route('/deleteItem', methods=['POST'])
def del_from_db():
    """
    Deletes an item from the database
    
    :arg what : Defines what to delete: character or episode (for now; in the future relation_types, residences, and actors)
    :arg id   : id of item to delete
    :returns  : JSON string
    """
    try:
        if request.form['what'] == 'episodes':
            query = Episode.query.get(request.form['id'])

        if query is not None:
            query.delete()
            return jsonify({'success': True })
        
        else:
            return jsonify({'error': _('Could not delete {item}').format(item=request.form['what'])})

    except Exception as e:
        jsonify({'error': _('Unable to delete {item}: {error}').format(item=request.form['what'], error={str(e)})})


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
    nextId = 1
    what = request.values.get('what')
        
    if what == 'actors':
        query = Actor.query.all()
        count = len(query)

        if count > 0:
            for row in query:
                out[row.id] = {'id': row.id, 'name': row.name}

    elif what == 'character':
        try:
            id = int(request.values['id'])
        except (TypeError, ValueError):
            return jsonify({'error': _('Invalid character id passed.')})
        
        query = Character.query.get(int(request.values['id']))
        nextId = Character.query.all()[-1] + 1 if len(Character.query.all()) > 0 else 1 # this is here because pulling an individual character from the DB is different
        

    elif what == 'character_list':
        query = Character.query.order_by(Character.first_name, Character.last_name).all()
        count = len(query)

        if count > 0:
            for row in query:
                out[row.id] = { 'id': row.id, 'name': f"{row.first_name} {row.last_name}", 
                                'sex': row.sex, 'episodes': row.rel_episodes.count(), 
                                'animation_status': row.animation_status }

    elif what == 'episodes':
        query = Episode.query.order_by(Episode.id).all()
        count = len(query)

        if count > 0:
            for row in query:
                recDate = '' if row.recorded is None else row.recorded.strftime('%Y-%m-%d')
                out[row.id] = {'id': row.id, 'name': row.name, 
                               'recorded': recDate, 
                               'characters': [] }
                # for now we leave the characters empty until we make the character connection when adding the episodes to the character


    elif what == 'relation_types':
        query = RelationTypes.query.all()
        count = len(query)
        
        if count > 0:
            for row in query:
                out[row.id] = {'id': row.id, 'name': row.name, 'slug': row.slug, 
                               'reciprocal_male': row.reciprocal_male,
                               'reciprocal_female': row.reciprocal_female,
                               'sex': row.sex }

    elif what == 'residences':
        query = Residence.query.all()
        count = len(query)

        if count > 0:
            for row in query:
                out[row.id] = {'id': row.id, 'name': row.name}

    else:
        what = 'error'
        out = 'Invalid query: ' + request.data

    # get the last id of the query
    if count > 0:
        nextId = query[-1].id + 1

    return jsonify({what: out, 'records': count, 'next': nextId})


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
                validate = validateDataType({'id': request.form['id'], 'name': request.form['name']}, {'id': int, 'name': str})
                if  validate == 'valid':
                    try:
                        if request.form['what'] == 'actors':
                            query = Actor()
                        elif request.form['what'] == 'residences':
                            query = Residence()

                        query.id = int(request.form['id'])
                        query.name = sanitizeString(request.form['name'])
                        query.save()
                        return jsonify({'success': True})

                    except Exception as e:
                        return jsonify({'error': _('Unable to save {item}: {error}').format(item=f'{request.form["id"]}: {request.form["name"]}', error={e})})

                else:
                    return jsonify({'error': _('Invalid data type passed: {e}').format(e=validate)})
                
            else:
                return jsonify({'error': _('No data passed')})       
        
        # write the character to the database
        elif request.form['what'] == 'character':
            keys = {'csrf_token': str, 'what': str, 'data': str }
            charData = { 'id': int, 'first_name': str, 'last_name': str,
	                 'sex': str, 'age': str, 'physical': str, 'personality': str, 'employment': str,
	                 'image_head': str, 'image_body': str, 'animation_status': str, 'residence': int,
                     'marital_status': str, 'acted_by': int, 'relationships': [ { 'id': int,
			         'name': str,  'sex': str, 'relation': { 'id': int, 'slug': str, 'sex': str } }], 
                     'episodes': [int] }
            
            try:
                if len(request.form) != len(keys):
                    raise KeyError(_('Invalid number of keys passed: {sent} not {sought}').format(sent=len(request.form), sought=len(keys)))
            
                data = json.loads(request.form['data'])

                if len(data) != len(charData):
                    raise KeyError(_('Invalid number of character data keys passed: {sent} not {sought}').format(sent=len(data), sought=len(charData)))
                
                for item in charData:
                    if item not in data.keys():
                        raise KeyError(_('Required data for {item} not passed.').format(item=item))
                
                validate = validateDataType(data, charData)

                if not validate == 'valid':
                    raise TypeError(_('Invalid data type passed: {e}').format(e=validate))
                
                query = Character.query.get(data['id'])

                if query is None:
                    query = Character(id=data['id'])

                query.age = sanitizeString(data['age'])
                query.animation_status = sanitizeString(data['animation_status'])
                query.employment = sanitizeString(data['employment'])
                query.first_name = sanitizeString(data['first_name'])
                query.image_body = data['image_body'] # need to write a little function here to make sure that these actually contain image data only!
                query.image_head = data['image_head']
                query.last_name = sanitizeString(data['last_name'])
                query.marital_status = sanitizeString(data['marital_status'])
                query.personality = sanitizeString(data['personality'])
                query.physical = sanitizeString(data['physical'])
                query.sex = sanitizeString(data['sex'])

                # add actors and residence
                query.acted_by = data['acted_by'] if data['acted_by'] > 0 else None
                query.residence = data['residence'] if data['residence'] > 0 else None

                # add episodes
                if len(data['episodes']) > 0:
                    # first we aggregate the existing episodes so we can compare the content
                    dbEps = []
                    if len(query.rel_episodes) > 0:
                        for ep in query.rel_episodes:
                            dbEps.append(ep.id)

                        # remove deleted episodes 
                        for ep in dbEps:
                            if ep not in data['episodes']:
                                epToDel = Episode.query.get(ep)
                                query.rel_episodes.remove(epToDel)

                    # add the new episodes
                    for ep in data['episodes']:
                        if ep not in dbEps:
                            query.rel_episodes.append(Episode.query.get(ep))

                query.save()

                # add relationships
                if len(data['relationships']) > 0:
                    for item in data['relationships']:
                        # get relationship slug object
                        relTypeQuery = RelationTypes.query.filter_by(slug=item['relations']['relation']['slug'])

                        if relTypeQuery is None:
                            raise TypeError(_('No relationship of type {slug} exists.').format(item['relations']['relation']['slug']))

                        # relationship from main to other
                        subQuery = Relationship.query.filter_by(main_character=query.id, 
                                                                other_character= item['id']).first()

                        if subQuery is None:
                            subQuery = Relationship()

                        subQuery.main_character = query.id
                        subQuery.other_character = item['id']
                        subQuery.relationship = item['relation']['slug']
                        subQuery.save()

                        # relationship from other to main
                        subQuery = Relationship.query.filter_by(main_character=item['id'], 
                                                                other_character= query.id).first()

                        if subQuery is None:
                            subQuery = Relationship()

                        if (item['relation']['sex'] == 'male'):
                            reverse = relTypeQuery.reciprocal_male
                        elif (item['relation']['sex'] == 'female'):
                            reverse = relTypeQuery.reciprocal_female
                        else:
                            raise TypeError(_('No valid reciprocal relationship type for {slug} defined.').format(slug=relTypeQuery.slug))

                        subQuery.main_character = item['id']
                        subQuery.other_character = query.id
                        subQuery.slug = reverse
                        subQuery.save()

                return jsonify({'success': _('Character {name} saved').format(name=f'{query.first_name} {query.last_name}')})               

            except (KeyError, TypeError) as e:
                return jsonify({'error': _('Unable to save {item}: {error}').format(item=_('character'), error={str(e)})})

        # write the episode to the database
        elif request.form['what'] == 'episodes':
            keys = { 'csrf_token': str, 'what': str,  'id': int, 'name': str, 'recorded': str, 'characters': str}

            try:
                if len(request.form) != len(keys):
                    raise KeyError(_('Invalid number of keys passed: {sent} not {sought}').format(sent=len(request.form), sought=len(keys)))
                
                for item in keys:
                    if item not in request.form:
                        raise KeyError(_('Required data for {item} not passed.').format(item=item))
                
                validate = validateDataType(request.form, keys)

                if not validate == 'valid':
                    raise TypeError(_('Invalid data type passed: {e}').format(e=validate))

                query = Episode.query.get(int(request.form['id']))

                if query is None:
                    query = Episode(id=int(request.form['id']))

                query.name = sanitizeString(request.form['name'])
                if request.form['recorded'] != "" and re.match('\d\d\d\d-\d\d\-\d\d', request.form['recorded']):
                    query.recorded = datetime.datetime.strptime(request.form['recorded'], "%Y-%m-%d")
                # we don't add characters, because that is handled from the add character field
                query.save()

                return jsonify({'success': _('{episode} saved').format(episode=request.form['id'])})

            except (KeyError, TypeError) as e:
                return jsonify({'error': _('Unable to save {item}: {error}').format(item=request.form['id'], error={str(e)})})

        # Write relationship type to database
        elif request.form['what'] == 'relation_types':
            keys = { 'csrf_token': str, 'what': str,  'id': int, 'slug': str, 'name': str, 'reciprocal_male': str, 'reciprocal_female': str, 'sex': str }
            
            try:
                if len(request.form) != len(keys):
                    raise KeyError(_('Invalid number of keys passed: {sent} not {sought}').format(sent=len(request.form), sought=len(keys)))
                
                for item in keys:
                    if item not in request.form:
                        raise KeyError(_('Required data for {item} not passed.').format(item=item))
                
                validate = validateDataType(request.form, keys)

                if not validate == 'valid':
                    raise TypeError(_('Invalid data type passed: {e}').format(e=validate))

                query = RelationTypes.query.get(int(request.form['id']))

                if query is None: # throws if the new key is not yet in the database
                    query = RelationTypes(id=int(request.form['id']))
                
                # Update columns in the RelationTypes
                query.slug = sanitizeString(request.form['slug'])
                query.name = sanitizeString(request.form['name'])
                query.reciprocal_female = sanitizeString(request.form['reciprocal_female'])
                query.reciprocal_male = sanitizeString(request.form['reciprocal_male'])
                query.sex = sanitizeString(request.form['sex'])
                query.save()

                # update reciprocal relationships
                if request.form['reciprocal_female'] != '':
                    relationQuery = RelationTypes.query.filter_by(slug=request.form['reciprocal_female']).first()
                    relationQuery.reciprocal_male = request.form['slug']
                    relationQuery.save()

                if request.form['reciprocal_male'] != '':
                    relationQuery = RelationTypes.query.filter_by(slug=request.form['reciprocal_male']).first()
                    relationQuery.reciprocal_female = request.form['slug']
                    relationQuery.save()

                return jsonify({'success': _('{slug} saved').format(slug=query.slug)})

            except (TypeError, KeyError) as e:
                return jsonify({'error': _('Unable to save {item}: {error}').format(item=request.form['slug'], error={str(e)})})

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
                               reciprocal_male=relationList.RECIPROCAL_RELATIONSHIPS[key]['male'],
                               reciprocal_female=relationList.RECIPROCAL_RELATIONSHIPS[key]['female'],
                               sex=relationList.RECIPROCAL_RELATIONSHIPS[key]['sex'])
                query.multiple()

            query.save()
            return jsonify({'success': 'all_loaded'})

        except ModuleNotFoundError:
            return jsonify({'error': 'no_relations_defined'})

    else:
        return jsonify({'success':'already_loaded'})
    