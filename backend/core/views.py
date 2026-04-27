from django.db import connection
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from core.utils.responses import api_success


class HealthCheckAPIView(APIView):
	permission_classes = [AllowAny]

	def get(self, request):
		with connection.cursor() as cursor:
			cursor.execute("SELECT 1")
			cursor.fetchone()

		return api_success(
			data={"status": "ok", "service": "yango-wing-fleet-backend"},
			message="Healthy",
		)

# Create your views here.
