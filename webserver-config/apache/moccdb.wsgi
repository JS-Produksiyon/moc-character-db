import sys
sys.path.insert(0, '/var/www/moc-character-db')
from app.app import create_app

application = create_app()

# so, writing the code this way  is required, because it is the only way
# to get mod_wsgi on apache to initialize the factory. Clunky, but it
# works. (After beating my head against the wall for hours!)
