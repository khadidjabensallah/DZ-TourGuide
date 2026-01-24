import os
import sys
from pathlib import Path

# Add the 'backend' directory to the Python path
# This allows Gunicorn to find the real 'core' and 'backend_app'
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR / "backend"))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
