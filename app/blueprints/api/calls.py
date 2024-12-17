# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database API calls

    File name: blueprints/api/calls.py
    Date Created: 2024-09-12
    Date Modified: 2024-12-17
    Python version: 3.11+
"""
__author__ = "Josh Wibberley (JMW)"
__copyright__ = "Copyright © 2024 JS Prodüksiyon"
__credits__ = ["Josh Wibberley"]
__license__ = "GNU GPL 3.0"
__version__ = "1.0.1"
__maintainer__ = ["Josh Wibberley"]
__email__ = "jmw@hawke-ai.com"
__status__ = "Development"
__debugState__ = True
# ================================================================================
import os, re, datetime, importlib, json, time
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

        elif request.form['what'] == 'character':
            query = Character.query.get(request.form['id'])

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
        out = {"id": query.id, "first_name": query.first_name, "last_name": query.last_name, 
               "sex": query.sex, "age": query.age, "physical": query.physical, 
               "personality": query.personality, "employment": query.employment, 
               "image_head": query.image_head, "image_body": query.image_body,
               "animation_status": query.animation_status, "residence": query.residence, 
               "marital_status": query.marital_status, "acted_by": query.acted_by, 
               "relationships": [], "episodes": []
        }
        # clean up None types
        for key in out:
            if out[key] is None:
                if key == "acted_by" or key == "residence":
                    out[key] = 0
                else:
                    out[key] == ""
        # add episodes
        if len(query.rel_episodes) > 0:
            for ep in query.rel_episodes:
                out['episodes'].append(ep.id)
        # add relationships
        if len(query.rel_main_character) > 0:
            for rel in query.rel_main_character:
                otherChar = Character.query.get(rel.other_character)
                out['relationships'].append({
                        'rid': rel.id,
                        'id': rel.other_character, 
                        'name': '{} {}'.format(otherChar.first_name, otherChar.last_name), 
                        'sex': otherChar.sex, 
                        'reciprocal': True,
                        'relation': rel.relationship
                })

        nextId = Character.query.order_by(Character.id).all()[-1].id + 1 if len(Character.query.all()) > 0 else 1 # this is here because pulling an individual character from the DB is different
        

    elif what == 'character_list':
        query = Character.query.all()
        count = len(query)

        if count > 0:
            for row in query:
                out[row.id] = { 'id': row.id, 'name': f"{row.first_name} {row.last_name}", 
                                'sex': row.sex, 'episodes': len(row.rel_episodes), 
                                'animation_status': row.animation_status }

    elif what == 'episodes':
        query = Episode.query.order_by(Episode.id).all()
        count = len(query)

        if count > 0:
            for row in query:
                recDate = '' if row.recorded is None else row.recorded.strftime('%Y-%m-%d')
                out[row.id] = {'id': row.id, 'name': row.name, 
                               'recorded': recDate, 
                               'summary': '',     # this is so it shows up in the key. It remains empty for speed. Actual data gets pulled by a separate call
                               'characters': [] }

                if len(row.characters) > 0:
                    for char in row.characters:
                        out[row.id]['characters'].append({ "character_id": char.id, "character_name": "{first} {last}".format(first=char.first_name, last=char.last_name)})

    elif what == 'episode_summary':
        try:
            id = int(request.values['id'])
        except (TypeError, ValueError):
            return jsonify({'error': _('Invalid episode id passed.')})

        query = Episode.query.get(int(request.values['id']))

        if Episode is not None:
            out = {'id': query.id, 'summary': query.summary}

    elif what == 'relation_types':
        query = RelationTypes.query.order_by(RelationTypes.id.asc()).all()
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
                     'marital_status': str, 'acted_by': int, 'relationships': [{ 'rid': int, 'id': int,
			         'name': str,  'sex': str, 'reciprocal': bool, 'relation': str }], 
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
                    relationsToDel = []
                    for item in data['relationships']:
                        # is the row to be deleted? Tag for deletion by row id
                        if (item['id'] < 0):
                            relationsToDel.append(item['rid'])
                        else:
                            # get relationship type object for reciprocal relationships
                            relTypeQuery = RelationTypes.query.filter_by(slug=item['relation']).first()

                            if relTypeQuery is None:
                                raise TypeError(_('No relationship of type {slug} exists.').format(item['relation']))

                            reciprocalRelationship = relTypeQuery.reciprocal_male if query.sex == 'male' else relTypeQuery.reciprocal_female
                            
                            # relationship from main to other
                            if item['rid'] == 0:
                                query.rel_main_character.append(Relationship(other_character=item['id'], relationship=item['relation']))

                                if item['reciprocal']:
                                    query.rel_other_character.append(Relationship(main_character=item['id'], relationship=reciprocalRelationship))

                            else:
                                currentRelationship = next((rel for rel in query.rel_main_character if rel.id == item['rid']), None)

                                if currentRelationship:
                                    if item['reciprocal']:
                                        otherRelationship = next((rel for rel in query.rel_other_character if (rel.main_character == currentRelationship.other_character and rel.relationship == currentRelationship.relationship)), None)

                                    currentRelationship.other_character = item['id']
                                    currentRelationship.relationship = item['relation']

                                    if otherRelationship:
                                        otherRelationship.main_character == item['id']
                                        otherRelationship.relationship = reciprocalRelationship

                    # remove the relationships that are tagged for deletion
                    if len(relationsToDel) > 0:
                        for item in query.rel_main_character:
                            if item.id in relationsToDel:
                                rel = Relationship.query.get(item.id)
                                rel.delete()

                    query.save()

                # delete all items if we have been passed an empty relationships field
                elif len(query.rel_main_character) > 0:
                    for item in query.rel_main_character:
                        rel = Relationship.query.get(item.id)
                        rel.delete()


                    query.save()

                return jsonify({'success': _('Character {name} saved').format(name=f'{query.first_name} {query.last_name}')})               

            except (KeyError, TypeError) as e:
                return jsonify({'error': _('Unable to save {item}: {error}').format(item=_('character'), error={str(e)})})

        # write the episode to the database
        elif request.form['what'] == 'episodes':
            keys = { 'csrf_token': str, 'what': str,  'id': int, 'name': str, 'recorded': str, 'characters': str, 'summary': str}

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
                if request.form['recorded'] != '' and re.match('\d\d\d\d-\d\d\-\d\d', request.form['recorded']):
                    query.recorded = datetime.datetime.strptime(request.form['recorded'], "%Y-%m-%d")

                if request.form['summary'] != '':
                    query.summary = sanitizeString(request.form['summary'])
                
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
    