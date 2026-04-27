from django.urls import path

from dashboard.views import (
    DashboardDistributionsAPIView,
    DashboardLatestActivityAPIView,
    DashboardSummaryAPIView,
    DashboardTrendsAPIView,
)

urlpatterns = [
    path("admin/dashboard/summary/", DashboardSummaryAPIView.as_view(), name="admin-dashboard-summary"),
    path("admin/dashboard/trends/", DashboardTrendsAPIView.as_view(), name="admin-dashboard-trends"),
    path("admin/dashboard/distributions/", DashboardDistributionsAPIView.as_view(), name="admin-dashboard-distributions"),
    path("admin/dashboard/latest/", DashboardLatestActivityAPIView.as_view(), name="admin-dashboard-latest"),
]
