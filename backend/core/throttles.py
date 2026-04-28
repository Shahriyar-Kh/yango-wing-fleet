from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class RegistrationSubmitRateThrottle(AnonRateThrottle):
    scope = "registration_submit"


class InquirySubmitRateThrottle(AnonRateThrottle):
    scope = "inquiry_submit"


class PasswordResetRateThrottle(AnonRateThrottle):
    """Rate limit password reset requests to prevent abuse."""
    scope = "password_reset_request"
