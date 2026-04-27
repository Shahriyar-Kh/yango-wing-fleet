from django.contrib import admin

from public_content.models import CityGoal, Offer, PromoBanner, TripBonus


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
	list_display = ("title", "badge", "priority", "is_active", "start_date", "end_date")
	list_filter = ("is_active", "badge")
	search_fields = ("title", "description")


@admin.register(PromoBanner)
class PromoBannerAdmin(admin.ModelAdmin):
	list_display = ("title", "priority", "is_active", "start_date", "end_date")
	list_filter = ("is_active",)
	search_fields = ("title", "description", "cta_label")


@admin.register(CityGoal)
class CityGoalAdmin(admin.ModelAdmin):
	list_display = ("city", "vehicle_type", "trip_target", "sort_order", "is_active")
	list_filter = ("is_active", "city", "vehicle_type")
	search_fields = ("city", "notes")


@admin.register(TripBonus)
class TripBonusAdmin(admin.ModelAdmin):
	list_display = ("city", "vehicle_type", "trip_target", "bonus_amount", "sort_order", "is_active")
	list_filter = ("is_active", "city", "vehicle_type")
	search_fields = ("city", "notes")

# Register your models here.
