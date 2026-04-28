# Yango Wing Fleet — Digital Registration & Fleet Management Platform

Yango Wing Fleet is a production-grade full-stack web platform for driver registration, fleet management, and admin operations. It gives riders and drivers a simple way to register online, while giving internal staff a custom dashboard to manage registrations, offers, trip bonuses, inquiries, and analytics without relying on the default Django admin.

## 🌐 Live Demo

- Frontend: https://yango-wing-fleet.vercel.app
- Backend API: https://yango-wing-fleet.onrender.com

## 🚀 Project Introduction

This platform solves a common operational problem: managing rider onboarding, lead intake, and fleet activity through a single, structured system instead of scattered forms and manual spreadsheets.

It provides:

- Online rider registration for Bike, Car, and Rickshaw drivers
- A public-facing contact and support system
- Dynamic offers and trip bonus content
- A secure admin control center for operational staff
- Real-time-like dashboard updates through polling
- JWT-based authentication for protected admin routes and APIs

The result is a clean, conversion-focused platform that serves both public users and internal operations teams.

## 🧠 System Architecture

Yango Wing Fleet uses an API-driven architecture:

- The frontend is a React application built with TanStack Router and Vite.
- The backend is a Django REST Framework API that handles authentication, registration intake, inquiries, content management, and analytics.
- The frontend communicates with the backend through HTTPS requests to `/api/*` endpoints.
- Authentication is powered by SimpleJWT, with access and refresh tokens used for protected admin endpoints.
- The dashboard fetches data from the database through backend API endpoints rather than rendering static content.

Typical request flow:

1. User logs in through the admin login page.
2. Frontend sends credentials to `POST /api/auth/token/`.
3. Backend returns JWT access and refresh tokens.
4. Frontend stores the tokens and attaches the access token as a Bearer header.
5. Admin dashboard requests load live data from protected endpoints.
6. The backend returns database-backed analytics, registrations, offers, and inquiries.

## 🛠 Tech Stack

### Frontend

- React 19
- TanStack Router
- Vite
- Tailwind CSS
- Recharts

### Backend

- Django
- Django REST Framework
- JWT Authentication via SimpleJWT
- PostgreSQL on Supabase
- WhiteNoise for static file delivery
- Gmail SMTP for email notifications

## ✨ Features

- Online registration system for Bike, Car, and Rickshaw drivers
- Dynamic offers and promo content
- Trip bonus management
- Custom admin dashboard that replaces the default Django admin for daily operations
- Analytics views for daily, weekly, monthly, and trend-based reporting
- Contact and support intake system
- Real-time-like dashboard refresh using polling
- Secure JWT authentication for admin workflows
- Protected admin routes with redirect handling
- Production-ready deployment on Vercel and Render

## 📊 Admin Dashboard Capabilities

The custom admin dashboard supports:

- Managing driver registrations
- Updating registration status
- Creating, editing, and deleting offers
- Creating, editing, and deleting trip bonus records
- Viewing analytics summaries and charts
- Monitoring inquiries and support messages
- Exporting registrations and inquiries as CSV

## 🔐 Authentication

Authentication is handled with JWT tokens.

- Login uses `POST /api/auth/token/`
- Refresh uses `POST /api/auth/token/refresh/`
- Protected admin routes require a valid access token
- The frontend sends the token in the `Authorization: Bearer <token>` header
- Logout clears stored tokens safely

## ⚙️ Local Setup

### Prerequisites

- Node.js 20+ or Bun for the frontend
- Python 3.11+ for the backend
- PostgreSQL for production-like local testing

### 1) Clone the repository

```bash
git clone https://github.com/Shahriyar-Kh/yango-wing-fleet.git
cd yango-wing-fleet
```

### 2) Backend setup

```bash
cd backend
python -m venv myenv
myenv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Create a backend `.env` file with values similar to:

```env
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=your-secret-key
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,.onrender.com
DATABASE_URL=postgresql://...
DB_SSL_REQUIRE=True
CORS_ALLOWED_ORIGINS=https://yango-wing-fleet.vercel.app
CSRF_TRUSTED_ORIGINS=https://yango-wing-fleet.vercel.app
FRONTEND_BASE_URL=https://yango-wing-fleet.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=Yango Wing Fleet <your-email@gmail.com>
ADMIN_NOTIFICATION_EMAIL=office@yangowingfleet.pk
```

### 3) Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Create a frontend `.env` file with:

```env
VITE_API_BASE_URL=https://yango-wing-fleet.onrender.com
```

## 🌍 Deployment

- Frontend is deployed on Vercel
- Backend is deployed on Render
- Static files are served efficiently via WhiteNoise on the backend
- Django handles API, auth, and content services
- Vercel hosts the React app and routes traffic to the backend API

Deployment notes:

- The frontend must point to the backend Render URL through `VITE_API_BASE_URL`
- The backend must allow the Vercel origin in CORS and CSRF settings
- Static files should be collected and served through WhiteNoise in production

## 📡 API Structure

### Public endpoints

- `GET /api/health/`
- `GET /api/public/dynamic-sections/`
- `POST /api/public/registrations/`
- `POST /api/public/inquiries/`

### Auth endpoints

- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`
- `POST /api/auth/password-reset/request/`
- `POST /api/auth/password-reset/verify/`
- `POST /api/auth/password-reset/confirm/`

### Admin endpoints

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

## 📁 Project Structure

```text
yango-wing-fleet/
├── backend/
│   ├── config/
│   ├── core/
│   ├── dashboard/
│   ├── inquiries/
│   ├── public_content/
│   ├── registrations/
│   ├── media/
│   ├── static/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── routes/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 📈 Future Improvements

- WebSocket-based live updates for the dashboard
- Mobile app for operations and staff
- Multi-role admin system with scoped permissions
- Payment integration for premium services
- Advanced reporting and export filters
- Notification center for staff alerts

## 👨‍💻 Developer Info

- Name: Shahriyar Khan
- Email: shahriyarkhanpk1@gmail.com
- Portfolio: https://shahriyarkhan.vercel.app
