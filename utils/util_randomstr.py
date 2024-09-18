# -*- coding: utf-8 -*-
# Hawke AI Random string generator function
import re, secrets, string

def randomString(strType='alphanumeric', strLength=10, pwdStyle=False, pwdRegex=r'^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$'):
    """
    Generates a string of random characters of a given length

    :param strType   : Kind of string to generate: 
                       'alphanumeric', 'character', 'digit', 'letter', 
                       'lcletter', 'ucletter', 'hexadecimal', 'octal'
    :type strType    : string
    :param strLength : how many characters the string length will be
                       Default is 10
    :type strLength  : integer
    :param pwdStyle  : Returns a string in password style defined in pwdRegex
    :type pwdStyle   : boolean
    :param pwdRegex  : regular expression to test password against. 
                       Default is 8 alphanumeric characters lowercase, 
                       uppercase and digits requred.
    :param type      : regex string
    
    :return          : string
    """
    # Create pool to make random password from
    pool = ''
    
    if strType == 'alphanumeric':
        pool = string.digits + string.ascii_letters
    elif strType == 'character':
        pool = string.digits + string.ascii_letters + string.punctuation
    elif strType == 'digits':
        pool = string.digits
    elif strType == 'hexadecimal':
        pool = string.hexdigits
    elif strType == 'letter':
        pool = string.ascii_letters
    elif strType == 'lcletter':
        pool = string.ascii_lowercase
    elif strType == 'ucletter':
        pool = string.ascii_uppercase
    elif strType == 'octal':
        pool = string.octdigits
    else:
        return False

    # make sure we return at least 1 character
    if strLength < 1:
        strLength = 1

    # make sure we have minimum password length if we are using pwdStyle
    if pwdStyle and strLength < 8:
        strLength = 8

    out = ''.join(secrets.choice(pool) for i in range(strLength))

    # pwdStyle test only works with alphanumeric and character options!
    if pwdStyle and (strType == 'alphanumeric' or strType == 'character'):
        if not re.match(pwdRegex, out):
            out = randomString(strType=strType, strLength=strLength, pwdStyle=pwdStyle)
    elif pwdStyle: 
        # other options don't work with pwdStyle
        return False

    return out
