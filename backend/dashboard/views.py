from datetime import timedelta

from django.db.models import Count
from django.db.models.functions import TruncDay, TruncMonth, TruncWeek, TruncYear
from django.utils import timezone
from rest_framework.views import APIView

from core.permissions import IsDashboardAdmin
from core.utils.responses import api_success
from inquiries.models import Inquiry
from public_content.models import Offer, TripBonus
from registrations.models import RegistrationSubmission


class DashboardSummaryAPIView(APIView):
	permission_classes = [IsDashboardAdmin]

	def get(self, request):
		now = timezone.now()
		today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
		week_start = today_start - timedelta(days=today_start.weekday())
		month_start = today_start.replace(day=1)

		total_registrations = RegistrationSubmission.objects.count()
		daily_registrations = RegistrationSubmission.objects.filter(created_at__gte=today_start).count()
		weekly_registrations = RegistrationSubmission.objects.filter(created_at__gte=week_start).count()
		monthly_registrations = RegistrationSubmission.objects.filter(created_at__gte=month_start).count()

		city_counts = list(
			RegistrationSubmission.objects.values("city").annotate(total=Count("id")).order_by("-total")
		)
		vehicle_counts = list(
			RegistrationSubmission.objects.values("vehicle_type").annotate(total=Count("id")).order_by("-total")
		)
		status_counts = list(
			RegistrationSubmission.objects.values("status").annotate(total=Count("id")).order_by("-total")
		)

		latest_submissions = list(
			RegistrationSubmission.objects.values(
				"id", "full_name", "phone", "city", "vehicle_type", "status", "created_at"
			)[:10]
		)

		active_offer_count = Offer.objects.filter(is_active=True).count()
		city_bonus_records = TripBonus.objects.filter(is_active=True).count()
		open_inquiries = Inquiry.objects.filter(status__in=["new", "in_progress"]).count()

		return api_success(
			data={
				"totals": {
					"registrations": total_registrations,
					"daily_registrations": daily_registrations,
					"weekly_registrations": weekly_registrations,
					"monthly_registrations": monthly_registrations,
					"active_offers": active_offer_count,
					"active_city_bonus_records": city_bonus_records,
					"open_inquiries": open_inquiries,
				},
				"city_counts": city_counts,
				"vehicle_counts": vehicle_counts,
				"status_counts": status_counts,
				"latest_submissions": latest_submissions,
			},
			message="Dashboard summary fetched",
		)


class DashboardTrendsAPIView(APIView):
	permission_classes = [IsDashboardAdmin]

	trunc_map = {
		"daily": TruncDay,
		"weekly": TruncWeek,
		"monthly": TruncMonth,
		"yearly": TruncYear,
	}

	def get(self, request):
		period = request.query_params.get("period", "daily").lower()
		if period not in self.trunc_map:
			period = "daily"

		limit = int(request.query_params.get("limit", 30))
		limit = min(max(limit, 1), 365)

		trunc_fn = self.trunc_map[period]

		trend = (
			RegistrationSubmission.objects.annotate(bucket=trunc_fn("created_at"))
			.values("bucket")
			.annotate(total=Count("id"))
			.order_by("-bucket")[:limit]
		)

		inquiry_trend = (
			Inquiry.objects.annotate(bucket=trunc_fn("created_at"))
			.values("bucket")
			.annotate(total=Count("id"))
			.order_by("-bucket")[:limit]
		)

		trend_data = [
			{"bucket": item["bucket"].isoformat() if item["bucket"] else None, "total": item["total"]}
			for item in reversed(list(trend))
		]
		inquiry_trend_data = [
			{"bucket": item["bucket"].isoformat() if item["bucket"] else None, "total": item["total"]}
			for item in reversed(list(inquiry_trend))
		]

		return api_success(
			data={
				"period": period,
				"registrations": trend_data,
				"inquiries": inquiry_trend_data,
			},
			message="Trend analytics fetched",
		)


class DashboardDistributionsAPIView(APIView):
	permission_classes = [IsDashboardAdmin]

	def get(self, request):
		city = list(RegistrationSubmission.objects.values("city").annotate(total=Count("id")).order_by("-total"))
		vehicle = list(
			RegistrationSubmission.objects.values("vehicle_type").annotate(total=Count("id")).order_by("-total")
		)
		status = list(RegistrationSubmission.objects.values("status").annotate(total=Count("id")).order_by("-total"))

		inquiry_type = list(
			Inquiry.objects.values("inquiry_type").annotate(total=Count("id")).order_by("-total")
		)
		inquiry_status = list(Inquiry.objects.values("status").annotate(total=Count("id")).order_by("-total"))

		return api_success(
			data={
				"registrations": {
					"city": city,
					"vehicle": vehicle,
					"status": status,
				},
				"inquiries": {
					"type": inquiry_type,
					"status": inquiry_status,
				},
			},
			message="Distribution analytics fetched",
		)


class DashboardLatestActivityAPIView(APIView):
	permission_classes = [IsDashboardAdmin]

	def get(self, request):
		limit = int(request.query_params.get("limit", 20))
		limit = min(max(limit, 1), 100)

		latest_registrations = list(
			RegistrationSubmission.objects.values(
				"id",
				"full_name",
				"city",
				"vehicle_type",
				"status",
				"created_at",
			)[:limit]
		)
		latest_inquiries = list(
			Inquiry.objects.values(
				"id",
				"inquiry_type",
				"name",
				"subject",
				"status",
				"created_at",
			)[:limit]
		)

		return api_success(
			data={
				"latest_registrations": latest_registrations,
				"latest_inquiries": latest_inquiries,
			},
			message="Latest dashboard activity fetched",
		)

# Create your views here.
