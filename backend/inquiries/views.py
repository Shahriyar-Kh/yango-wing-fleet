import csv

from django.http import HttpResponse
from rest_framework import status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.views import APIView

from core.throttles import InquirySubmitRateThrottle
from core.utils.responses import api_error, api_success
from inquiries.models import Inquiry
from inquiries.serializers import InquiryAdminSerializer, InquiryCreateSerializer
from inquiries.services.notifications import send_inquiry_notification


class PublicInquiryCreateAPIView(APIView):
	permission_classes = [AllowAny]
	throttle_classes = [InquirySubmitRateThrottle]

	def post(self, request):
		serializer = InquiryCreateSerializer(data=request.data)
		try:
			serializer.is_valid(raise_exception=True)
		except ValidationError as exc:
			return api_error(message="Validation failed", errors=exc.detail, status_code=status.HTTP_400_BAD_REQUEST)
		inquiry = serializer.save(
			source_ip=self._get_client_ip(request),
			user_agent=request.META.get("HTTP_USER_AGENT", "")[:1000],
		)

		try:
			send_inquiry_notification(inquiry)
		except Exception:
			pass

		return api_success(
			data={"id": inquiry.id, "status": inquiry.status},
			message="Inquiry submitted successfully",
			status_code=status.HTTP_201_CREATED,
		)

	@staticmethod
	def _get_client_ip(request):
		forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
		if forwarded_for:
			return forwarded_for.split(",")[0].strip()
		return request.META.get("REMOTE_ADDR")


class AdminInquiryViewSet(viewsets.ModelViewSet):
	queryset = Inquiry.objects.all()
	serializer_class = InquiryAdminSerializer
	permission_classes = [IsAdminUser]
	filterset_fields = ["inquiry_type", "status", "created_at"]
	search_fields = ["name", "email", "phone", "subject", "message"]
	ordering_fields = ["created_at", "updated_at", "status", "inquiry_type"]


class InquiryExportCsvAPIView(APIView):
	permission_classes = [IsAdminUser]

	def get(self, request):
		queryset = Inquiry.objects.all().order_by("-created_at")

		response = HttpResponse(content_type="text/csv")
		response["Content-Disposition"] = 'attachment; filename="inquiries.csv"'

		writer = csv.writer(response)
		writer.writerow([
			"ID",
			"Inquiry Type",
			"Name",
			"Email",
			"Phone",
			"Subject",
			"Message",
			"Status",
			"Created At",
		])
		for item in queryset:
			writer.writerow([
				item.id,
				item.inquiry_type,
				item.name,
				item.email,
				item.phone,
				item.subject,
				item.message,
				item.status,
				item.created_at.isoformat(),
			])
		return response

# Create your views here.
