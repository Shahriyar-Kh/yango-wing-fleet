import csv
import logging

from django.http import HttpResponse
from django.utils import timezone
from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.views import APIView

from core.throttles import RegistrationSubmitRateThrottle
from core.utils.responses import api_error, api_success
from registrations.models import RegistrationStatus, RegistrationSubmission
from registrations.serializers import (
	RegistrationSubmissionAdminSerializer,
	RegistrationSubmissionCreateSerializer,
)
from registrations.services.notifications import send_registration_notifications


logger = logging.getLogger(__name__)


class PublicRegistrationCreateAPIView(APIView):
	permission_classes = [AllowAny]
	throttle_classes = [RegistrationSubmitRateThrottle]

	def post(self, request):
		logger.info(f"Registration submission from IP: {self._get_client_ip(request)}")
		
		serializer = RegistrationSubmissionCreateSerializer(data=request.data)
		try:
			serializer.is_valid(raise_exception=True)
		except ValidationError as exc:
			logger.warning(f"Registration validation failed: {exc.detail}")
			return api_error(message="Validation failed", errors=exc.detail, status_code=status.HTTP_400_BAD_REQUEST)
		
		logger.info(f"Creating registration submission for: {request.data.get('full_name')}")
		registration = serializer.save(
			source_ip=self._get_client_ip(request),
			user_agent=request.META.get("HTTP_USER_AGENT", "")[:1000],
		)
		logger.info(f"Registration saved to database: submission_id={registration.id}, name={registration.full_name}")

		def _send_notifications():
			logger.info(f"transaction.on_commit fired: sending notifications for submission {registration.id}")
			try:
				send_registration_notifications(registration)
				logger.info(f"Notifications sent successfully for submission {registration.id}")
			except Exception as e:
				logger.exception(f"Failed to send registration notifications for submission {registration.id}: {str(e)}")

		transaction.on_commit(_send_notifications)
		logger.debug(f"transaction.on_commit registered for submission {registration.id}")

		return api_success(
			data={"id": registration.id, "status": registration.status},
			message="Registration submitted successfully",
			status_code=status.HTTP_201_CREATED,
		)

	@staticmethod
	def _get_client_ip(request):
		forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
		if forwarded_for:
			return forwarded_for.split(",")[0].strip()
		return request.META.get("REMOTE_ADDR")


class AdminRegistrationViewSet(viewsets.ModelViewSet):
	queryset = RegistrationSubmission.objects.all()
	serializer_class = RegistrationSubmissionAdminSerializer
	permission_classes = [IsAdminUser]
	filterset_fields = ["status", "city", "vehicle_type", "created_at"]
	search_fields = ["full_name", "phone", "email", "cnic", "city", "vehicle_make_model"]
	ordering_fields = ["created_at", "updated_at", "city", "status"]

	def perform_update(self, serializer):
		instance = serializer.save()
		if instance.status in [RegistrationStatus.IN_PROGRESS, RegistrationStatus.COMPLETED, RegistrationStatus.ACTIVE]:
			if not instance.reviewed_at:
				instance.reviewed_at = timezone.now()
			if instance.status == RegistrationStatus.IN_PROGRESS and not instance.contacted_at:
				instance.contacted_at = timezone.now()
			instance.save(update_fields=["reviewed_at", "contacted_at", "updated_at"])


class RegistrationExportCsvAPIView(APIView):
	permission_classes = [IsAdminUser]

	def get(self, request):
		queryset = RegistrationSubmission.objects.all().order_by("-created_at")

		response = HttpResponse(content_type="text/csv")
		response["Content-Disposition"] = 'attachment; filename="registrations.csv"'

		writer = csv.writer(response)
		writer.writerow(
			[
				"ID",
				"Full Name",
				"CNIC",
				"Phone",
				"Email",
				"City",
				"Vehicle Type",
				"Vehicle Make Model",
				"Vehicle Year",
				"Status",
				"Created At",
			]
		)
		for item in queryset:
			writer.writerow(
				[
					item.id,
					item.full_name,
					item.cnic,
					item.phone,
					item.email,
					item.city,
					item.vehicle_type,
					item.vehicle_make_model,
					item.vehicle_year,
					item.status,
					item.created_at.isoformat(),
				]
			)
		return response

# Create your views here.
