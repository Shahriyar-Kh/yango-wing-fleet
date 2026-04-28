import logging

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.conf import settings

from core.utils.responses import api_success, api_error
from core.serializers import (
    PasswordResetRequestSerializer,
    PasswordResetVerifySerializer,
    PasswordResetConfirmSerializer,
)
from core.models import PasswordResetToken
from core.throttles import PasswordResetRateThrottle
from core.services.email_service import send_templated_email


logger = logging.getLogger(__name__)


class PasswordResetRequestAPIView(APIView):
    """
    Request password reset.
    
    POST /api/auth/password-reset/request/
    
    Body: { "email": "user@example.com" }
    
    Security features:
    - Rate limited (5 requests per hour per IP)
    - Validates email exists
    - Generates secure token
    - Sends email with reset link
    - No error disclosure (doesn't reveal if email exists)
    """
    permission_classes = [AllowAny]
    throttle_classes = [PasswordResetRateThrottle]

    def post(self, request):
        logger.info(f"Password reset request from IP: {self._get_client_ip(request)}")
        
        serializer = PasswordResetRequestSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"Password reset request validation failed: {serializer.errors}")
            # Return explicit validation error so frontend can show 'email not registered'
            return api_error(
                message="No account found with this email address.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        email = serializer.validated_data["email"]
        logger.info(f"Processing password reset for email: {email}")

        try:
            # Case-insensitive lookup for email to tolerate user input casing
            user = User.objects.filter(email__iexact=email).first()
            if not user:
                logger.info(f"Password reset request for non-existent email after validation: {email}")
                # Return generic success to avoid timing differences
                return api_success(
                    data={"email": email},
                    message="If an account exists with this email, a password reset link has been sent.",
                    status_code=status.HTTP_200_OK,
                )
            logger.info(f"User found for email: {user.email}, creating reset token")
            
            # Create secure reset token
            token_obj = PasswordResetToken.create_for_user(user, request)
            logger.info(f"Reset token created for user {user.id}: {token_obj.token[:10]}...")

            # Build reset link
            reset_link = f"{settings.FRONTEND_BASE_URL}/admin/reset-password/{token_obj.token}"

            # Send reset email
            context = {
                "user": user,
                "reset_link": reset_link,
            }

            logger.info(f"Sending password reset email to: {user.email}")
            send_templated_email(
                subject="Reset Your Yango Wing Fleet Password",
                template_name="emails/password_reset.html",
                context=context,
                to_emails=[user.email],
            )
            logger.info(f"Password reset email sent successfully to: {user.email}")

        except User.DoesNotExist:
            logger.info(f"Password reset request for non-existent email: {email} (not logged to user for security)")
        except Exception as e:
            logger.exception(f"Password reset process failed for email {email}: {str(e)}")

        # Always return success to user (security best practice)
        return api_success(
            data={"email": email},
            message="If an account exists with this email, a password reset link has been sent.",
            status_code=status.HTTP_200_OK,
        )

    @staticmethod
    def _get_client_ip(request):
        forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")


class PasswordResetVerifyAPIView(APIView):
    """
    Verify that a password reset token is valid.
    
    GET /api/auth/password-reset/verify/?token=xxx
    
    Returns user email if token is valid.
    Used by frontend to validate token before showing reset form.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.query_params.get("token")
        logger.info(f"Password reset verify request: token={token[:10] if token else 'missing'}...")
        
        if not token:
            logger.warning("Password reset verify: token parameter missing")
            return api_error(
                message="Token is required",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        serializer = PasswordResetVerifySerializer(data={"token": token})
        if not serializer.is_valid():
            logger.warning(f"Password reset verify validation failed: {serializer.errors}")
            return api_error(
                message="Invalid or expired reset link.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token_obj = PasswordResetToken.objects.get(token=token)
            logger.info(f"Token verified successfully: user_id={token_obj.user.id}, expires={token_obj.expires_at}")
            
            return api_success(
                data={
                    "token": token,
                    "email": token_obj.email,
                    "expires_at": token_obj.expires_at,
                },
                message="Token is valid",
                status_code=status.HTTP_200_OK,
            )
        except PasswordResetToken.DoesNotExist:
            logger.warning(f"Password reset verify: token not found: {token[:10]}...")
            return api_error(
                message="Invalid or expired reset link.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )


class PasswordResetConfirmAPIView(APIView):
    """
    Confirm password reset with new password.
    
    POST /api/auth/password-reset/confirm/
    
    Body: {
        "token": "xxx",
        "new_password": "NewPassword123!",
        "new_password_confirm": "NewPassword123!"
    }
    
    Security features:
    - Validates token
    - Validates password strength
    - Mark token as used (single-use)
    - Invalidate all other reset tokens for user
    - Send confirmation email
    """
    permission_classes = [AllowAny]

    def post(self, request):
        logger.info(f"Password reset confirm request from IP: {self._get_client_ip(request)}")
        
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            logger.warning(f"Password reset confirm validation failed: {serializer.errors}")
            return api_error(
                message="Validation failed",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]
        logger.info(f"Processing password reset confirmation with token: {token[:10]}...")

        try:
            token_obj = PasswordResetToken.objects.get(token=token)
            logger.info(f"Token found, user_id: {token_obj.user.id}")

            # Additional validation (should already be checked in serializer)
            if not token_obj.is_valid():
                logger.warning(f"Token is invalid or expired: {token[:10]}...")
                return api_error(
                    message="Reset link has expired or has already been used.",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            # Get the user
            user = token_obj.user
            logger.info(f"Resetting password for user {user.id} ({user.email})")

            # Set new password
            user.set_password(new_password)
            user.save(update_fields=["password"])
            logger.info(f"Password updated for user {user.id}")

            # Mark token as used
            token_obj.mark_as_used()
            logger.info(f"Reset token marked as used: {token[:10]}...")

            # Invalidate all other unused tokens for this user
            deleted_count, _ = PasswordResetToken.objects.filter(
                user=user,
                is_used=False,
            ).delete()
            logger.info(f"Deleted {deleted_count} unused reset tokens for user {user.id}")

            # Send confirmation email
            context = {
                "user": user,
                "login_link": f"{settings.FRONTEND_BASE_URL}/admin/login",
                "support_link": f"{settings.FRONTEND_BASE_URL}/support",
            }

            logger.info(f"Sending password reset success email to: {user.email}")
            try:
                send_templated_email(
                    subject="Your Password Was Changed - Yango Wing Fleet",
                    template_name="emails/password_reset_success.html",
                    context=context,
                    to_emails=[user.email],
                )
                logger.info(f"Confirmation email sent successfully to: {user.email}")
            except Exception as e:
                logger.exception(f"Failed to send confirmation email to {user.email}: {str(e)}")
                # Don't fail the reset if confirmation email fails

            logger.info(f"Password reset completed successfully for user {user.id}")
            return api_success(
                data={"email": user.email},
                message="Password reset successfully. You can now log in with your new password.",
                status_code=status.HTTP_200_OK,
            )

        except PasswordResetToken.DoesNotExist:
            logger.warning(f"Password reset confirm: token not found: {token[:10]}...")
            return api_error(
                message="Invalid or expired reset link.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            logger.exception(f"Password reset confirm failed for token {token[:10]}...: {str(e)}")
            return api_error(
                message="An error occurred while resetting your password. Please try again.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
