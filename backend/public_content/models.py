from django.db import models


class VehicleType(models.TextChoices):
	BIKE = "bike", "Bike"
	CAR = "car", "Car"
	RICKSHAW = "rickshaw", "Rickshaw"


class TimeStampedModel(models.Model):
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		abstract = True


class Offer(TimeStampedModel):
	title = models.CharField(max_length=150)
	description = models.TextField()
	badge = models.CharField(max_length=50, blank=True)
	image = models.ImageField(upload_to="offers/", blank=True, null=True)
	priority = models.PositiveIntegerField(default=100)
	is_active = models.BooleanField(default=True)
	start_date = models.DateField(blank=True, null=True)
	end_date = models.DateField(blank=True, null=True)

	class Meta:
		ordering = ["priority", "-created_at"]
		indexes = [
			models.Index(fields=["is_active", "priority"]),
			models.Index(fields=["start_date", "end_date"]),
		]

	def __str__(self):
		return self.title


class PromoBanner(TimeStampedModel):
	title = models.CharField(max_length=150)
	description = models.CharField(max_length=255, blank=True)
	image = models.ImageField(upload_to="promo-banners/", blank=True, null=True)
	cta_label = models.CharField(max_length=60, blank=True)
	cta_url = models.URLField(blank=True)
	priority = models.PositiveIntegerField(default=100)
	is_active = models.BooleanField(default=True)
	start_date = models.DateField(blank=True, null=True)
	end_date = models.DateField(blank=True, null=True)

	class Meta:
		ordering = ["priority", "-created_at"]
		indexes = [models.Index(fields=["is_active", "priority"])]

	def __str__(self):
		return self.title


class CityGoal(TimeStampedModel):
	city = models.CharField(max_length=100)
	vehicle_type = models.CharField(max_length=20, choices=VehicleType.choices)
	trip_target = models.PositiveIntegerField()
	notes = models.CharField(max_length=255, blank=True)
	sort_order = models.PositiveIntegerField(default=100)
	is_active = models.BooleanField(default=True)

	class Meta:
		ordering = ["sort_order", "city", "vehicle_type"]
		unique_together = ("city", "vehicle_type", "trip_target")
		indexes = [
			models.Index(fields=["city", "vehicle_type"]),
			models.Index(fields=["is_active", "sort_order"]),
		]

	def __str__(self):
		return f"{self.city} - {self.vehicle_type} ({self.trip_target})"


class TripBonus(TimeStampedModel):
	city = models.CharField(max_length=100)
	vehicle_type = models.CharField(max_length=20, choices=VehicleType.choices)
	trip_target = models.PositiveIntegerField()
	bonus_amount = models.DecimalField(max_digits=12, decimal_places=2)
	notes = models.CharField(max_length=255, blank=True)
	sort_order = models.PositiveIntegerField(default=100)
	is_active = models.BooleanField(default=True)

	class Meta:
		ordering = ["sort_order", "city", "vehicle_type", "trip_target"]
		unique_together = ("city", "vehicle_type", "trip_target", "bonus_amount")
		indexes = [
			models.Index(fields=["city", "vehicle_type"]),
			models.Index(fields=["is_active", "sort_order"]),
		]

	def __str__(self):
		return f"{self.city} - {self.vehicle_type} ({self.trip_target} => {self.bonus_amount})"

# Create your models here.
