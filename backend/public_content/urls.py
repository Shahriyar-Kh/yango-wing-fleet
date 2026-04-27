from django.urls import include, path
from rest_framework.routers import DefaultRouter

from public_content.views import (
    AdminOfferViewSet,
    AdminTripBonusViewSet,
    PublicDynamicSectionsAPIView,
)

router = DefaultRouter()
router.register("admin/content/offers", AdminOfferViewSet, basename="admin-content-offers")
router.register("admin/content/trip-bonuses", AdminTripBonusViewSet, basename="admin-content-trip-bonuses")

urlpatterns = [
    path("public/dynamic-sections/", PublicDynamicSectionsAPIView.as_view(), name="public-dynamic-sections"),
    path("", include(router.urls)),
]
