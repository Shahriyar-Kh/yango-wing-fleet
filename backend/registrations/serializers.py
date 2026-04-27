from rest_framework import serializers

from registrations.models import RegistrationSubmission


class RegistrationSubmissionCreateSerializer(serializers.ModelSerializer):
    """
    Public-facing serializer for driver self-registration.

    New fields added (2026-04):
      Rider  : cnic_issue_date, cnic_expiry_date
      Vehicle: vehicle_number_plate, vehicle_make, vehicle_model, vehicle_color

    Honeypot: `website` — must be blank; bots that fill it are rejected.
    """

    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = RegistrationSubmission
        fields = [
            # rider
            "full_name",
            "cnic",
            "cnic_issue_date",
            "cnic_expiry_date",
            "phone",
            "email",
            "city",
            # vehicle
            "vehicle_type",
            "vehicle_number_plate",
            "vehicle_make",
            "vehicle_model",
            "vehicle_year",
            "vehicle_color",
            # legacy combined field (optional; auto-populated by model.save())
            "vehicle_make_model",
            # misc
            "notes",
            # honeypot
            "website",
        ]
        extra_kwargs = {
            # new fields are not strictly required at the DB level so the API
            # can accept registrations from older clients gracefully.
            "cnic_issue_date": {"required": False, "allow_null": True},
            "cnic_expiry_date": {"required": False, "allow_null": True},
            "vehicle_number_plate": {"required": False, "allow_blank": True},
            "vehicle_make": {"required": False, "allow_blank": True},
            "vehicle_model": {"required": False, "allow_blank": True},
            "vehicle_color": {"required": False, "allow_blank": True},
            "vehicle_make_model": {"required": False, "allow_blank": True},
        }

    # ── Honeypot ──────────────────────────────────────────────────────────────

    def validate_website(self, value):
        if value:
            raise serializers.ValidationError("Spam detected")
        return value

    # ── Cross-field validation ────────────────────────────────────────────────

    def validate(self, attrs):
        vehicle_type = attrs.get("vehicle_type", "")
        vehicle_model = attrs.get("vehicle_model", "").strip()

        # Model field is required for cars.
        if vehicle_type == "car" and not vehicle_model:
            raise serializers.ValidationError(
                {"vehicle_model": "Vehicle model is required for cars (e.g. Corolla)."}
            )

        return attrs

    # ── Save hook: keep legacy combined field in sync ─────────────────────────

    def create(self, validated_data):
        # Remove honeypot before hitting the DB.
        validated_data.pop("website", None)

        # Auto-populate legacy vehicle_make_model if not supplied.
        if not validated_data.get("vehicle_make_model"):
            parts = [
                p for p in [
                    validated_data.get("vehicle_make", ""),
                    validated_data.get("vehicle_model", ""),
                ]
                if p
            ]
            validated_data["vehicle_make_model"] = " ".join(parts)

        return super().create(validated_data)


class RegistrationSubmissionAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationSubmission
        fields = "__all__"
        read_only_fields = ("created_at", "updated_at", "source_ip", "user_agent")