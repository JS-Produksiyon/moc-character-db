# -*- coding: utf-8 -*-
# ================================================================================
"""
    Men of Courage Character Database 
    Waitress Startup Script

    File name: moccdb.py
    Date Created: 2024-11-18
    Date Modified: 2024-12-01
    Python version: 3.11+
"""
__author__ = "Josh Wibberley (JMW)"
__copyright__ = "Copyright © 2024 JS Prodüksiyon"
__credits__ = ["Josh Wibberley"]
__license__ = "GNU GPL 3.0"
__version__ = "1.0.0"
__maintainer__ = ["Josh Wibberley"]
__email__ = "jmw@hawke-ai.com"
__status__ = "Production"
# ================================================================================
# Check for python version
import sys

MIN_PYTHON = (3,11)
if sys.version_info < MIN_PYTHON:
    sys.exit("Python %s.%s or later is required to run the Men of Courage Character Database.\n" % MIN_PYTHON)

from flask_babel import Babel, gettext as _, ngettext
from app.app import create_app

app = create_app()

# TRANSLATORS: Add your language here under each variable in the format
#              'code': 'Translated string'
LANGUAGES = {
    'available' : ['en', 'tr'], # only add the language code here!
    'moccdb_language': {
        'en': 'The database is configured to run in the English language.',
        'tr': 'Veri tabanı Türk dilinde çalışmak üzere ayarlanmıştır.'
    },
    'moccdb_running': {
        'en':'Men of Courage Character Database is running.',
        'tr': 'Erkeğe Dair Karakter Veri Tabanı çalışmaktadır.'
        },
    'moccdb_stop_win': {
        'en': 'To shut down the database, press [Ctrl]+[C] or close this window.',
        'tr': 'Veri tabanını kapatmak için bu pencereyi kapatın veya [Ctrl]+[C] tuşlarına basınız.'
        },
    'moccdb_stop_other': {
        'en': 'Press [Ctrl]+[C] to shut the database down.',
        'tr': 'Veri tabanını kapatmak için [Ctrl]+[C] tuşlarına basınız.'
        },
    'mocddb_open_url': {
        'en':'The Men of Courage Character Database can be accessed in your web browser from {url}',
        'tr': 'Erkeğe Dair Veri Tabanına tarayıcınızda {url} adresini açarak ulaşabilirsiniz.'
        }
}
# TRANSLATORS: Do not edit beyond this point!

host = '127.0.0.1'
port = 13153
locale = app.config.get('APP_LANGUAGE') if app.config.get('APP_LANGUAGE') in LANGUAGES['available'] else 'en'
app.config['ACCESS'] = f'http://{host}:{str(port)}'



if __name__ == '__main__':
    from waitress import serve
    
    print(LANGUAGES['moccdb_running'][locale])
    print(LANGUAGES['moccdb_language'][locale])
    if sys.platform == 'win32':
        print(LANGUAGES['moccdb_stop_win'][locale])
    else:
        print(LANGUAGES['moccdb_stop_other'][locale])

    print(' ')
    print(LANGUAGES['mocddb_open_url'][locale].format(url=app.config.get('ACCESS')))
    
    serve(app, host=host, port=port, threads=4)
