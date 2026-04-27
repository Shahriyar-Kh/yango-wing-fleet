from rest_framework import serializers

from public_content.models import CityGoal, Offer, PromoBanner, TripBonus


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = "__all__"


class PromoBannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PromoBanner
        fields = "__all__"


class CityGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = CityGoal
        fields = "__all__"


class TripBonusSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripBonus
        fields = "__all__"
