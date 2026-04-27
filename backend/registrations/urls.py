from django.urls import include, path
from rest_framework.routers import DefaultRouter

from registrations.views import (
    AdminRegistrationViewSet,
    PublicRegistrationCreateAPIView,
    RegistrationExportCsvAPIView,
)

router = DefaultRouter()
router.register("admin/registrations", AdminRegistrationViewSet, basename="admin-registrations")

urlpatterns = [
    path("public/registrations/", PublicRegistrationCreateAPIView.as_view(), name="public-registration-create"),
    path("admin/registrations-export.csv", RegistrationExportCsvAPIView.as_view(), name="admin-registrations-export"),
    path("", include(router.urls)),
]
