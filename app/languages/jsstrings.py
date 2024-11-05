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
    'es_read_nodata': _('Requested %item% was not found in database.'),
    'es_read_success': _('%item% successfully retrieved from database'),
    'es_write_failure': _('Unable to write the %item% to database.'),
    'es_write_success': _('The %item% was written to database successfully.'),
    'character': _('character'),
    'characters': _('characters'),
    'char_invalid_data': _('Character data could not be updated. There are invalid data in one of the fields. Please check all the fields and correct them.'),
    'char_no_charListObj': _('The character list JavaScript Object could not be found. This is an unrecoverable system error. Please reload this page. If it does not solve the problem, restart the database program.'),
    'char_not_saved': _('Something went severely wrong the character could not be saved at all. Please let the developers know!'),
    'char_saved': _('The character was saved successfully.'),
    'del_ep': _('Remove Episode'),
    'del_err': _('Unable to delete %item% %id%.'),
    'del_image_body': _('You are about to remove the body pose image for this character.'),
    'del_image_head': _('You are about to remove the head shot image for this character.'),
    'del_modal_text': _('You are about to delete %item%.'),
    'del_rel': _('Remove Relationship'),
    'del_success': _('Successfully deleted %item%.'),
    'del_title': _('Delete %item%'),
    'display': _('Display'),
    'edit': _('Edit'),
    'episode_none': _('No episodes found. Please add one to select it.'),
    'episode': _('episode'),
    'Episode': _('Episode'), # capitalized version in case we need it case sensitive
    'episodes': _('episodes'),
    'ep_characters': _('Characters'),
    'ep_not_recorded': _('Not yet recorded'),
    'ep_no_characters': _('No characters assigned'),
    'ep_num': _('the episode number'),
    'ep_rec_date': _('Recorded on'),
    'image_body_shot': _('Character body shot'),
    'image_head_shot': _('Character head shot'),
    'general_failure': _('An error occurred while interacting with the database. Data was not %action%.'),
    'rec_date': _('Date Recorded'),
    'select_add_actor': _('Add Actor'),
    'select_add_residence': _('Add Location'),
    'select_character': _('Select character...'),
    'select_episode_here': _('Select episode here...'),
    'select_relationship': _('Select relationship...'),
    'select_select': _('Select ...'),
    'select_spacer': '---------------',
    'sex_word': {'male': _('Male'), 'female': _('Female')},
    'actors_none': _('Add actor to select.'),
    'relation_types_none': _('Add relationship to select.'),
    'residences_none' : _('Add location to select.'),
    'string_written': _('written'),
    'string_received': _('received'),
    'string_actors': _('actor'),
    'string_residences': _('residence location'),
    'string_relation_types': _('relationship types'),
    'the': _('the'),
    'err_id_does_not_exist': _('Unable to find the selected item among the %items%. Adding a new item instead.')
}
