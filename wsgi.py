import os
import sys
from pathlib import Path

# Add the 'backend' directory to the Python path
# This allows Django to find 'core' and 'backend_app' correctly
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR / "backend"))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
