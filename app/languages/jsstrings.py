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
from flask_babel import lazy_gettext as _

JS_STRINGS = {
    'es_read_failure': _('Unable to retrieve the %item% from the database.'),
    'es_write_failure': _('Unable to write the %item% to database.'),
    'es_write_success': _('The %item% was written to database successfully.'),
    'del_ep': _('Remove Episode'),
    'del_modal_text': _('You are about to delete %item%.'),
    'del_rel': _('Remove Relationship'),
    'display': _('Display'),
    'edit': _('Edit'),
    'ep_characters': _('Characters'),
    'general_failure': _('An error occurred while interacting with the database. Data was not %action%.'),
    'rec_date': _('Date Recorded'),
    'select_add_actor': _('Add Actor'),
    'select_add_residence': _('Add Location'),
    'select_select': _('Select ...'),
    'select_spacer': '---------------',
    'sex_word': {'male': _('Male'), 'female': _('Female')},
    'actors_none': _('Add actor to select.'),
    'residences_none' : _('Add location to select.'),
    'string_written': _('written'),
    'string_received': _('received'),
    'string_actors': _('actor'),
    'string_residences': _('residence location'),
}
