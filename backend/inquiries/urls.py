from django.urls import include, path
from rest_framework.routers import DefaultRouter

from inquiries.views import AdminInquiryViewSet, InquiryExportCsvAPIView, PublicInquiryCreateAPIView

router = DefaultRouter()
router.register("admin/inquiries", AdminInquiryViewSet, basename="admin-inquiries")

urlpatterns = [
    path("public/inquiries/", PublicInquiryCreateAPIView.as_view(), name="public-inquiry-create"),
    path("admin/inquiries-export.csv", InquiryExportCsvAPIView.as_view(), name="admin-inquiry-export"),
    path("", include(router.urls)),
]
