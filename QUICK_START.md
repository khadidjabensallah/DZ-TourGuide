# Quick Start Guide

## 🚀 Run the Application in 2 Steps

### Step 1: Start Backend (Terminal 1)

```bash
cd /home/bjservices/DZ-TourGuide
./start_backend.sh
```

**OR manually:**
```bash
source .venv/bin/activate
python manage.py runserver
```

✅ Backend running on: **http://127.0.0.1:8000**

### Step 2: Start Frontend (Terminal 2 - NEW TERMINAL)

```bash
cd /home/bjservices/DZ-TourGuide
./start_frontend.sh
```

**OR manually:**
```bash
cd frontend
npm install  # First time only
npm run dev
```

✅ Frontend running on: **http://localhost:3000**

---

## 🧪 Test the Signup Flow

### 1. Open Browser
Go to: **http://localhost:3000**

### 2. Test Tourist Signup
- Click "Register" or go to `/selectType`
- Select "Tourist"
- Fill the form:
  - First Name: `John`
  - Family Name: `Doe`
  - Email: `john@example.com`
  - Password: `password123` (min 8 chars, letters + numbers)
- Click "Sign Up"
- **Check Terminal 1** (Django console) for verification code
- Enter the 6-digit code
- Should redirect to signin page

### 3. Test Guide Signup
- Go to `/SignUpGuideP1` or select "Guide" from `/selectType`
- **Page 1:**
  - Fill: First Name, Family Name, Email, Phone (9 digits), Password
  - Upload a certificate file (PDF, JPG, PNG)
  - Click "Next"
- **Page 2:**
  - Select languages (e.g., Arabic, French, English)
  - Select wilayas (e.g., Algiers, Oran, Constantine)
  - Enter pricing:
    - Half-day: `5000`
    - Full-day: `10000`
    - Additional hour: `2000`
  - Click "Sign Up"
- Enter verification code from Terminal 1
- Sign in

### 4. Test Sign In
- Go to `/signin`
- Enter email and password
- Should redirect based on user type

---

## ✅ Verification Checklist

### Backend Check:
- [ ] Terminal 1 shows: "Starting development server at http://127.0.0.1:8000/"
- [ ] No errors in terminal
- [ ] Can see email output in terminal (verification codes)

### Frontend Check:
- [ ] Terminal 2 shows: "Local: http://localhost:3000/"
- [ ] Browser opens automatically
- [ ] No console errors (F12 → Console tab)

### API Connection:
1. Open Browser DevTools (F12)
2. Go to **Network** tab
3. Try to sign up
4. Should see API calls to `/api/signup/tourist/` or `/api/signup/guide/`
5. Check response - should be **201 Created** for success

---

## 🔍 Debugging

### If Backend Won't Start:
```bash
# Check virtual environment
source .venv/bin/activate

# Check migrations
python manage.py migrate

# Check for errors
python manage.py check
```

### If Frontend Won't Start:
```bash
cd frontend
npm install  # Install dependencies
npm run dev
```

### If API Calls Fail:
1. Check both servers are running
2. Check browser console (F12) for errors
3. Check Network tab for failed requests
4. Verify CORS is enabled in `backend/core/settings.py`

### Check Email Verification:
- In development, emails print to **Terminal 1** (Django console)
- Look for: "Your verification code is: XXXXXX"
- Check browser sessionStorage: F12 → Application → Session Storage → `pending_verification_user_id`

---

## 📝 Example Test Flow

1. **Start both servers** (Terminal 1 & 2)
2. **Open** http://localhost:3000
3. **Sign up as Tourist:**
   - Email: `test@example.com`
   - Password: `test1234`
4. **Check Terminal 1** for verification code
5. **Enter code** on verification page
6. **Sign in** with same credentials
7. **Should redirect** to dashboard/home

---

## 🎯 Success Indicators

✅ **Backend:** Server running, no errors, emails printing to console  
✅ **Frontend:** Page loads, no console errors  
✅ **Signup:** Form submits, shows success message, redirects to verification  
✅ **Verification:** Code accepted, redirects to signin  
✅ **Signin:** Authenticates, stores user data, redirects to dashboard  

---

## 🆘 Common Issues

**Port already in use:**
- Backend: Change port `python manage.py runserver 8001`
- Frontend: Change in `vite.config.js` → `server.port: 3001`

**Module not found:**
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt`

**CORS errors:**
- Check `backend/core/settings.py` has CORS configured
- Verify `django-cors-headers` is installed

**Database errors:**
- Run `python manage.py migrate`
- Check database connection in settings

