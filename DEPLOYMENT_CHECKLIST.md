# 📋 Production Deployment Checklist

Use this checklist when deploying the authentication system to production.

## Pre-Deployment (Do This Before Going Live)

### 1. Security Review
- [ ] Review AUTHENTICATION_GUIDE.md security checklist
- [ ] Verify all endpoints have CSRF protection
- [ ] Confirm rate limiting is enabled
- [ ] Check password validation requirements
- [ ] Review email template content for typos
- [ ] Verify no sensitive data in error messages
- [ ] Test with penetration testing if possible

### 2. Environment Setup
- [ ] Create `.env` file with production variables
- [ ] Set `DJANGO_DEBUG=False`
- [ ] Generate strong `DJANGO_SECRET_KEY`
- [ ] Set production `ALLOWED_HOSTS`
- [ ] Configure PostgreSQL (not SQLite)
- [ ] Set production `DATABASE_URL`
- [ ] Configure production email account
- [ ] Set production `FRONTEND_BASE_URL`
- [ ] Update `CORS_ALLOWED_ORIGINS` with frontend domain
- [ ] Update `CSRF_TRUSTED_ORIGINS` with frontend domain

### 3. Gmail/Email Setup
- [ ] Create Gmail account for notifications (or use existing)
- [ ] Enable 2-Factor Authentication on Gmail
- [ ] Generate App Password at https://myaccount.google.com/apppasswords
- [ ] Update `EMAIL_HOST_USER` with email
- [ ] Update `EMAIL_HOST_PASSWORD` with app password
- [ ] Test email delivery:
     ```bash
     python manage.py shell
     from core.services.email_service import send_html_email
     send_html_email(
         subject="Test Email",
         html_content="<p>Test</p>",
         to_emails=["your-email@example.com"],
     )
     ```
- [ ] Verify test email received
- [ ] Check email formatting on multiple devices

### 4. Database Migrations
- [ ] Backup existing database
- [ ] Run migrations on production database:
     ```bash
     python manage.py migrate
     ```
- [ ] Verify migration succeeded without errors
- [ ] Check PasswordResetToken table exists:
     ```bash
     python manage.py dbshell
     SELECT * FROM core_passwordresettoken LIMIT 1;
     ```

### 5. Frontend Configuration
- [ ] Update API base URL in `frontend/.env`
- [ ] Verify password reset endpoints in API config
- [ ] Build frontend for production:
     ```bash
     bun run build  # or npm run build
     ```
- [ ] Test all password reset routes
- [ ] Verify email links in templates use production URLs
- [ ] Check SSL/HTTPS on all pages

### 6. Testing (In Production Environment)
- [ ] Test complete password reset flow
- [ ] Verify email delivery
- [ ] Test rate limiting (request 6 times quickly)
- [ ] Verify error messages are helpful but not revealing
- [ ] Test on multiple devices/browsers
- [ ] Test email rendering on Gmail, Outlook, Apple Mail
- [ ] Verify CSRF protection working
- [ ] Test token expiration (wait 1 hour)
- [ ] Test single-use token enforcement (reuse link)
- [ ] Verify audit trail logs IP/user agent
- [ ] Test with slow network
- [ ] Test concurrent reset requests

### 7. Security Testing
- [ ] Try to reset password without email verification
- [ ] Try to use expired token
- [ ] Try to reuse token twice
- [ ] Try to reset someone else's password
- [ ] Verify token not in plain logs
- [ ] Check for SQL injection in endpoints
- [ ] Test CSRF without token
- [ ] Verify no session auto-clear (must login after reset)
- [ ] Test with invalid email format
- [ ] Verify rate limiting blocks after 5 requests

### 8. Documentation
- [ ] Update README.md with new features
- [ ] Document admin password reset process
- [ ] Create support ticket template for password issues
- [ ] Document how to manually reset password if needed
- [ ] Add emergency procedures to runbook

### 9. Monitoring Setup
- [ ] Configure email delivery monitoring
- [ ] Set up error logging/alerting
- [ ] Monitor password reset endpoint response times
- [ ] Track rate limit hits
- [ ] Monitor token expiration logs
- [ ] Set up alerts for email delivery failures
- [ ] Create dashboard for password reset metrics

### 10. Communication
- [ ] Notify admin users about new password reset feature
- [ ] Provide "Forgot Password" help documentation
- [ ] Update support team FAQ
- [ ] Train support staff on manual password resets
- [ ] Create email templates for support tickets
- [ ] Publish help article on website

## Post-Deployment (After Going Live)

### Day 1
- [ ] Monitor email delivery (check for errors)
- [ ] Monitor API response times
- [ ] Check error logs for issues
- [ ] Test password reset yourself
- [ ] Verify confirmation emails arriving
- [ ] Monitor rate limiting
- [ ] Check database for token cleanup
- [ ] Follow up with support team

### Week 1
- [ ] Collect user feedback on UX
- [ ] Monitor completion rates
- [ ] Check for common error patterns
- [ ] Verify email formatting on all clients
- [ ] Review security logs for attacks
- [ ] Check database growth of tokens
- [ ] Monitor email account quota
- [ ] Adjust rate limits if needed

### Ongoing
- [ ] Weekly backup verification
- [ ] Monthly security audit of endpoints
- [ ] Quarterly rate limit review
- [ ] Clean up old reset tokens (SQL):
     ```sql
     DELETE FROM core_passwordresettoken 
     WHERE expires_at < NOW() - INTERVAL '7 days';
     ```
- [ ] Monitor email delivery trends
- [ ] Review authentication logs
- [ ] Track password reset usage metrics
- [ ] Update documentation as needed

## Rollback Plan

If issues occur in production:

### Option 1: Disable Password Reset (Quick Fix)
```python
# In settings.py, temporarily comment out:
# path('api/auth/password-reset/request/', ...),
# path('api/auth/password-reset/verify/', ...),
# path('api/auth/password-reset/confirm/', ...),
```

### Option 2: Revert Frontend Routes
```bash
git revert <commit>
bun run build
# Deploy previous version
```

### Option 3: Full Database Rollback
```bash
# If migrations caused issues:
python manage.py migrate core 0  # Reverse to previous state
# Restore from backup
```

### Option 4: Manual Password Reset
```python
from django.contrib.auth.models import User
user = User.objects.get(username='admin')
user.set_password('temporary_password')
user.save()
# Email user temporary password through other channel
```

## Emergency Procedures

### Email Delivery Down
1. Check Gmail account status
2. Verify credentials in settings
3. Check server firewall/port 587
4. Switch to backup email service if available
5. Notify users via support chat
6. Provide manual reset option

### Rate Limiting Too Strict
1. Increase limit temporarily:
   ```python
   PASSWORD_RESET_REQUEST_RATE_LIMIT = "20/hour"
   ```
2. Communicate change to support team
3. Adjust based on actual usage patterns

### Token Expiration Too Short
1. Increase if users reporting expired links:
   ```python
   PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 4  # Up from 1
   ```
2. Document the change
3. Communicate to users

### Database Table Growing Large
```sql
-- Clean up old used tokens
DELETE FROM core_passwordresettoken 
WHERE is_used = true 
AND used_at < NOW() - INTERVAL '30 days';

-- Clean up old expired tokens
DELETE FROM core_passwordresettoken 
WHERE expires_at < NOW() - INTERVAL '7 days';
```

## Performance Optimization

If seeing performance issues:

### Database Optimization
```sql
-- Create index on frequently queried fields
CREATE INDEX idx_password_token_lookup 
ON core_passwordresettoken(token, is_used);

-- Analyze query plans
EXPLAIN ANALYZE 
SELECT * FROM core_passwordresettoken 
WHERE token = '...' AND is_used = false;
```

### Email Optimization
```python
# Send emails asynchronously with Celery (optional)
from celery import shared_task

@shared_task
def send_password_reset_email(token_id):
    # Async email sending
    pass
```

### Caching
```python
# Cache verification results briefly
from django.views.decorators.cache import cache_page
@cache_page(60)  # Cache for 60 seconds
def verify_token(request):
    # Returns cached validation
    pass
```

## Metrics to Track

Set up monitoring for:

| Metric | Target | Alert |
|--------|--------|-------|
| Email delivery rate | > 99% | < 95% |
| Password reset completion | > 80% | < 60% |
| API response time | < 200ms | > 500ms |
| Rate limit hits/day | < 10 | > 50 |
| Token expiration rate | Normal | Spike |
| Database tokens size | < 1GB | > 5GB |
| Error rate | < 0.1% | > 1% |

## Contacts & Escalation

- **Developer Lead:** [Name/Contact]
- **DevOps/Infrastructure:** [Name/Contact]
- **Email Service Admin:** [Name/Contact]
- **Security Team:** [Name/Contact]
- **Support Manager:** [Name/Contact]

---

**Deployment Date:** _______________  
**Deployed By:** _______________  
**QA Sign-off:** _______________  
**Production Verified:** _______________

### Sign-offs
- [ ] Backend Team Lead
- [ ] Frontend Team Lead
- [ ] DevOps Engineer
- [ ] Security Officer
- [ ] Product Manager

---

✓ **Deployment ready when all items checked!**
