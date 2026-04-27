from django.urls import reverse
from rest_framework.test import APITestCase


class PublicContentTests(APITestCase):
	def test_dynamic_sections_only_expose_required_keys(self):
		response = self.client.get(reverse("public-dynamic-sections"))

		self.assertEqual(response.status_code, 200)
		self.assertIn("offers", response.data["data"])
		self.assertIn("trip_bonuses", response.data["data"])
		self.assertNotIn("city_goals", response.data["data"])
		self.assertNotIn("promo_banners", response.data["data"])

