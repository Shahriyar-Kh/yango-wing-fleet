import re
import logging

from django.conf import settings

from core.services.email_service import send_templated_email


logger = logging.getLogger(__name__)


def send_registration_notifications(registration):
    """
    Send professional notifications for new registration.
    
    - Admin notification with full details
    - User confirmation email (if email provided)
    """
    
    # Prepare context for admin email
    phone_digits = re.sub(r"\D", "", registration.phone or "")
    whatsapp_phone = phone_digits.lstrip("0")
    if whatsapp_phone.startswith("92"):
        whatsapp_number = whatsapp_phone
    elif whatsapp_phone:
        whatsapp_number = f"92{whatsapp_phone}"
    else:
        whatsapp_number = ""

    admin_context = {
        "admin_link": f"{settings.FRONTEND_BASE_URL}/admin/registrations",
        "admin_email": settings.ADMIN_NOTIFICATION_EMAIL,
        "submitted_at_display": registration.created_at.strftime("%B %d, %Y, %I:%M %p").replace(" 0", " ") if registration.created_at else "",
        "contact_tel_link": f"tel:{registration.phone}",
        "contact_whatsapp_link": f"https://wa.me/{whatsapp_number}" if whatsapp_number else "",
        "full_name": registration.full_name,
        "email": registration.email,
        "phone": registration.phone,
        "cnic": registration.cnic,
        "cnic_issue_date": registration.cnic_issue_date.strftime("%Y-%m-%d") if registration.cnic_issue_date else "",
        "cnic_expiry_date": registration.cnic_expiry_date.strftime("%Y-%m-%d") if registration.cnic_expiry_date else "",
        "city": registration.city,
        "vehicle_type": registration.get_vehicle_type_display(),
        "vehicle_number_plate": registration.vehicle_number_plate,
        "vehicle_make": registration.vehicle_make,
        "vehicle_model": registration.vehicle_model or registration.vehicle_make_model or "-",
        "vehicle_make_model": registration.vehicle_make_model,
        "vehicle_year": registration.vehicle_year,
        "vehicle_color": registration.vehicle_color,
        "notes": registration.notes,
        "copy_summary": (
            f"Full Name: {registration.full_name}\n"
            f"Email: {registration.email or '-'}\n"
            f"Phone: {registration.phone}\n"
            f"CNIC: {registration.cnic}\n"
            f"CNIC Issue: {registration.cnic_issue_date.strftime('%Y-%m-%d') if registration.cnic_issue_date else '-'}\n"
            f"CNIC Expiry: {registration.cnic_expiry_date.strftime('%Y-%m-%d') if registration.cnic_expiry_date else '-'}\n"
            f"City: {registration.city}\n"
            f"Vehicle Type: {registration.get_vehicle_type_display()}\n"
            f"Make: {registration.vehicle_make or '-'}\n"
            f"Model: {registration.vehicle_model or registration.vehicle_make_model or '-'}\n"
            f"Number Plate: {registration.vehicle_number_plate or '-'}\n"
            f"Year: {registration.vehicle_year or '-'}\n"
            f"Color: {registration.vehicle_color or '-'}\n"
            f"Notes: {registration.notes or '-'}"
        ),
    }

    # Send admin notification with professional template
    try:
        send_templated_email(
            subject=f"New Rider Registration Received – Yango Wing Fleet: {registration.full_name}",
            template_name="emails/registration_admin_notification.html",
            context=admin_context,
            to_emails=[settings.ADMIN_NOTIFICATION_EMAIL],
        )
    except Exception as e:
        logger.exception("Failed to send admin registration notification for submission %s", registration.id)
        # Don't fail the entire registration if admin email fails

    # Send user confirmation email (if email provided)
    if registration.email:
        user_context = {
            "registration": registration,
        }
        try:
            send_templated_email(
                subject="✓ Your Yango Wing Fleet Registration Received",
                template_name="emails/registration_user_confirmation.html",
                context=user_context,
                to_emails=[registration.email],
            )
        except Exception as e:
            logger.exception("Failed to send user confirmation for submission %s", registration.id)
            # Don't fail the registration if user email fails
