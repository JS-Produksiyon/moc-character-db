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

import argparse
import ipaddress
import sys
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
        },
    'mocddb_argparse_title' :{
        'en': 'Start Men of Courage Character Database',
        'tr': 'Erkeğe Dair Veri Tabanını Başlat'
    },
    'mocddb_argparse_host': {
        'en': 'IPv4 address to bind to (e.g. 127.0.0.1 or 0.0.0.0)',
        'tr': 'Bağlanılacak IPv4 adresi (örn. 127.0.0.1 veya 0.0.0.0)'
     },
    'mocddb_argparse_host_error': {
        'en': 'Error: Invalid IPv4 address: {host}',
        'tr': 'Hata: Geçersiz IPv4 adresi: {host}'
    },
    'mocddb_argparse_port': {
        'en': 'Port number (integer) with minimum value 8000',
        'tr': 'Port numarası (tam sayı); asgari değer 8000'
    },
    'mocddb_argparse_port_error': {
        'en': 'Error: Port number must be 8000 or greater: {port}',
        'tr': 'Hata: Port numarası 8000 veya daha büyük olmalıdır: {port}'
    }
}
# TRANSLATORS: Do not edit beyond this point!

host = '127.0.0.1'
port = 13153
locale = app.config.get('APP_LANGUAGE') if app.config.get('APP_LANGUAGE') in LANGUAGES['available'] else 'en'



if __name__ == '__main__':
    from waitress import serve
    
    parser = argparse.ArgumentParser(description=LANGUAGES['mocddb_argparse_title'][locale])
    parser.add_argument('--host', dest='host', default=host,
                        help=LANGUAGES['mocddb_argparse_host'][locale])
    parser.add_argument('--port', dest='port', type=int, default=port,
                        help=LANGUAGES['mocddb_argparse_port'][locale])

    args = parser.parse_args()

    app.config['ACCESS'] = f'http://{host}:{str(port)}'

    # Validate host is a valid IPv4 address
    try:
        ipaddress.IPv4Address(args.host)
    except Exception:
        print(LANGUAGES['mocddb_argparse_host_error'][locale].format(host=args.host))
        sys.exit(2)

    # Validate port is integer >= 8000
    if args.port < 8000:
        print(LANGUAGES['mocddb_argparse_port_error'][locale].format(port=args.prt))
        sys.exit(2)

    host = args.host
    port = args.port

    print(LANGUAGES['moccdb_running'][locale])
    print(LANGUAGES['moccdb_language'][locale])
    if sys.platform == 'win32':
        print(LANGUAGES['moccdb_stop_win'][locale])
    else:
        print(LANGUAGES['moccdb_stop_other'][locale])

    print(' ')
    print(LANGUAGES['mocddb_open_url'][locale].format(url=app.config.get('ACCESS')))
    
    serve(app, host=host, port=port, threads=4)
