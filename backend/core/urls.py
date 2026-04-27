from django.urls import path

from core.views import HealthCheckAPIView

urlpatterns = [
    path("health/", HealthCheckAPIView.as_view(), name="health-check"),
]
