# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database
    Basic relationship list to preload in the database

    File name: languages/relation_list.py
    Date Created: 2024-09-27
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
__language__ = 'English'
__language_code__ = 'en'
# ================================================================================
# This file contains two dictionaries, RELATIONSHIP_STRINGS and 
# RECIPROCAL_RELATIONSHIPS, which are used to define the relationship between two 
# characters. These arrays are used to pre-populate the database and do not use 
# `gettext()` for localization, as some languages (e.g. Turkish) have more 
# complex relationships than in English. 
# 
# When localizing the MoC Character Database, please copy this file into the 
# target directory under app/language/ (e.g. app/laguage/tr/relation_list.py). 
# Once copied, please update the __language__ and __language_code__ variables 
# above. Then define the relationships as they exist in that language, following 
# grammatical gender rules and/or relational complexities. 
# 
# However, *the keys are recommended to be kept in English.* Multiple words should 
# be separated by an underscore `_`. For example, if there is more than one type 
# of uncle depending on father's side or mother's, change the keys to `uncle_m` 
# and `uncle_f` respectively. How exactly these extended  relations are defined is 
# up to the translator; but *please be consistent* across the translation! 
# Otherwise the application will break. 
# 
# These comments can be removed after translation, however it is recommended they
# be kept for future reference.
#
# ================================================================================
# RELATIONSHIP_STRINGS is an associative array containing the names of given 
# relationships. 
#
# Format:
# RELATIONS_STRINGS = { 'key': 'value' }
#    Where `value` follows capitalization rules of the target language
RELATIONSHIP_STRINGS = {
    'husband'      : 'Husband',
    'wife'         : 'Wife',
    'son'          : 'Son',
    'daughter'     : 'Daughter',
    'brother'      : 'Brother',
    'sister'       : 'Sister',
    'father'       : 'Father',
    'mother'       : 'Mother',
    'grandfather'  : 'Grandfather',
    'grandmother'  : 'Grandmother',
    'grandson'     : 'Grandson',
    'granddaughter': 'Granddaughter',
    'bro-in-law'   : 'Brother-in-law',
    'sis-in-law'   : 'Sister-in-law',
    'dad-in-law'   : 'Father-in-law',
    'mom-in-law'   : 'Mother-in-law',
    'son-in-law'   : 'Son-in-law',
    'dau-in-law'   : 'Daughter-in-law',
    'uncle'        : 'Uncle',
    'aunt'         : 'Aunt',
    'nephew'       : 'Nephew',
    'niece'        : 'Niece',
    'cousin'       : 'Cousin',
    'employer'     : 'Employer',
    'employee'     : 'Employee',
    'acquaintance' : 'Acquaintance',
    'friend'       : 'Friend',
    'enemy'        : 'Enemy'
}

# ================================================================================
# The data in RECIPROCAL_RELATIONSHIPS are used when updating a character and 
# his/her relations. The reciprocal relationship takes two different sexes: male 
# or female. However, the relationship itself will refer either to a male, a female,
# or both, which is defined in teh `sex` field. If the target relationship is only 
# either male or female, leave the relationship it is *not* blank (i.e. if it is 
# only male, leave female blank).
# 
# The keys need to be identical to the ones in RELATIONSHIP_STRINGS, otherwise 
# defining the reciprocal relationship will not work.
# 
# Format:
# RECIPROCAL_RELATIONSIPS = { 'key': {'male': 'value', 'female': 'value', 'sex': 'value'} } 
#    Where `value` is a reference to one of the other `key`s in the array.

RECIPROCAL_RELATIONSHIPS = {
    'husband'      : {'male' : '', 'female' : 'wife', 'sex' : 'male'},
    'wife'         : {'male' : 'husband', 'female' : '', 'sex' : 'female'},
    'father'       : {'male' : 'son', 'female' : 'daughter', 'sex' : 'male'},
    'mother'       : {'male' : 'son', 'female' : 'daughter', 'sex' : 'female'},
    'son'          : {'male' : 'father', 'female' : 'mother', 'sex' : 'male'},
    'daughter'     : {'male' : 'father', 'female' : 'mother', 'sex' : 'female'},
    'brother'      : {'male' : 'brother', 'female' : 'sister', 'sex' : 'male'},
    'sister'       : {'male' : 'brother', 'female' : 'sister', 'sex' : 'female'},
    'grandfather'  : {'male' : 'grandson', 'female' : 'granddaughter', 'sex' : 'male'},
    'grandmother'  : {'male' : 'grandson', 'female' : 'granddaughter', 'sex' : 'female'},
    'grandson'     : {'male' : 'grandfather', 'female' : 'grandmother', 'sex' : 'male'},
    'granddaughter': {'male' : 'grandfather', 'female' : 'grandmother', 'sex' : 'female'},
    'bro-in-law'   : {'male' : 'bro-in-law', 'female' : 'sis-in-law', 'sex' : 'male'},
    'sis-in-law'   : {'male' : 'bro-in-law', 'female' : 'sis-in-law', 'sex' : 'female'},
    'dad-in-law'   : {'male' : 'son-in-law', 'female' : 'dau-in-law', 'sex' : 'male'},
    'mom-in-law'   : {'male' : 'son-in-law', 'female' : 'dau-in-law', 'sex' : 'female'},
    'son-in-law'   : {'male' : 'dad-in-law', 'female' : 'mom-in-law', 'sex' : 'male'},
    'dau-in-law'   : {'male' : 'dad-in-law', 'female' : 'mom-in-law', 'sex' : 'female'},
    'uncle'        : {'male' : 'nephew', 'female' : 'niece', 'sex' : 'male'},
    'aunt'         : {'male' : 'nephew', 'female' : 'niece', 'sex' : 'female'},
    'nephew'       : {'male' : 'uncle', 'female' : 'aunt', 'sex' : 'male'},
    'niece'        : {'male' : 'uncle', 'female' : 'aunt', 'sex' : 'female'},
    'cousin'       : {'male' : 'cousin', 'female' : 'cousin', 'sex' : 'both'},
    'employer'     : {'male' : 'employee', 'female' : 'employee', 'sex' : 'both'},
    'employee'     : {'male' : 'employer', 'female' : 'employer', 'sex' : 'both'},
    'acquaintance' : {'male' : 'acquaintance', 'female' : 'acquaintance', 'sex' : 'both'},
    'friend'       : {'male' : 'friend', 'female' : 'friend', 'sex' : 'both'},
    'enemy'        : {'male' : 'enemy', 'female' : 'enemy', 'sex' : 'both'},
}