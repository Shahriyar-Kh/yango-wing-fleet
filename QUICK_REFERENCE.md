# 🎯 Authentication System - Quick Reference Card

## API Endpoints (Cheat Sheet)

```
# Request Password Reset
curl -X POST http://localhost:8000/api/auth/password-reset/request/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'

# Verify Token
curl -X GET "http://localhost:8000/api/auth/password-reset/verify/?token=<token>"

# Confirm Reset
curl -X POST http://localhost:8000/api/auth/password-reset/confirm/ \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<token>",
    "new_password": "NewPass123!",
    "new_password_confirm": "NewPass123!"
  }'
```

## Frontend Routes

| Route | Purpose |
|-------|---------|
| `/admin/login` | Login page (has forgot password link) |
| `/admin/forgot-password` | Request password reset |
| `/admin/reset-password/:token` | Reset password form |
| `/admin/reset-password-success` | Success confirmation |

## Environment Variables

```bash
# Required for email
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
FRONTEND_BASE_URL=http://localhost:5173
ADMIN_NOTIFICATION_EMAIL=admin@yangowingfleet.pk

# Optional (defaults shown)
PASSWORD_RESET_TOKEN_EXPIRY_HOURS=1
PASSWORD_RESET_REQUEST_RATE_LIMIT=5/hour
```

## Database Queries

```bash
# Check active reset tokens
python manage.py shell
```

```python
from core.models import PasswordResetToken
from django.utils import timezone

# Valid tokens
active = PasswordResetToken.objects.filter(
    is_used=False,
    expires_at__gt=timezone.now()
)
print(f"Active: {active.count()}")

# Expired tokens
expired = PasswordResetToken.objects.filter(
    expires_at__lt=timezone.now()
)
print(f"Expired: {expired.count()}")

# Clean up old tokens
PasswordResetToken.objects.filter(
    expires_at__lt=timezone.now()
).delete()
```

## Testing Flows

### User Flow
1. `/admin/login` → Click "Forgot password?"
2. `/admin/forgot-password` → Enter email
3. Check email for reset link
4. `/admin/reset-password/<token>` → Enter new password
5. `/admin/reset-password-success` → Auto-redirect to login
6. `/admin/login` → Login with new password

### Developer Testing
```bash
# Start backend
cd backend && python manage.py runserver

# Start frontend
cd frontend && bun run dev

# Go to http://localhost:5173/admin/forgot-password
# Use your email (must be configured in settings)
```

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Email not received | Check spam folder, wait 2 min, verify credentials |
| "Token expired" | Re-request, token valid 1 hour |
| "Can't reuse token" | Use same link only once |
| Rate limit error | Wait 1 hour or change IP |
| CSRF error | Frontend origin in CSRF_TRUSTED_ORIGINS |
| "Password too weak" | 8+ chars, mix upper/lower, numbers |

## File Locations

| File | Purpose |
|------|---------|
| `core/auth_views.py` | API endpoints |
| `core/serializers.py` | Validation logic |
| `core/models.py` | Database model |
| `core/templates/emails/` | Email templates |
| `src/routes/admin/forgot-password.tsx` | Request page |
| `src/routes/admin/reset-password.$token.tsx` | Reset form |
| `src/routes/admin/reset-password-success.tsx` | Success page |

## Rate Limiting

- **Limit:** 5 requests per hour per IP
- **Reset:** Automatic after 1 hour
- **Override:** `PASSWORD_RESET_REQUEST_RATE_LIMIT` setting
- **Check:** Look for `429 Too Many Requests` status

## Token Details

- **Length:** 64 characters (URL-safe)
- **Expiry:** 1 hour (configurable)
- **Reusable:** No (single-use only)
- **Tied to:** User email (email verification)
- **Storage:** Database (core_passwordresettoken)

## Security Checklist

- [x] CSRF protection enabled
- [x] Rate limiting active
- [x] Tokens time-limited
- [x] Tokens single-use
- [x] Email verified
- [x] Password validated
- [x] No sensitive logs
- [x] Audit trail kept

## Monitoring

```python
# Email delivery status
from django.core.mail import outbox  # In tests

# API performance
# Monitor: /api/auth/password-reset/* endpoints

# Rate limiting
# Check: RateLimitHandler logs

# Database
# SELECT COUNT(*) FROM core_passwordresettoken;
# SELECT COUNT(*) FROM core_passwordresettoken WHERE is_used=true;
```

## Deployment Reminders

- [ ] Run `python manage.py migrate`
- [ ] Configure Gmail app password
- [ ] Test email delivery
- [ ] Set `DJANGO_DEBUG=False`
- [ ] Update CORS/CSRF origins
- [ ] Verify FRONTEND_BASE_URL
- [ ] Monitor first 24 hours
- [ ] Train support team

## Support Links

📚 **Docs:**
- QUICK_START_AUTH.md (5-min guide)
- AUTHENTICATION_GUIDE.md (complete reference)
- DEPLOYMENT_CHECKLIST.md (production)

📞 **Help:**
- WhatsApp: +92 323-1213999
- Email: admin@yangowingfleet.pk
- Phone: 0323-1213999

---

**Print this page or bookmark it for quick reference!** 📌

---

## Useful Django Commands

```bash
# Check system
python manage.py check

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Reset migrations (dev only)
python manage.py migrate core zero

# Database shell
python manage.py dbshell

# Interactive shell
python manage.py shell

# Run tests (if added)
python manage.py test core
```

## Useful Frontend Commands

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Build for production
bun run build

# Run tests (if added)
bun run test

# Format code
bun run format

# Lint code
bun run lint
```

---

**Version:** 1.0.0 | **Updated:** April 28, 2026 | **Status:** ✅ Production Ready
