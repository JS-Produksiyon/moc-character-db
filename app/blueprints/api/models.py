# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database Models

    File name: blueprints/api/models.py
    Date Created: 2024-09-12
    Date Modified: 2024-09-18
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
from utils.util_sqlalchemy import ResourceMixin


# Character-Episode connector table
char_to_ep = db.Table('char_to_ep', 
                      db.Column('character_id', db.Integer, db.ForeignKey('characters.id', primary_key=True)),
                      db.Column('episodes_id', db.Integer, db.ForeignKey('episodes.id', primary_key=True)),
                      )


# Character table
class Character(ResourceMixin, db.Model):
    __table_name__ = 'characters'
    id = db.Column(db.Integer, primary_key=True)

    # main data
    first_name = db.Column(db.String(), index=True, nullable=False)
    last_name = db.Column(db.String(), index=True, nullable=True)
    age = (db.Column(db.String(), index=False, nullable=True))
    animation_status = db.Column(db.String(), index=True, nullable=False)
    employment = db.Column(db.String(), index=False, nullable=True)
    image_body = db.Column(db.LargeBinary(), index=False, nullable=True)
    image_head = db.Column(db.LargeBinary(), index=False, nullable=True)
    marital_status = db.Column(db.String(), index=False, nullable=False)
    personality = db.Column(db.Text(), index=False, nullable=True)
    physical = db.Column(db.Text(), index=False, nullable=True)
    sex = db.Column(db.String(), index=False, nullable=False)

    # one to one relationships
    residence = db.Column(db.Integer, db.ForeignKey('actors.id', nullable=True))
    rel_residence = db.relationship('Residence', backref='residence_data')
    acted_by = db.Column(db.Integer, db.ForeignKey('actors.id'), nullable=True)
    rel_actor = db.relationship('Actor', backref='actor_data')

    # one to many relationships
    rel_episodes = db.relationship('Episode', secondary=char_to_ep, backref=db.backref('characters', lazy=True))
    rel_main_character = db.relationship('Relationship', foreign_keys='Relationship.main_character', backref='main_character', lazy=True)
    rel_other_character = db.relationship('Relationship', foreign_keys='Relationship.other_character', backref='other_character', lazy=True)

    def __repr__(self):
        return "<Character {}>".format(self)


# Relationships table
class Relationship(ResourceMixin, db.Model):
    __table_name__ = 'relationships'
    id = db.Column(db.Integer, primary_key=True)

    # main fields
    main_character = db.Column(db.Integer, db.ForeignKey('characters.id'), nullable=False)
    other_character = db.Column(db.Integer, db.ForeignKey('characters.id'), nullable=False)
    relationship = db.Column(db.String(50), db.ForeignKey('relation_types.slug'), nullable=False)

    # reciprocal relationships
    obj_main_character = db.relationship('Character', foreign_keys=[main_character], backref='main_character_of')
    obj_other_character = db.relationship('Character', foreign_keys=[other_character], backref='other_character_of')

    def __repr__(self):
        return "<Relationship {}>".format(self)


# Relationship types table
class RelationTypes(ResourceMixin, db.Model):
    __table_name__ = 'relation_types'
    id = db.Column(db.Integer, primary_key=True)

    # main fields
    slug = db.Column(db.String(50), unique=True,  index=True, nullable=False)
    name = db.Column(db.String(), index=True, nullable=False)
    reciprocal_male = db.Column(db.String(50), index=False, nullable=True)
    reciprocal_female = db.Column(db.String(50), index=False, nullable=True)

    # relationship
    rel_slug = db.relationship('Relationship', backref='relation_type', lazy=True)

    def __repr__(self):
        return "<RelationshipType {}>".format(self)


# Episodes table
class Episode(ResourceMixin, db.Model):
    __table_name__ = 'episodes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), index=True, nullable=False, comment="Full name of actor")
    recorded = db.Column(db.Date)

    def __repr__(self):
        return "<Episode {}>".format(self)


# Residences table
class Residence(ResourceMixin, db.Model):
    __table_name__ = 'residences'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), index=True, nullable=False)

    def __repr__(self):
        return "<Residence {}>".format(self)


# Actors table
class Actor(ResourceMixin, db.Model):
    __table_name__ = 'actors'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), index=True, nullable=False, comment="Full name of actor")
    
    def __repr__(self):
        return "<Actor {}>".format(self)

