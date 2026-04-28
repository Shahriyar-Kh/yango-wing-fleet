from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from core.models import PasswordResetToken


class PasswordResetRequestSerializer(serializers.Serializer):
    """
    Request password reset by email.
    
    Validates that:
    - Email exists in the system
    - Email belongs to an active user
    - Rate limiting will be checked at the view level
    """
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        """Check that user with this email exists."""
        # Use case-insensitive lookup to avoid subtle mismatches.
        qs = User.objects.filter(email__iexact=value)
        if not qs.exists():
            raise serializers.ValidationError("No account found with this email address.")
        # Ensure the account is active
        if not qs.filter(is_active=True).exists():
            raise serializers.ValidationError("No active account found with this email address.")
        return value


class PasswordResetVerifySerializer(serializers.Serializer):
    """Verify that a password reset token is valid."""
    token = serializers.CharField(max_length=64, required=True)

    def validate_token(self, value):
        """Check that token exists and is valid."""
        try:
            token_obj = PasswordResetToken.objects.get(token=value)
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired reset link.")

        if not token_obj.is_valid():
            raise serializers.ValidationError("Reset link has expired or has already been used.")

        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Confirm password reset with new password.
    
    Validates:
    - Token is valid
    - New password meets requirements
    - New password is not empty
    """
    token = serializers.CharField(max_length=64, required=True)
    new_password = serializers.CharField(
        write_only=True,
        min_length=8,
        required=True,
        style={"input_type": "password"},
    )
    new_password_confirm = serializers.CharField(
        write_only=True,
        min_length=8,
        required=True,
        style={"input_type": "password"},
    )

    def validate_token(self, value):
        """Check that token exists and is valid."""
        try:
            token_obj = PasswordResetToken.objects.get(token=value)
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired reset link.")

        if not token_obj.is_valid():
            raise serializers.ValidationError("Reset link has expired or has already been used.")

        return value

    def validate(self, attrs):
        """
        Validate that:
        - Passwords match
        - Password meets Django validation requirements
        """
        new_password = attrs.get("new_password")
        new_password_confirm = attrs.get("new_password_confirm")
        token = attrs.get("token")

        if new_password != new_password_confirm:
            raise serializers.ValidationError({
                "new_password_confirm": "Passwords do not match."
            })

        # Validate password strength
        try:
            validate_password(new_password)
        except Exception as e:
            raise serializers.ValidationError({
                "new_password": str(e)
            })

        return attrs
