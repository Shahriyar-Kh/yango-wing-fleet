from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase


class DashboardSummaryTests(APITestCase):
	def setUp(self):
		user_model = get_user_model()
		self.user = user_model.objects.create_user(
			username="admin",
			email="admin@example.com",
			password="testpass123",
			is_staff=True,
		)
		self.client.force_authenticate(user=self.user)

	def test_summary_uses_trip_bonus_totals(self):
		response = self.client.get(reverse("admin-dashboard-summary"))

		self.assertEqual(response.status_code, 200)
		self.assertIn("active_trip_bonus_records", response.data["data"]["totals"])
		self.assertNotIn("active_city_bonus_records", response.data["data"]["totals"])
