# Yango Wing Fleet Frontend

Yango Wing Fleet is a React frontend for a Yango driver registration and support website focused on Pakistan. The site is built with TanStack Start, TanStack Router, Vite, TypeScript, Tailwind CSS v4, and a set of reusable UI primitives for a polished marketing and onboarding experience.

This frontend presents the business as a real, local, free registration partner for Yango drivers. It includes a homepage, service pages, city-specific landing pages, registration and contact forms, support content, legal pages, and a thank-you flow after registration submission.

## Website Overview

The website is designed around a simple goal: help bike, car, and rickshaw drivers register for Yango quickly and for free.

The public experience includes:

- Strong hero messaging on the homepage
- Clear service explanations for bike, car, and rickshaw onboarding
- City landing pages for local SEO and local trust
- A step-by-step onboarding flow
- Registration and contact forms
- 24/7 support details through WhatsApp and phone
- FAQ, privacy, terms, and support pages
- A post-submission thank-you page

## Tech Stack

- React 19
- TanStack Start
- TanStack Router
- Vite
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React icons
- React Hook Form
- Zod validation
- Radix UI primitives

## Key Features

- Fully responsive marketing site
- Animated hero, cards, and section reveals
- Local city pages for six supported cities
- Vehicle-specific onboarding content
- Client-side registration form validation
- Client-side contact form validation
- Support-focused CTA paths to WhatsApp and phone calls
- SEO metadata on each route
- SSR-ready shell through TanStack Start

## Main Routes

| Route           | Purpose                                                                                 |
| --------------- | --------------------------------------------------------------------------------------- |
| `/`             | Homepage with hero, stats, services, process, cities, bonuses, support, and FAQ preview |
| `/services`     | Service overview for bike, car, and rickshaw registration                               |
| `/how-it-works` | Four-step onboarding explanation                                                        |
| `/registration` | Registration form for new drivers                                                       |
| `/about`        | Brand story, office presence, and value highlights                                      |
| `/contact`      | Contact form plus phone, WhatsApp, email, and office details                            |
| `/support`      | 24/7 support channels and common issue categories                                       |
| `/faq`          | Frequently asked questions                                                              |
| `/cities/$city` | City-specific onboarding landing pages                                                  |
| `/privacy`      | Privacy policy                                                                          |
| `/terms`        | Terms of service                                                                        |
| `/thank-you`    | Confirmation page after registration submission                                         |

## Page Details

### Homepage

The homepage introduces the brand and the offer quickly. It includes:

- A hero section with a strong registration message
- Call-to-action buttons for registration and WhatsApp
- Driver stats such as onboarded drivers, city coverage, and support hours
- A promotional intro media section
- Office/trust section with real-location messaging
- Services cards for bike, car, and truck/rickshaw categories
- A four-step onboarding process
- City cards for all supported cities
- Weekly earnings and bonus example cards
- Support block with call and WhatsApp access
- FAQ preview questions

### Services Page

The services page explains the registration flow for:

- Bike registration
- Car registration
- Rickshaw registration

Each service card includes:

- Intro text
- Required details
- Registration steps
- Registration notes

### How It Works

This page shows the onboarding journey in four steps:

1. Fill the form
2. Submit details
3. Review and contact
4. Complete onboarding

### Registration Page

The registration form collects:

- Full name
- CNIC
- Phone number
- City
- Vehicle type
- Vehicle make/model
- Vehicle year
- Optional notes

Validation is handled with Zod and React Hook Form.

Current behavior:

- The form validates locally in the browser
- On success, it waits briefly and redirects to the thank-you page
- No backend API is wired into this frontend yet

### About Page

The about page presents:

- The company mission
- Real office messaging
- Office imagery
- Brand values such as trust, always free, local team, and driver-first service
- A final registration CTA

### Contact Page

The contact page provides:

- Phone contact
- WhatsApp contact
- Email contact
- Office location
- Social buttons
- A contact form for general questions

Current behavior:

- The form validates locally
- On submit, it simulates a successful send and shows a confirmation state
- No mail service or API endpoint is connected yet

### Support Page

The support page highlights:

- WhatsApp support
- Phone support
- Office visits
- Common issue categories such as onboarding help, app issues, map issues, and account issues

### FAQ Page

The FAQ page answers common questions about:

- Free registration
- Registration timing
- Supported cities
- Supported vehicle types
- Required documents
- Document upload flow
- Bonus logic
- Vehicle changes
- Account blocking help
- Office location

### City Pages

The city route uses dynamic slugs for:

- Lahore
- Karachi
- Islamabad
- Rawalpindi
- Faisalabad
- Multan

Each city page includes:

- Localized hero copy
- Supported vehicle types
- Bonus examples
- Local support CTA
- Links to other cities

### Legal Pages

- Privacy policy
- Terms of service

These pages explain how user data is handled and clarify that Yango Wing Fleet is an independent registration partner.

### Thank You Page

After successful registration, users see a confirmation page with:

- Success messaging
- WhatsApp CTA
- Home navigation CTA

## Global Layout

The app uses a shared root layout that includes:

- `Header`
- Route outlet
- `Footer`
- Floating WhatsApp action button

The root route also sets document metadata, viewport settings, and global stylesheet loading.

## Header

The header includes:

- Brand logo and wordmark
- Desktop navigation
- Mobile menu toggle
- WhatsApp CTA
- Free registration CTA

Navigation links:

- Home
- Services
- How It Works
- About
- Support
- FAQ
- Contact

## Footer

The footer includes:

- Brand summary
- Quick links
- City links
- Phone numbers
- WhatsApp support link
- Email address
- Office address

## Brand Data

Shared brand values and contact information live in `src/lib/brand.ts`.

Current data includes:

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
