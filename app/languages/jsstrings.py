# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database
    Strings needed by JavaScript for localization

    File name: languages/jsstrings.py
    Date Created: 2024-09-12
    Date Modified: 2024-09-13
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
# ================================================================================
from flask_babel import gettext as _

JS_STRINGS = {
    'sex_word': {'male': _('Male'), 'female': _('Female')},
    'display': _('Display'),
    'del_rel': _('Remove Relationship'),
    'del_ep': _('Remove Episode'),
    'rec_date': _('Date Recorded'),
    'ep_characters': _('Characters'),
    'edit': _('Edit'),
    'del_modal_text': _('You are about to delete %item%.'),
}