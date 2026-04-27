from django.utils import timezone
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.views import APIView

from core.utils.responses import api_success
from public_content.fallbacks import FALLBACK_OFFERS, FALLBACK_TRIP_BONUSES
from public_content.models import Offer, TripBonus
from public_content.serializers import OfferSerializer, TripBonusSerializer


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
		trip_bonuses_qs = TripBonus.objects.filter(is_active=True).order_by("sort_order", "city")

		data = {
			"offers": OfferSerializer(offers_qs, many=True).data if offers_qs else FALLBACK_OFFERS,
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


class AdminTripBonusViewSet(viewsets.ModelViewSet):
	queryset = TripBonus.objects.all().order_by("sort_order", "city")
	serializer_class = TripBonusSerializer
	permission_classes = [IsAdminUser]
	filterset_fields = ["is_active", "city", "vehicle_type"]
	search_fields = ["city", "notes"]
	ordering_fields = ["sort_order", "city", "trip_target", "bonus_amount", "created_at"]

# Create your views here.
