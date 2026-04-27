from django.db import models


class RegistrationStatus(models.TextChoices):
	PENDING = "pending", "Pending"
	IN_PROGRESS = "in_progress", "In Progress"
	COMPLETED = "completed", "Completed"
	ACTIVE = "active", "Active"


class VehicleType(models.TextChoices):
	BIKE = "bike", "Bike"
	CAR = "car", "Car"
	RICKSHAW = "rickshaw", "Rickshaw"


class RegistrationSubmission(models.Model):
	full_name = models.CharField(max_length=120)
	cnic = models.CharField(max_length=20)
	phone = models.CharField(max_length=20)
	email = models.EmailField(blank=True)
	city = models.CharField(max_length=100)
	vehicle_type = models.CharField(max_length=20, choices=VehicleType.choices)
	vehicle_make_model = models.CharField(max_length=120)
	vehicle_year = models.PositiveSmallIntegerField()
	notes = models.TextField(blank=True)

	status = models.CharField(max_length=20, choices=RegistrationStatus.choices, default=RegistrationStatus.PENDING)
	source_ip = models.GenericIPAddressField(blank=True, null=True)
	user_agent = models.TextField(blank=True)
	contacted_at = models.DateTimeField(blank=True, null=True)
	reviewed_at = models.DateTimeField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-created_at"]
		indexes = [
			models.Index(fields=["created_at"]),
			models.Index(fields=["city"]),
			models.Index(fields=["vehicle_type"]),
			models.Index(fields=["status"]),
			models.Index(fields=["phone"]),
		]

	def __str__(self):
		return f"{self.full_name} ({self.city})"

# Create your models here.
