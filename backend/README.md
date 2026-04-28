# Yango Wing Fleet Backend

Production-ready Django REST backend for Yango Wing Fleet. This service powers authentication, public registration intake, inquiry handling, dashboard analytics, content management, and email notifications for the platform.

## Backend Overview

The backend is the system of record for the platform.

- It stores registrations, inquiries, offers, and trip bonus data.
- It issues JWT tokens for admin authentication.
- It exposes API endpoints consumed by the React frontend.
- It handles analytics aggregation for the custom dashboard.
- It sends operational and notification emails through Gmail SMTP.

## Core Features

- Registration API for rider onboarding
- Inquiry API for support and contact messages
- Offers API for promotional content
- Trip bonuses API for incentive management
- Admin analytics APIs for dashboard charts and summaries
- JWT authentication for private admin workflows
- CSV export endpoints for operational reporting

## Models Explained

### Registration

Stores rider onboarding data including identity details, city, vehicle type, vehicle information, status, and timestamps.

### Inquiry

Stores contact and support submissions with status tracking for internal follow-up.

### Offer

Stores promotional offers displayed in the frontend and managed from the admin dashboard.

### TripBonus

Stores bonus rules and incentive entries tied to city and vehicle type.

## API Endpoints

### Auth

- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`

### Public APIs

- `GET /api/health/`
- `GET /api/public/dynamic-sections/`
- `POST /api/public/registrations/`
- `POST /api/public/inquiries/`

### Admin APIs

- `GET /api/admin/dashboard/summary/`
- `GET /api/admin/dashboard/trends/`
- `GET /api/admin/dashboard/distributions/`
- `GET /api/admin/dashboard/latest/`
- `GET, POST, PATCH, DELETE /api/admin/content/offers/`
- `GET, POST, PATCH, DELETE /api/admin/content/trip-bonuses/`
- `GET, PATCH /api/admin/registrations/`
- `GET, PATCH /api/admin/inquiries/`
- `GET /api/admin/registrations-export.csv`
- `GET /api/admin/inquiries-export.csv`

## Authentication Flow

Authentication is powered by SimpleJWT.

1. The frontend sends `username` and `password` to `POST /api/auth/token/`.
2. The backend returns an access token and refresh token.
3. The frontend stores the tokens and sends the access token in the `Authorization: Bearer <token>` header.
4. When the access token expires, the frontend can request a fresh one using `POST /api/auth/token/refresh/`.
5. Private admin endpoints require a valid JWT token and admin privileges.

## Database

- Production database: PostgreSQL on Supabase
- Connection is provided through `DATABASE_URL`
- SSL is enabled for production deployments

## Email System

The backend sends emails through Gmail SMTP.

- Registration notifications can be sent to the admin inbox
- Password reset emails are delivered through the same SMTP setup
- Email content uses the configured `DEFAULT_FROM_EMAIL`

Required environment values:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=Yango Wing Fleet <your-email@gmail.com>
ADMIN_NOTIFICATION_EMAIL=office@yangowingfleet.pk
```

## Security

- CORS is restricted to trusted frontend origins
- CSRF trusted origins are configured for browser-based requests
- JWT protects admin endpoints
- Public endpoints are throttled
- Static files are served through WhiteNoise
- Sensitive values come from environment variables

## Local Setup

### 1) Create a virtual environment

```bash
cd backend
python -m venv myenv
myenv\Scripts\activate
```

### 2) Install dependencies

```bash
pip install -r requirements.txt
```

### 3) Configure environment variables

Create a `.env` file in the backend directory:

```env
DJANGO_DEBUG=True
DJANGO_SECRET_KEY=your-secret-key
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,.onrender.com
DATABASE_URL=postgresql://...
DB_SSL_REQUIRE=True
FRONTEND_BASE_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=Yango Wing Fleet <your-email@gmail.com>
ADMIN_NOTIFICATION_EMAIL=office@yangowingfleet.pk
```

### 4) Run migrations

```bash
python manage.py migrate
```

### 5) Create an admin user

```bash
python manage.py createsuperuser
```

### 6) Start the server

```bash
python manage.py runserver
```

## Deployment Notes

- Hosted on Render
- Run the app with Gunicorn in production
- Collect static files during deployment
- Serve static assets through WhiteNoise
- Set `DJANGO_DEBUG=False` in production
- Configure `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS` correctly
- Point `FRONTEND_BASE_URL` to the deployed Vercel site

Recommended production environment values:

```env
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=.onrender.com,yango-wing-fleet.onrender.com
CORS_ALLOWED_ORIGINS=https://yango-wing-fleet.vercel.app
CSRF_TRUSTED_ORIGINS=https://yango-wing-fleet.vercel.app
FRONTEND_BASE_URL=https://yango-wing-fleet.vercel.app
```

## Public-Frontend Integration

- The frontend registration form posts to `POST /api/public/registrations/`
- The frontend contact/support forms post to `POST /api/public/inquiries/`
- Dynamic offers and trip bonuses are consumed from `GET /api/public/dynamic-sections/`
- Admin dashboard metrics are loaded from the protected analytics endpoints

## Production Checklist

- Verify `DATABASE_URL` is set to the production PostgreSQL database
- Verify `EMAIL_HOST_PASSWORD` is the Gmail app password
- Verify frontend origin is listed in `CORS_ALLOWED_ORIGINS`
- Verify frontend origin is listed in `CSRF_TRUSTED_ORIGINS`
- Verify `FRONTEND_BASE_URL` matches the deployed Vercel URL
- Verify an admin user exists before testing dashboard login

