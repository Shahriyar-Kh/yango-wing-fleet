# Yango Wing Fleet Frontend

The frontend is the customer-facing and staff-facing React application for Yango Wing Fleet. It presents the public onboarding experience, support content, and the private admin dashboard that connects directly to the Django REST API.

## Frontend Overview

This app is responsible for:

- Public marketing and onboarding pages
- Online rider registration and contact flows
- Admin login and private dashboard access
- Live API-backed analytics and content management

It is deployed on Vercel and communicates with the backend on Render through HTTPS API requests.

## Pages

- Home
- Services
- How It Works
- Registration
- About
- Contact
- Support
- FAQ
- City landing pages
- Legal pages
- Admin login
- Admin dashboard

## UI/UX Features

- Responsive, mobile-first layout
- Animated sections and smooth transitions
- Infographic-style cards and KPI blocks
- Clean typography and clear visual hierarchy
- Public pages optimized for trust and conversion
- Admin interface optimized for daily operations

## State Management

- Auth context manages admin login state
- API service modules centralize requests
- Token storage keeps access and refresh tokens available across page reloads
- Dashboard views use polling for near-real-time updates

## Routing

TanStack Router handles all application routes.

- Public pages are accessible without authentication
- `/admin/login` is the authentication entry point
- `/admin/dashboard` is protected and redirects unauthenticated users back to login
- `/admin` redirects to the correct admin destination based on auth state

## API Integration

The frontend uses a shared API client for public and protected requests.

- Base URL is controlled by `VITE_API_BASE_URL`
- Login posts to `POST /api/auth/token/`
- Protected dashboard requests send `Authorization: Bearer <token>`
- Error messages are surfaced from the backend when available
- The client avoids leaking browser-specific errors into user-facing flows

Example environment file:

```env
VITE_API_BASE_URL=https://yango-wing-fleet.onrender.com
```

## Dashboard Features

The custom dashboard includes:

- Analytics summary cards
- Daily, weekly, and monthly trend views
- Distribution charts for registrations and inquiries
- Registration management
- Inquiry management
- Offer CRUD screens
- Trip bonus CRUD screens
- CSV export actions
- Polling-based refresh for live-feeling updates

## Pages in Detail

### Home

The homepage explains the value proposition, supported vehicles, city coverage, and support channels.

### Services

The services page presents Bike, Car, and Rickshaw onboarding details.

### Registration

The registration page captures rider details and submits them to the backend API.

### Contact

The contact page provides a branded support and inquiry flow.

### Admin Login

The admin login page authenticates staff with username and password.

### Admin Dashboard

The dashboard shows real-time-like stats, content controls, and admin tools backed by the database.

## Build and Local Development

### Install dependencies

```bash
cd frontend
npm install
```

### Start the dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Environment variables

Create a `.env` file in `frontend/`:

```env
VITE_API_BASE_URL=https://yango-wing-fleet.onrender.com
```

## Deployment

- Hosted on Vercel
- Build command: `npm run build`
- Output directory: `dist`
- SPA routing is handled through Vercel rewrites
- The deployed site must be configured with the production backend API base URL

## Project Notes

- The frontend is designed to work with the backend JWT auth flow
- Admin dashboard data is loaded from protected API endpoints
- Public pages can consume backend-driven dynamic content when needed
- The app uses Tailwind CSS for styling and Recharts for dashboard visuals

## Relevant Files

- `src/lib/api/config.ts` — API base URL and endpoint constants
- `src/lib/api/client.ts` — Shared fetch layer and error handling
- `src/contexts/AuthContext.tsx` — Authentication state management
- `src/routes/admin/login.tsx` — Admin login screen
- `src/routes/admin/dashboard.tsx` — Admin control center
- `src/hooks/useDashboard.ts` — Dashboard data hooks


- Brand name: Yango Wing Fleet
- Short name: YWF
- Tagline: Pakistan's Premier Yango Rider Registration Partner
- Phones: 0323-1213999 and 0324-4110141
- WhatsApp number: 923231213999
- Email: support@yangowingfleet.pk
- Office address: Yango Wing Fleet Office, Lahore, Pakistan

The supported city list and service catalog are also defined there.

## Animation and UI System

The interface uses a consistent visual language with:

- Glass and glass-strong card surfaces
- Gradient primary and gold accents
- Animated section reveals
- Framer Motion transitions
- Rounded cards, pill buttons, and elevated call-to-action blocks

Reusable primitives are exposed from `src/components/ui-kit.tsx`:

- `Reveal`
- `SectionTitle`

## Forms and Validation

Forms currently run fully on the client side.

Registration form validation rules:

- Full name: required, minimum 2 characters
- CNIC: valid Pakistani CNIC format
- Phone: valid Pakistani mobile number format
- City: required selection
- Vehicle type: bike, car, or rickshaw
- Vehicle make/model: required
- Vehicle year: 4 digits
- Notes: optional, max 500 characters

Contact form validation rules:

- Name: required
- Email: valid email format
- Phone: required text field
- Message: minimum length required

## Generated and Important Files

- `src/routeTree.gen.ts` is generated by TanStack Router and should not be edited manually unless you know exactly why.
- `src/styles.css` contains the base styling for the app.
- `vite.config.ts` uses a direct TanStack Start setup.

## Project Structure

```text
frontend/
  src/
    assets/
    components/
    hooks/
    lib/
    routes/
    router.tsx
    routeTree.gen.ts
    styles.css
  package.json
  vite.config.ts
  tsconfig.json
  eslint.config.js
  wrangler.jsonc
```

## Requirements

- Node.js 22.12 or newer is recommended
- npm is supported out of the box

The installed TanStack Start packages currently expect a newer Node runtime, so using Node 22.12+ avoids engine warnings.

## Setup

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

Format the code:

```bash
npm run format
```

## Deployment Notes

The project includes Cloudflare-oriented tooling and can be adapted for deployment on Cloudflare Workers or other supported environments.

If you connect a backend later, the best places to wire it in are:

- The registration form submit handler
- The contact form submit handler
- Any future server functions or APIs for lead capture

## Contributing Notes

- Keep route content aligned with the current business positioning
- Preserve the clean, premium visual style
- Avoid reintroducing Lovable branding or old icon references
- Update the README if you add new routes, forms, or backend integrations
