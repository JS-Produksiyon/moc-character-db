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
import os, re, json, datetime
from flask import(
    Blueprint, config, redirect, request, url_for, current_app
)
from app.blueprints.api.models import (Character, Episode, Relationship, RelationTypes, Residence, Actor)

api = Blueprint('api', __name__, url_prefix='/api')

