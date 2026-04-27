from rest_framework.throttling import AnonRateThrottle


class RegistrationSubmitRateThrottle(AnonRateThrottle):
    scope = "registration_submit"


class InquirySubmitRateThrottle(AnonRateThrottle):
    scope = "inquiry_submit"
