from django.contrib import admin

from registrations.models import RegistrationSubmission


@admin.register(RegistrationSubmission)
class RegistrationSubmissionAdmin(admin.ModelAdmin):
	list_display = (
		"full_name",
		"phone",
		"city",
		"vehicle_type",
		"status",
		"created_at",
	)
	list_filter = ("status", "city", "vehicle_type", "created_at")
	search_fields = ("full_name", "phone", "email", "cnic", "vehicle_make_model")
	readonly_fields = ("created_at", "updated_at", "source_ip", "user_agent")

# Register your models here.
