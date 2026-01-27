# How to Deploy to DigitalOcean App Platform

Since the code is already prepared and pushed to GitHub, follow these manual steps in your DigitalOcean dashboard.

## 1. Create the App
1. Log in to your [DigitalOcean Control Panel](https://cloud.digitalocean.com/).
2. Click **Create** -> **Apps**.
3. Choose **GitHub** as the source.
4. Select your repository (`khadidjabensallah/DZ-TourGuide`) and the `backend` branch.
5. Click **Next**.

## 2. Resources Configuration
1. DigitalOcean should detect the `Procfile` and creating a **Web Service**.
2. Click **Edit** on the Web Service.
3. Ensure the **Run Command** is: `gunicorn core.wsgi:application` (It should be detected automatically from the Procfile).
4. **HTTP Port**: Ensure this is set to `8000`.

## 3. Environment Variables
Click **Edit** next to Environment Variables and add the following:

| Key | Value | Note |
|-----|-------|------|
| `DEBUG` | `False` | Important for production security. |
| `SECRET_KEY` | `(Generage a random string)` | You can use a password manager to generate one. |
| `ALLOWED_HOSTS` | `.ondigitalocean.app` | Allows the default DigitalOcean domain. |
| `CSRF_TRUSTED_ORIGINS` | `https://${APP_DOMAIN}` | This variable allows your app to accept form submissions. Use the actual URL once you have it. |
| `DISABLE_COLLECTSTATIC` | `0` | Ensure static files are collected. |

## 4. Database Setup
1. You can click **Add Internal Database** (Dev Database for cheaper testing, or Managed for production).
2. Creating this will automatically inject `DATABASE_URL`, `DATABASE_USER`, etc., which our `settings.py` is configured to read.

## 5. Review and Deploy
1. Click **Next** until you reach the Review page.
2. Click **Create Resources**.

## 6. Post-Deployment
- Once the build finishes, you will get a live URL ending in `ondigitalocean.app`.
- **Update Environment Variables**: Go back to Settings -> Environment Variables and update `CSRF_TRUSTED_ORIGINS` with your actual live URL (e.g., `https://sea-lion-app-pj4s.ondigitalocean.app`).
