"""
Migration: add rider CNIC dates + granular vehicle fields.

New fields added to RegistrationSubmission:
  Rider  : cnic_issue_date, cnic_expiry_date
  Vehicle: vehicle_number_plate, vehicle_make, vehicle_model, vehicle_color

The legacy `vehicle_make_model` field is kept (blank=True) for backward
compatibility; it is auto-populated by the model's save() override.
"""

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("registrations", "0001_initial"),
    ]

    operations = [
        # ── Rider details ────────────────────────────────────────────────────
        migrations.AddField(
            model_name="registrationsubmission",
            name="cnic_issue_date",
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="registrationsubmission",
            name="cnic_expiry_date",
            field=models.DateField(blank=True, null=True),
        ),
        # ── Vehicle details ──────────────────────────────────────────────────
        migrations.AddField(
            model_name="registrationsubmission",
            name="vehicle_number_plate",
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AddField(
            model_name="registrationsubmission",
            name="vehicle_make",
            field=models.CharField(blank=True, max_length=80),
        ),
        migrations.AddField(
            model_name="registrationsubmission",
            name="vehicle_model",
            field=models.CharField(blank=True, max_length=80),
        ),
        migrations.AddField(
            model_name="registrationsubmission",
            name="vehicle_color",
            field=models.CharField(blank=True, max_length=40),
        ),
        # vehicle_make_model already exists; make it explicitly blank-able
        migrations.AlterField(
            model_name="registrationsubmission",
            name="vehicle_make_model",
            field=models.CharField(blank=True, max_length=120),
        ),
    ]
