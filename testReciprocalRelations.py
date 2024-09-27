# -*- coding=utf-8 -*-
# This script Tests the strings in the reciprocal relationships to make sure that all of them are 
# available. If working with another language, make sure you add the subdirectory for that 
# language to the `from app.languages` string (e.g. app.languages.tr).
#
# This script will compile the lists properly. If it throws the error that a key is missing, check
# your relation_list.py file that the key is found in *both* RELATIONSHIP_STRINGS and 
# RECIPROCAL_RELATIONSHIPS.

from app.languages import relation_list as relationList

meshedRelationList = []

for key in relationList.RELATIONSHIP_STRINGS.keys():
    row = {'name': relationList.RELATIONSHIP_STRINGS[key], 'reciprocal_male': '', 'reciprocal_female': ''}
    row['reciprocal_male'] = '' if relationList.RECIPROCAL_RELATIONSHIPS[key]['male'] == '' else relationList.RELATIONSHIP_STRINGS[relationList.RECIPROCAL_RELATIONSHIPS[key]['male']]
    row['reciprocal_female'] = '' if relationList.RECIPROCAL_RELATIONSHIPS[key]['female'] == '' else relationList.RELATIONSHIP_STRINGS[relationList.RECIPROCAL_RELATIONSHIPS[key]['female']]
    meshedRelationList.append(row)

print(meshedRelationList)
