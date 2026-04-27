from rest_framework import serializers

from registrations.models import RegistrationSubmission


class RegistrationSubmissionCreateSerializer(serializers.ModelSerializer):
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = RegistrationSubmission
        fields = [
            "full_name",
            "cnic",
            "phone",
            "email",
            "city",
            "vehicle_type",
            "vehicle_make_model",
            "vehicle_year",
            "notes",
            "website",
        ]

    def validate_website(self, value):
        if value:
            raise serializers.ValidationError("Spam detected")
        return value


class RegistrationSubmissionAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationSubmission
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at", "source_ip", "user_agent")
