from django.contrib import admin

from inquiries.models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
	list_display = ("name", "inquiry_type", "email", "status", "created_at")
	list_filter = ("inquiry_type", "status", "created_at")
	search_fields = ("name", "email", "phone", "subject", "message")
	readonly_fields = ("created_at", "updated_at", "source_ip", "user_agent")

# Register your models here.
