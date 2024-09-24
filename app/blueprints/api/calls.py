# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database API calls

    File name: blueprints/api/calls.py
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
import os, re, datetime
from flask import(
    Blueprint, jsonify, config, redirect, request, url_for, current_app
)
from flask_babel import lazy_gettext as _
from app.blueprints.api.models import (Character, Episode, Relationship, RelationTypes, Residence, Actor)
from app.languages.jsstrings import JS_STRINGS

api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/jsstrings')
def localized_js_strings():
    """
    Returns the localized JavaScript strings
    """
    return jsonify(JS_STRINGS)

