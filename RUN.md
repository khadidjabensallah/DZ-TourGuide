# How to Run the Application

## Quick Start Guide

### Step 1: Start Django Backend

Open Terminal 1:
```bash
cd /home/bjservices/DZ-TourGuide

# Activate virtual environment
source .venv/bin/activate

# Start Django server
python manage.py runserver
```

Backend will run on: **http://127.0.0.1:8000**

### Step 2: Start React Frontend

Open Terminal 2 (new terminal):
```bash
cd /home/bjservices/DZ-TourGuide/frontend

# Install dependencies (first time only)
npm install

# Start Vite dev server
npm run dev
```

Frontend will run on: **http://localhost:3000**

## Testing the Signup Flow

### Test Tourist Signup:
1. Open browser: http://localhost:3000
2. Navigate to signup (or go to `/selectType`)
3. Select "Tourist"
4. Fill in the form:
   - First Name
   - Family Name
   - Email
   - Password (min 8 chars, letters + numbers)
5. Click "Sign Up"
6. Check email (or console logs) for verification code
7. Enter 6-digit code on verification page
8. Should redirect to signin page

### Test Guide Signup:
1. Go to `/selectType` or `/SignUpGuideP1`
2. Fill Page 1:
   - First Name, Family Name, Email, Phone (9 digits), Password
   - Upload certificate file
3. Click "Next"
4. Fill Page 2:
   - Select languages
   - Select wilayas (coverage zones)
   - Enter pricing (half-day, full-day, additional hour)
5. Click "Sign Up"
6. Verify email with code
7. Sign in

### Test Sign In:
1. Go to `/signin`
2. Enter email and password
3. Should redirect to dashboard based on user type

## Check if It's Working

### Backend Check:
- Terminal 1 should show: "Starting development server at http://127.0.0.1:8000/"
- No errors in terminal
- Can access: http://127.0.0.1:8000/api/ (should show API endpoints or 404)

### Frontend Check:
- Terminal 2 should show: "Local: http://localhost:3000/"
- Browser opens automatically
- No console errors in browser DevTools

### API Connection Check:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to sign up
4. Should see API calls to `/api/signup/tourist/` or `/api/signup/guide/`
5. Check response status (should be 201 for success)

## Common Issues

### Backend won't start:
- Check if virtual environment is activated
- Check if database migrations are applied: `python manage.py migrate`
- Check if port 8000 is already in use

### Frontend won't start:
- Run `npm install` in frontend folder
- Check if Node.js is installed: `node --version`
- Check if port 3000 is already in use

### API calls failing:
- Make sure backend is running on port 8000
- Check CORS settings in `backend/core/settings.py`
- Check browser console for CORS errors
- Verify Vite proxy is configured in `frontend/vite.config.js`

### Email verification not working:
- Check Django console for email output (emails print to console in development)
- Check sessionStorage in browser DevTools for `pending_verification_user_id`

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Tourist signup form submits successfully
- [ ] Guide signup form submits successfully
- [ ] Verification code is received (check console/email)
- [ ] Email verification works
- [ ] Sign in works after verification
- [ ] User data is stored in sessionStorage

