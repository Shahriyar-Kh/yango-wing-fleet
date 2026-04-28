from django.urls import path

from core.views import HealthCheckAPIView
from core.auth_views import (
    PasswordResetRequestAPIView,
    PasswordResetVerifyAPIView,
    PasswordResetConfirmAPIView,
)

urlpatterns = [
    path("health/", HealthCheckAPIView.as_view(), name="health-check"),
    # ── Authentication & Password Reset ──────────────────────────────────
    path("auth/password-reset/request/", PasswordResetRequestAPIView.as_view(), name="password-reset-request"),
    path("auth/password-reset/verify/", PasswordResetVerifyAPIView.as_view(), name="password-reset-verify"),
    path("auth/password-reset/confirm/", PasswordResetConfirmAPIView.as_view(), name="password-reset-confirm"),
]
