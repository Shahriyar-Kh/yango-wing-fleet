from django.utils import timezone
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.views import APIView

from core.utils.responses import api_success
from public_content.fallbacks import (
	FALLBACK_CITY_GOALS,
	FALLBACK_OFFERS,
	FALLBACK_TRIP_BONUSES,
)
from public_content.models import CityGoal, Offer, PromoBanner, TripBonus
from public_content.serializers import (
	CityGoalSerializer,
	OfferSerializer,
	PromoBannerSerializer,
	TripBonusSerializer,
)


def _is_current(start_date, end_date, today):
	if start_date and start_date > today:
		return False
	if end_date and end_date < today:
		return False
	return True


class PublicDynamicSectionsAPIView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		today = timezone.localdate()

		offers_qs = [
			offer for offer in Offer.objects.filter(is_active=True).order_by("priority", "-created_at")
			if _is_current(offer.start_date, offer.end_date, today)
		]
		banners_qs = [
			banner
			for banner in PromoBanner.objects.filter(is_active=True).order_by("priority", "-created_at")
			if _is_current(banner.start_date, banner.end_date, today)
		]
		city_goals_qs = CityGoal.objects.filter(is_active=True).order_by("sort_order", "city")
		trip_bonuses_qs = TripBonus.objects.filter(is_active=True).order_by("sort_order", "city")

		data = {
			"offers": OfferSerializer(offers_qs, many=True).data if offers_qs else FALLBACK_OFFERS,
			"promo_banners": PromoBannerSerializer(banners_qs, many=True).data,
			"city_goals": CityGoalSerializer(city_goals_qs, many=True).data if city_goals_qs.exists() else FALLBACK_CITY_GOALS,
			"trip_bonuses": TripBonusSerializer(trip_bonuses_qs, many=True).data if trip_bonuses_qs.exists() else FALLBACK_TRIP_BONUSES,
		}
		return api_success(data=data, message="Dynamic public sections fetched")


class AdminOfferViewSet(viewsets.ModelViewSet):
	queryset = Offer.objects.all().order_by("priority", "-created_at")
	serializer_class = OfferSerializer
	permission_classes = [IsAdminUser]
	filterset_fields = ["is_active", "badge"]
	search_fields = ["title", "description", "badge"]
	ordering_fields = ["priority", "created_at", "updated_at"]


class AdminPromoBannerViewSet(viewsets.ModelViewSet):
	queryset = PromoBanner.objects.all().order_by("priority", "-created_at")
	serializer_class = PromoBannerSerializer
	permission_classes = [IsAdminUser]
	filterset_fields = ["is_active"]
	search_fields = ["title", "description", "cta_label"]
	ordering_fields = ["priority", "created_at", "updated_at"]


class AdminCityGoalViewSet(viewsets.ModelViewSet):
	queryset = CityGoal.objects.all().order_by("sort_order", "city")
	serializer_class = CityGoalSerializer
	permission_classes = [IsAdminUser]
	filterset_fields = ["is_active", "city", "vehicle_type"]
	search_fields = ["city", "notes"]
	ordering_fields = ["sort_order", "city", "trip_target", "created_at"]


class AdminTripBonusViewSet(viewsets.ModelViewSet):
	queryset = TripBonus.objects.all().order_by("sort_order", "city")
	serializer_class = TripBonusSerializer
	permission_classes = [IsAdminUser]
	filterset_fields = ["is_active", "city", "vehicle_type"]
	search_fields = ["city", "notes"]
	ordering_fields = ["sort_order", "city", "trip_target", "bonus_amount", "created_at"]

# Create your views here.
