# Yango Wing Fleet Backend

Production-ready Django + DRF backend for dynamic public content, registration intake, support/contact inquiries, and a private analytics dashboard.

## Stack
- Django
- Django REST Framework
- Supabase PostgreSQL (via `DATABASE_URL`)
- Gmail SMTP email notifications
- JWT auth (SimpleJWT)

## Setup
1. Create and activate a virtual environment.
2. Install requirements:
   - `pip install -r requirements.txt`
3. Create `.env` from `.env.example` and fill secrets.
4. Run migrations:
   - `python manage.py migrate`
5. Create admin user:
   - `python manage.py createsuperuser`
6. Run server:
   - `python manage.py runserver`

## Public Endpoints
- `GET /api/health/`
- `GET /api/public/dynamic-sections/`
- `POST /api/public/registrations/`
- `POST /api/public/inquiries/`

## Auth Endpoints
- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`

## Private Admin Endpoints (JWT + admin user required)
- Content CRUD:
  - `/api/admin/content/offers/`
  - `/api/admin/content/promo-banners/`
  - `/api/admin/content/city-goals/`
  - `/api/admin/content/trip-bonuses/`
- Registrations:
  - `/api/admin/registrations/`
  - `/api/admin/registrations-export.csv`
- Inquiries:
  - `/api/admin/inquiries/`
  - `/api/admin/inquiries-export.csv`
- Analytics dashboard:
  - `/api/admin/dashboard/summary/`
  - `/api/admin/dashboard/trends/?period=daily&limit=30`
  - `/api/admin/dashboard/distributions/`
  - `/api/admin/dashboard/latest/?limit=20`

## Frontend Integration Notes
- Public dynamic cards can consume `GET /api/public/dynamic-sections/`.
- Registration page can submit directly to `POST /api/public/registrations/`.
- Contact/support forms can submit to `POST /api/public/inquiries/` with `inquiry_type` (`contact` or `support`).
- All public submit endpoints include anti-spam honeypot (`website`) and throttling.

## Security Notes
- Admin APIs are protected by `IsAdminUser` and JWT auth.
- Sensitive configuration is environment-driven.
- Input validation is enforced with DRF serializers.
- Throttles are enabled for public endpoints.
