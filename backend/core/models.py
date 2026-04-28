import secrets
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta


class PasswordResetToken(models.Model):
    """
    Secure password reset token model.
    
    Features:
    - Single-use tokens (marked as used after verification)
    - Time-limited (1 hour default expiry)
    - Email verification (token tied to specific email)
    - Audit trail (IP, user agent, timestamps)
    - Prevents unauthorized reset attempts
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="password_reset_tokens")
    email = models.EmailField()  # Verify token was meant for this email
    token = models.CharField(max_length=64, unique=True, db_index=True)  # Secure random token
    is_used = models.BooleanField(default=False)  # Prevent token reuse
    expires_at = models.DateTimeField(db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(blank=True, null=True)

    # Audit trail
    source_ip = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["token"]),
            models.Index(fields=["user", "is_used"]),
            models.Index(fields=["expires_at"]),
        ]

    def __str__(self):
        return f"Reset token for {self.user.email} (expires: {self.expires_at.strftime('%Y-%m-%d %H:%M')})"

    @classmethod
    def generate_token(cls):
        """Generate a secure, random 64-character token."""
        return secrets.token_urlsafe(48)

    @classmethod
    def create_for_user(cls, user, request, expiry_hours=1):
        """
        Create a new password reset token for a user.
        
        Args:
            user: Django User instance
            request: HTTP request (for IP and user agent), or None for testing
            expiry_hours: How long until token expires (default 1 hour)
        
        Returns:
            PasswordResetToken instance
        """
        # Invalidate any existing unused tokens for this user
        cls.objects.filter(user=user, is_used=False).delete()

        token = cls.generate_token()
        expires_at = timezone.now() + timedelta(hours=expiry_hours)

        # Extract client IP (handle None request for testing)
        if request:
            forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
            if forwarded_for:
                source_ip = forwarded_for.split(",")[0].strip()
            else:
                source_ip = request.META.get("REMOTE_ADDR", "127.0.0.1")
            user_agent = request.META.get("HTTP_USER_AGENT", "")[:500]
        else:
            # Testing/CLI context
            source_ip = "127.0.0.1"
            user_agent = "Test/CLI"

        return cls.objects.create(
            user=user,
            email=user.email,
            token=token,
            expires_at=expires_at,
            source_ip=source_ip,
            user_agent=user_agent,
        )

    def is_valid(self):
        """Check if token is still valid (not expired and not used)."""
        return not self.is_used and timezone.now() < self.expires_at

    def mark_as_used(self):
        """Mark token as used to prevent reuse."""
        self.is_used = True
        self.used_at = timezone.now()
        self.save(update_fields=["is_used", "used_at"])
