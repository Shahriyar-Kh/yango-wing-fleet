from rest_framework import serializers

from inquiries.models import Inquiry


class InquiryCreateSerializer(serializers.ModelSerializer):
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = Inquiry
        fields = ["inquiry_type", "name", "email", "phone", "subject", "message", "website"]

    def validate_website(self, value):
        if value:
            raise serializers.ValidationError("Spam detected")
        return value


class InquiryAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at", "source_ip", "user_agent")
