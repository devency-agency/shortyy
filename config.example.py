import os
# Database configuration
DATABASE = "sqlite:///database.db"
IS_TEMP_DB = False
IS_TEMP_LOGS = False

# Flask app configuration
FLASK_HOST = '0.0.0.0'
FLASK_PORT = 4000
FLASK_DEBUG = True
DEBUG_MODE = False
CAPTCHA_DEBUG_MODE = True

# URL shortener configuration
SHORT_URL_LENGTH = 6

# reCaptcha V3 secret key
RECAPTCHA_V3_SECRET = os.getenv('CAPTCHA_SECRET_KEY')
