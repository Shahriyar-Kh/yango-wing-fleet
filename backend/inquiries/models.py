from django.db import models


class InquiryType(models.TextChoices):
	CONTACT = "contact", "Contact"
	SUPPORT = "support", "Support"


class InquiryStatus(models.TextChoices):
	NEW = "new", "New"
	IN_PROGRESS = "in_progress", "In Progress"
	RESOLVED = "resolved", "Resolved"
	CLOSED = "closed", "Closed"


class Inquiry(models.Model):
	inquiry_type = models.CharField(max_length=20, choices=InquiryType.choices, default=InquiryType.CONTACT)
	name = models.CharField(max_length=120)
	email = models.EmailField()
	phone = models.CharField(max_length=20, blank=True)
	subject = models.CharField(max_length=180)
	message = models.TextField()

	status = models.CharField(max_length=20, choices=InquiryStatus.choices, default=InquiryStatus.NEW)
	source_ip = models.GenericIPAddressField(blank=True, null=True)
	user_agent = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-created_at"]
		indexes = [
			models.Index(fields=["inquiry_type", "status"]),
			models.Index(fields=["created_at"]),
			models.Index(fields=["email"]),
		]

	def __str__(self):
		return f"{self.name} - {self.inquiry_type}"

# Create your models here.
