from rest_framework import serializers

from inquiries.models import Inquiry


class InquiryCreateSerializer(serializers.ModelSerializer):
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)
    subject = serializers.CharField(required=False, allow_blank=True, max_length=180)

    class Meta:
        model = Inquiry
        fields = ["inquiry_type", "name", "email", "phone", "subject", "message", "website"]

    def validate_website(self, value):
        if value:
            raise serializers.ValidationError("Spam detected")
        return value

    def validate_subject(self, value):
        return value.strip() if value else "General Inquiry"

    def create(self, validated_data):
        validated_data.pop("website", None)
        validated_data["subject"] = validated_data.get("subject") or "General Inquiry"
        return super().create(validated_data)


class InquiryAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at", "source_ip", "user_agent")
