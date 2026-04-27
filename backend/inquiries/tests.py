from django.urls import reverse
from rest_framework.test import APITestCase

from inquiries.models import Inquiry


class PublicInquiryApiTests(APITestCase):
	def test_contact_submission_normalizes_blank_subject(self):
		response = self.client.post(
			reverse("public-inquiry-create"),
			{
				"inquiry_type": "contact",
				"name": "Ali",
				"email": "ali@example.com",
				"phone": "03001234567",
				"subject": "",
				"message": "Please contact me about registration.",
				"website": "",
			},
			format="json",
		)

		self.assertEqual(response.status_code, 201)
		self.assertEqual(response.data["data"]["status"], "new")
		inquiry = Inquiry.objects.get(id=response.data["data"]["id"])
		self.assertEqual(inquiry.subject, "General Inquiry")

	def test_validation_errors_are_returned_as_field_errors(self):
		response = self.client.post(
			reverse("public-inquiry-create"),
			{
				"inquiry_type": "contact",
				"name": "",
				"email": "not-an-email",
				"phone": "",
				"subject": "",
				"message": "",
				"website": "",
			},
			format="json",
		)

		self.assertEqual(response.status_code, 400)
		self.assertIn("errors", response.data)
		self.assertIn("email", response.data["errors"])

