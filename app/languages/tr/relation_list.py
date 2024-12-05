# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database
    Basic relationship list to preload in the database

    File name: languages/relation_list.py
    Date Created: 2024-11-14
    Date Modified: 2024-12-05
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
__language__ = 'Türkçe'
__language_code__ = 'tr'
# ================================================================================
# This file contains two dictionaries, RELATIONSHIP_STRINGS and 
# RECIPROCAL_RELATIONSHIPS, which are used to define the relationship between two 
# characters. These arrays are used to pre-populate the database and do not use 
# `gettext()` for localization, as some languages (e.g. Turkish) have more 
# complex relationships than in English. 
# 
# When localizing the MoC Character Database, please copy this file into the 
# target directory under app/language/ (e.g. app/language/tr/relation_list.py). 
# Once copied, please update the __language__ and __language_code__ variables 
# above. Then define the relationships as they exist in that language, following 
# grammatical gender rules and/or relational complexities. 
# 
# However, *the keys are recommended to be kept in English.* Multiple words should 
# be separated by a dash `-`. For example, if there is more than one type 
# of uncle depending on father's side or mother's, change the keys to `uncle-m` 
# and `uncle-f` respectively. How exactly these extended  relations are defined is 
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
    'husband'              : 'Kocası',
    'wife'                 : 'Karısı',
    'son'                  : 'Oğulu',
    'daughter'             : 'Kızı',
    'brother-big'          : 'Abisi',
    'sister-big'           : 'Ablası',
    'brother'              : 'Erkek kardeşi',
    'sister'               : 'Kız kardeşi',
    'father'               : 'Babası',
    'mother'               : 'Annesi',
    'grandfather'          : 'Dedesi',
    'grandmother-m'        : 'Babaannesi',
    'grandmother-f'        : 'Anneannesi',
    'grandmother-both'     : 'Ninesi',
    'grandchild'           : 'Torunu',
    'bro-in-law-blood'     : 'Kayın biraderi', #baldız (f); kayın birader (m)
    'sis-in-law-blood-m'   : 'Baldızı', # kayın birader (e)
    'sis-in-law-blood-f'   : 'Görümcesi', # yenge (f)
    'bro-in-law-marriage-m': 'Bacanağı', # bacanak (e)
    'bro-in-law-marriage-f': 'Eniştesi (kardeş bağı)', # baldız (f); enişte (e)
    'sis-in-law-marriage-m': 'Yengesi (kardeş bağı)', # yenge (f)
    'sis-in-law-marriage-f': 'Eltisi', # elti (f)
    'dad-in-law'           : 'Kayın pederi', 
    'mom-in-law'           : 'Kaynanası',
    'son-in-law'           : 'Damadı',
    'dau-in-law'           : 'Gelini',
    'uncle-mom'            : 'Dayısı',
    'uncle-dad'            : 'Amcası',
    'aunt-mom'             : 'Teyzesi',
    'aunt-dad'             : 'Halası',
    'uncle-married'        : 'Eniştesi (yeğen bağı)',
    'aunt-married'         : 'Yengesi (yeğen bağı)',
    'nephew-niece-mom'     : 'Yeğeni (anne tarafı)',
    'nephew-niece-dad'     : 'Yeğeni (baba tarafı)',
    'nephew-niece-married' : 'Yeğeni (evli)',
    'cousin'               : 'Kuzeni',
    'employer'             : 'İş vereni',
    'employee'             : 'Çalışanı',
    'acquaintance'         : 'Tanıdığı',
    'friend'               : 'Dostu',
    'enemy'                : 'Düşmanı',
    'coworker'             : 'Meslektaşı'
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
    'brother-big'  : {'male' : 'brother', 'female' : 'sister', 'sex' : 'male'},
    'sister-big'   : {'male' : 'brother', 'female' : 'sister', 'sex': 'female'},
    'brother'      : {'male' : 'brother', 'female' : 'sister', 'sex' : 'male'},
    'sister'       : {'male' : 'brother', 'female' : 'sister', 'sex' : 'female'},
    'grandfather'  : {'male' : 'grandchild', 'female' : 'grandchild', 'sex' : 'male'},
    'grandmother-m'  : {'male' : 'grandchild', 'female' : 'grandchild', 'sex' : 'female'},
    'grandmother-f'  : {'male' : 'grandchild', 'female' : 'grandchild', 'sex' : 'female'},
    'grandmother-both': {'male' : 'grandchild', 'female' : 'grandchild', 'sex' : 'female'},
    'grandchild'     : {'male' : 'grandfather', 'female' : 'grandmother-both', 'sex' : 'both'},
    'bro-in-law-blood'   : {'male' : 'bro-in-law-blood', 'female' : 'sis-in-law-blood-m', 'sex' : 'male'},
    'sis-in-law-blood-m' : {'male': 'bro-in-law-blood', 'female': '', 'sex': 'female'},
    'sis-in-law-blood-f': {'male': '', 'female': 'sis-in-law-marriage-m', 'sex':'female'},
    'bro-in-law-marriage-m': {'male': 'bro-in-law-marriage-m', 'female': '', 'sex': 'male'},
    'bro-in-law-marriage-f': {'male': 'bro-in-law-marriage-f', 'female': 'sis-in-law-blood-m', 'sex': 'male'},
    'sis-in-law-marriage-m': {'male': 'sis-in-law-marriage-m', 'female': 'sis-in-law-marriage-m', 'sex': 'female'},
    'sis-in-law-marriage-f': {'male': '', 'female': 'sis-in-law-marriage-f', 'sex': 'female'},
    'dad-in-law'   : {'male' : 'son-in-law', 'female' : 'dau-in-law', 'sex' : 'male'},
    'mom-in-law'   : {'male' : 'son-in-law', 'female' : 'dau-in-law', 'sex' : 'female'},
    'son-in-law'   : {'male' : 'dad-in-law', 'female' : 'mom-in-law', 'sex' : 'male'},
    'dau-in-law'   : {'male' : 'dad-in-law', 'female' : 'mom-in-law', 'sex' : 'female'},
    'uncle-mom'    : {'male' : 'nephew-niece-mom', 'female' : 'nephew-niece-mom', 'sex' : 'male'},
    'uncle-dad'    : {'male' : 'nephew-niece-dad', 'female' : 'nephew-niece-dad', 'sex' : 'male-dad'},
    'aunt-mom'     : {'male' : 'nephew-niece-mom', 'female' : 'nephew-niece-mom', 'sex' : 'female'},
    'aunt-dad'     : {'male' : 'nephew-niece-dad', 'female' : 'nephew-niece-dad', 'sex' : 'female'},
    'uncle-married': {'male' : 'nephew-niece-married', 'female': 'nephew-niece-married', 'sex' : 'male'},
    'aunt-married' : {'male' : 'nephew-niece-married', 'female' : 'nephew-niece-married', 'sex' : 'female'},
    'nephew-niece-mom'       : {'male' : 'uncle-mom', 'female' : 'aunt-mom', 'sex' : 'both'},
    'nephew-niece-dad'       : {'male' : 'uncle-dad', 'female' : 'aunt-dad', 'sex' : 'both'},
    'nephew-niece-married'   : {'male' : 'uncle-married', 'female' : 'aunt-married', 'sex' : 'both'},
    'cousin'       : {'male' : 'cousin', 'female' : 'cousin', 'sex' : 'both'},
    'employer'     : {'male' : 'employee', 'female' : 'employee', 'sex' : 'both'},
    'employee'     : {'male' : 'employer', 'female' : 'employer', 'sex' : 'both'},
    'acquaintance' : {'male' : 'acquaintance', 'female' : 'acquaintance', 'sex' : 'both'},
    'friend'       : {'male' : 'friend', 'female' : 'friend', 'sex' : 'both'},
    'enemy'        : {'male' : 'enemy', 'female' : 'enemy', 'sex' : 'both'},
    'coworker'     : {'male' : 'coworker', 'coworker' : 'enemy', 'sex' : 'both'},
}