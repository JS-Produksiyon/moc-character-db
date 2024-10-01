# -*- coding=utf-8 -*-
# Validation functions

def sanitizeString(string) -> str:
    """
    Sanitize a passed string to remove any sort of code from it

    :param string: string to sanatize
    :type  string: string
    :returns     : sanitized string
    """
    import bleach
    # no tags are allowed!
    return bleach.clean(string, tags=[], attributes={}, strip=True)


def validateDataType(data, skeleton) -> str:
    """
    Validates a passed data object according to a skeleton

    :param data    : the data to be validated can be string, dict whatever
    :type  data    : varies
    :param skeleton: the skeleton to validate the data against. 
                     This contains the same kind of data type as data (dict, list, tuple) or 
                     a reference to the type of data expected to be contained in the various
                     layers of data (e.g. str, int, float, bool)
    :type  skeleton: varies
    :returns       : string saying 'valid' or what is causing error
    """
    loopState = True
    result = 'valid'

    if (type(data) == skeleton) or (type(data) == type(skeleton) and len(data) == len(skeleton)):
        if type(skeleton) == dict:
            for key in skeleton.keys():
                if key not in data.keys():
                    loopState = False
                    result = key
                if not validateDataType((data[key]), skeleton[key]):
                    loopState = False
            
            return loopState

        elif type(skeleton) == list or type(skeleton) == tuple:
            for key, itemType in enumerate(data):
                if not validateDataType(itemType, skeleton[0]):
                    loopState = False
                    result = itemType

            return loopState

        else:
            result = 'valid'
    
    # we need to check if the the data type might be a number masquerading as a string            
    elif (skeleton == int or skeleton == float) and type(data) == str:
        try:
            test = int(data)
            test = float(data)
            result = 'valid'
        except ValueError:
            result = 'string NaN'

    return result
