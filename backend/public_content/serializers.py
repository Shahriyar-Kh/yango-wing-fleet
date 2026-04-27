from rest_framework import serializers

from public_content.models import Offer, TripBonus


class OfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = "__all__"


class TripBonusSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripBonus
        fields = "__all__"
