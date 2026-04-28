/* eslint-disable */
// @ts-nocheck

import { Route as rootRouteImport } from './routes/__root'
import { Route as ThankYouRouteImport } from './routes/thank-you'
import { Route as TermsRouteImport } from './routes/terms'
import { Route as SupportRouteImport } from './routes/support'
import { Route as ServicesRouteImport } from './routes/services'
import { Route as RegistrationRouteImport } from './routes/registration'
import { Route as PrivacyRouteImport } from './routes/privacy'
import { Route as HowItWorksRouteImport } from './routes/how-it-works'
import { Route as FaqRouteImport } from './routes/faq'
import { Route as ContactRouteImport } from './routes/contact'
import { Route as AboutRouteImport } from './routes/about'
import { Route as IndexRouteImport } from './routes/index'
import { Route as CitiesCityRouteImport } from './routes/cities.$city'
import { Route as AdminResetPasswordSuccessRouteImport } from './routes/admin/reset-password-success'
import { Route as AdminLoginRouteImport } from './routes/admin/login'
import { Route as AdminForgotPasswordRouteImport } from './routes/admin/forgot-password'
import { Route as AdminDashboardRouteImport } from './routes/admin/dashboard'
import { Route as AdminResetPasswordTokenRouteImport } from './routes/admin/reset-password.$token'
// ✅ NEW: add the admin index route (handles /admin/)
import { Route as AdminIndexRouteImport } from './routes/admin/index'

const ThankYouRoute = ThankYouRouteImport.update({ id: '/thank-you', path: '/thank-you', getParentRoute: () => rootRouteImport } as any)
const TermsRoute = TermsRouteImport.update({ id: '/terms', path: '/terms', getParentRoute: () => rootRouteImport } as any)
const SupportRoute = SupportRouteImport.update({ id: '/support', path: '/support', getParentRoute: () => rootRouteImport } as any)
const ServicesRoute = ServicesRouteImport.update({ id: '/services', path: '/services', getParentRoute: () => rootRouteImport } as any)
const RegistrationRoute = RegistrationRouteImport.update({ id: '/registration', path: '/registration', getParentRoute: () => rootRouteImport } as any)
const PrivacyRoute = PrivacyRouteImport.update({ id: '/privacy', path: '/privacy', getParentRoute: () => rootRouteImport } as any)
const HowItWorksRoute = HowItWorksRouteImport.update({ id: '/how-it-works', path: '/how-it-works', getParentRoute: () => rootRouteImport } as any)
const FaqRoute = FaqRouteImport.update({ id: '/faq', path: '/faq', getParentRoute: () => rootRouteImport } as any)
const ContactRoute = ContactRouteImport.update({ id: '/contact', path: '/contact', getParentRoute: () => rootRouteImport } as any)
const AboutRoute = AboutRouteImport.update({ id: '/about', path: '/about', getParentRoute: () => rootRouteImport } as any)
const IndexRoute = IndexRouteImport.update({ id: '/', path: '/', getParentRoute: () => rootRouteImport } as any)
const CitiesCityRoute = CitiesCityRouteImport.update({ id: '/cities/$city', path: '/cities/$city', getParentRoute: () => rootRouteImport } as any)
const AdminResetPasswordSuccessRoute = AdminResetPasswordSuccessRouteImport.update({ id: '/admin/reset-password-success', path: '/admin/reset-password-success', getParentRoute: () => rootRouteImport } as any)
const AdminLoginRoute = AdminLoginRouteImport.update({ id: '/admin/login', path: '/admin/login', getParentRoute: () => rootRouteImport } as any)
const AdminForgotPasswordRoute = AdminForgotPasswordRouteImport.update({ id: '/admin/forgot-password', path: '/admin/forgot-password', getParentRoute: () => rootRouteImport } as any)
const AdminDashboardRoute = AdminDashboardRouteImport.update({ id: '/admin/dashboard', path: '/admin/dashboard', getParentRoute: () => rootRouteImport } as any)
const AdminResetPasswordTokenRoute = AdminResetPasswordTokenRouteImport.update({ id: '/admin/reset-password/$token', path: '/admin/reset-password/$token', getParentRoute: () => rootRouteImport } as any)
// ✅ NEW: add admin index route
const AdminIndexRoute = AdminIndexRouteImport.update({ id: '/admin/', path: '/admin/', getParentRoute: () => rootRouteImport } as any)

const rootRouteChildren = {
  IndexRoute,
  AboutRoute,
  ContactRoute,
  FaqRoute,
  HowItWorksRoute,
  PrivacyRoute,
  RegistrationRoute,
  ServicesRoute,
  SupportRoute,
  TermsRoute,
  ThankYouRoute,
  AdminDashboardRoute,
  AdminForgotPasswordRoute,
  AdminLoginRoute,
  AdminResetPasswordSuccessRoute,
  CitiesCityRoute,
  AdminResetPasswordTokenRoute,
  AdminIndexRoute, // ✅ added
}

export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes()