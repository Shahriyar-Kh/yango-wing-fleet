# 🚀 Quick Start Guide - Authentication System

## For Developers

### Backend Setup (5 minutes)

1. **Verify migrations applied:**
   ```bash
   cd backend
   python manage.py migrate
   # Should show: Applying core.0001_initial... OK
   ```

2. **Start Django server:**
   ```bash
   python manage.py runserver
   # Server running on http://localhost:8000
   ```

3. **Test email configuration:**
   ```bash
   python manage.py shell
   ```
   ```python
   from django.core.mail import send_test_email
   send_test_email()
   # Should complete without errors
   ```

### Frontend Setup (3 minutes)

1. **Install dependencies (if needed):**
   ```bash
   cd frontend
   bun install  # or npm install
   ```

2. **Start dev server:**
   ```bash
   bun run dev  # or npm run dev
   # Frontend running on http://localhost:5173
   ```

3. **Verify new routes exist:**
   - http://localhost:5173/admin/login (click "Forgot password?")
   - http://localhost:5173/admin/forgot-password (should load)

### End-to-End Test (10 minutes)

1. **Request password reset:**
   - Go to http://localhost:5173/admin/forgot-password
   - Enter your admin email
   - Should see "Check Your Email" confirmation

2. **Check for email:**
   - Look in your email inbox (may take 1-2 minutes)
   - Should have email from noreply@yangowingfleet.pk
   - Subject: "Reset Your Yango Wing Fleet Password"

3. **Click reset link:**
   - Copy link from email (or check browser dev tools network tab)
   - Link format: `http://localhost:5173/admin/reset-password/<token>`

4. **Reset password:**
   - Enter new password (8+ characters, mixed case)
   - Confirm password
   - Click "Reset Password"
   - Should see success page
   - Auto-redirects to login

5. **Login with new password:**
   - Username: your admin username
   - Password: your new password
   - Should successfully log in

---

## For Users (Admin Panel Users)

### Forgot Your Password?

**Step 1: Go to Forgot Password Page**
- Visit http://yoursite.com/admin/login
- Click "Forgot password?" below the Password field

**Step 2: Enter Your Email**
- Type the email associated with your account
- Click "Send Reset Link"
- See confirmation: "Check Your Email"

**Step 3: Check Your Email**
- Look for email from Yango Wing Fleet
- Subject: "Reset Your Yango Wing Fleet Password"
- May take 1-2 minutes to arrive

**Step 4: Click Reset Link**
- Open email and click the blue "Reset Password Now" button
- Or copy the link and paste in browser

**Step 5: Create New Password**
- Enter your new password (must be 8+ characters)
- Mix of uppercase, lowercase, and numbers recommended
- Confirm by typing it again
- Click "Reset Password"

**Step 6: Log In**
- You'll see "Password Reset Successfully!" ✓
- Automatically sent to login page
- Use your new password to log in

⚠️ **Important:**
- Reset link expires in **1 hour** - Request a new one if it expires
- Password link is only valid for your email - Can't be shared
- Only you can use your reset link - It's tied to your email address
- Password reset is always secure - We'll send confirmation email after change

### If You Don't Receive the Email

1. **Check spam folder** - Gmail, Outlook may filter it
2. **Wait 2 minutes** - Email can take time to deliver
3. **Request again** - May try 5 times per hour
4. **Contact support:**
   - 📱 WhatsApp: +92 323-1213999
   - ☎️ Call: 0323-1213999
   - 🌐 Visit: yangowingfleet.pk

---

## Environment Variables Checklist

### For Development (.env file in backend/)

```bash
# Must have for password reset to work:
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=Yango Wing Fleet <your-email@gmail.com>
ADMIN_NOTIFICATION_EMAIL=admin@yangowingfleet.pk
FRONTEND_BASE_URL=http://localhost:5173

# Optional (defaults shown):
PASSWORD_RESET_TOKEN_EXPIRY_HOURS=1
PASSWORD_RESET_REQUEST_RATE_LIMIT=5/hour
```

### Gmail Setup

If using Gmail for email:

1. Enable 2-Factor Authentication on Gmail account
2. Create "App Password" at https://myaccount.google.com/apppasswords
3. Use that password in EMAIL_HOST_PASSWORD
4. Never share this password

---

## Troubleshooting

### "Invalid or expired reset link"

**Cause:** Token has expired (1 hour passed) or already used

**Fix:**
1. Request a new password reset
2. Use new link immediately
3. Contact support if issue persists

### "Email not received"

**Cause:** Email configuration, firewall, or Gmail rules

**Fix:**
1. Check email spam/junk folder
2. Wait 2 minutes and try again
3. Verify EMAIL_HOST_PASSWORD is correct
4. Check firewall allows port 587

### "Passwords do not match"

**Cause:** Typed passwords differently

**Fix:**
1. Re-enter password carefully
2. Use "Show password" button to verify
3. Confirm both fields match exactly

### "Password is too weak"

**Cause:** Password doesn't meet requirements

**Fix:**
Needs:
- At least 8 characters
- Mix of uppercase (A-Z) and lowercase (a-z)
- At least one number (0-9)
- Recommended: Special character (!@#$%^&*)

Example good password: `MyPassword123!`

### "Too many requests"

**Cause:** Requested reset more than 5 times in 1 hour

**Fix:**
1. Wait 1 hour and try again
2. Check you're using correct email
3. Contact support for manual reset

---

## Technical Reference

### API Endpoints

| Method | Endpoint | Purpose | Rate Limit |
|--------|----------|---------|-----------|
| POST | /api/auth/password-reset/request/ | Request reset | 5/hour |
| GET | /api/auth/password-reset/verify/ | Verify token | None |
| POST | /api/auth/password-reset/confirm/ | Confirm reset | None |

### Frontend Routes

| Route | Purpose | Public |
|-------|---------|--------|
| /admin/login | Login page | ✓ |
| /admin/forgot-password | Request reset | ✓ |
| /admin/reset-password/:token | Reset form | ✓ |
| /admin/reset-password-success | Success page | ✓ |
| /admin/dashboard | Admin panel | ✗ |

---

## Security Best Practices

✓ **DO:**
- Use strong passwords (8+ chars, mixed case, numbers)
- Keep your email account secure (2FA enabled)
- Don't share reset links with others
- Log out after using admin panel
- Report suspicious emails to support

✗ **DON'T:**
- Share your password with anyone
- Write passwords in emails or chat
- Use same password for multiple accounts
- Click reset links from suspicious emails
- Leave admin panel logged in unattended

---

## Support Resources

📚 **Full Documentation:** See [AUTHENTICATION_GUIDE.md](../AUTHENTICATION_GUIDE.md)

📞 **Get Help:**
- **WhatsApp:** +92 323-1213999
- **Phone:** 0323-1213999
- **Website:** yangowingfleet.pk
- **Email:** admin@yangowingfleet.pk

✓ **Ready to go!** Your authentication system is secure and production-ready.
