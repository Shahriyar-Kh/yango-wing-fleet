from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework.test import APITestCase

from public_content.models import Offer
from public_content.views import FALLBACK_OFFERS


class ExplodingSerializer:
	def __init__(self, *args, **kwargs):
		pass

	@property
	def data(self):
		raise ValueError("boom")


class PublicContentTests(APITestCase):
	def setUp(self):
		Offer.objects.create(
			title="Broken offer",
			description="This row forces the serializer error path.",
			badge="Test",
			priority=1,
			is_active=True,
			image=SimpleUploadedFile("broken-offer.png", b"broken data", content_type="image/png"),
		)

	def test_dynamic_sections_only_expose_required_keys(self):
		response = self.client.get(reverse("public-dynamic-sections"))

		self.assertEqual(response.status_code, 200)
		self.assertIn("offers", response.data["data"])
		self.assertIn("trip_bonuses", response.data["data"])
		self.assertNotIn("city_goals", response.data["data"])
		self.assertNotIn("promo_banners", response.data["data"])

	def test_dynamic_sections_falls_back_when_offer_serialization_fails(self):
		from unittest.mock import patch

		from public_content import views

		with patch.object(views, "OfferSerializer", ExplodingSerializer):
			response = self.client.get(reverse("public-dynamic-sections"))

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data["data"]["offers"], FALLBACK_OFFERS)

