# Setup Guide - DZ Tour Guide

## Project Structure

```
DZ-TourGuide/
├── backend/                 # Django Backend
│   ├── core/               # Django project settings
│   └── backend_app/        # Main Django app
│
├── frontend/                # React Frontend (Vite)
│   ├── src/                # React source files
│   ├── public/             # Static assets
│   ├── package.json        # Node dependencies
│   └── vite.config.js      # Vite configuration
│
├── media/                   # User uploaded files
├── manage.py                # Django management script
└── requirements.txt         # Python dependencies
```

## Backend Setup (Django)

### 1. Install Python Dependencies

```bash
# Activate virtual environment
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Setup

```bash
# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### 3. Run Django Server

```bash
# Using helper script
./manage.sh runserver

# Or directly
python manage.py runserver
```

Backend will run on: `http://127.0.0.1:8000`

## Frontend Setup (React + Vite)

### 1. Install Node Dependencies

```bash
cd frontend
npm install
```

### 2. Run Vite Dev Server

```bash
npm run dev
```

Frontend will run on: `http://localhost:3000`

## Connecting Frontend to Backend

The connection is already configured:

1. **Vite Proxy** (`frontend/vite.config.js`)
   - Proxies `/api/*` requests to `http://127.0.0.1:8000/api/*`
   - Proxies `/media/*` requests to Django media files

2. **API Utility** (`frontend/src/utils/api.js`)
   - All API calls use `/api` prefix
   - Automatically handled by Vite proxy

3. **CORS Configuration** (`backend/core/settings.py`)
   - Allows requests from `http://localhost:3000`
   - Enabled for development

## Usage

1. **Start Backend:**
   ```bash
   python manage.py runserver
   ```

2. **Start Frontend (in another terminal):**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://127.0.0.1:8000/api/
   - Django Admin: http://127.0.0.1:8000/admin/

## API Endpoints

All API endpoints are prefixed with `/api/`:

- Authentication: `/api/signin/`, `/api/signup/tourist/`, `/api/signup/guide/`
- Tours: `/api/guide/<id>/tours/`
- Reservations: `/api/reservations/create/`
- Guide Profile: `/api/guide/<id>/profile/`

## Development Notes

- React frontend runs on port 3000 (Vite)
- Django backend runs on port 8000
- Vite proxy automatically forwards API requests
- CORS is enabled for development
- Session-based authentication is used





