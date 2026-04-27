from django.urls import include, path
from rest_framework.routers import DefaultRouter

from public_content.views import (
    AdminCityGoalViewSet,
    AdminOfferViewSet,
    AdminPromoBannerViewSet,
    AdminTripBonusViewSet,
    PublicDynamicSectionsAPIView,
)

router = DefaultRouter()
router.register("admin/content/offers", AdminOfferViewSet, basename="admin-content-offers")
router.register("admin/content/promo-banners", AdminPromoBannerViewSet, basename="admin-content-promo-banners")
router.register("admin/content/city-goals", AdminCityGoalViewSet, basename="admin-content-city-goals")
router.register("admin/content/trip-bonuses", AdminTripBonusViewSet, basename="admin-content-trip-bonuses")

urlpatterns = [
    path("public/dynamic-sections/", PublicDynamicSectionsAPIView.as_view(), name="public-dynamic-sections"),
    path("", include(router.urls)),
]
