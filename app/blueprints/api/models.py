# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database Models

    File name: blueprints/api/models.py
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
__status__ = "Development"
__debugState__ = True
# ================================================================================
from flask import current_app
from app.app import db

# Character table
class Character(db.Model):
    __table_name__ = 'characters'
    id = db.Column(db.Integer, primary_key=True)

# Relationships table
class Relationship(db.Model):
    __table_name__ = 'relationships'
    id = db.Column(db.Integer, primary_key=True)

# Relationship types table
class RelationTypes(db.Model):
    __table_name__ = 'relation_types'
    id = db.Column(db.Integer, primary_key=True)

# Episodes table
class Episodes(db.Model):
    __table_name__ = 'episodes'
    id = db.Column(db.Integer, primary_key=True)

# Character-Episode table
class CharacterToEpisode(db.Model):
    __table_name__ = 'char_to_ep'
    id = db.Column(db.Integer, primary_key=True)

# Residences table
class Residence(db.Model):
    __table_name__ = 'residences'
    id = db.Column(db.Integer, primary_key=True)

# Actors table
class Actor(db.Model):
    __table_name__ = 'characters'
    id = db.Column(db.Integer, primary_key=True)

