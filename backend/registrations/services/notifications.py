from django.conf import settings

from core.services.email_service import send_html_email


def send_registration_notifications(registration):
    admin_html = f"""
    <h2>New Driver Registration</h2>
    <p>A new registration was submitted.</p>
    <ul>
      <li><strong>Name:</strong> {registration.full_name}</li>
      <li><strong>Phone:</strong> {registration.phone}</li>
      <li><strong>Email:</strong> {registration.email or '-'} </li>
      <li><strong>CNIC:</strong> {registration.cnic}</li>
      <li><strong>City:</strong> {registration.city}</li>
      <li><strong>Vehicle Type:</strong> {registration.vehicle_type}</li>
      <li><strong>Vehicle:</strong> {registration.vehicle_make_model} ({registration.vehicle_year})</li>
      <li><strong>Notes:</strong> {registration.notes or '-'}</li>
      <li><strong>Status:</strong> {registration.status}</li>
      <li><strong>Submitted At:</strong> {registration.created_at}</li>
    </ul>
    """

    send_html_email(
        subject=f"New Registration: {registration.full_name}",
        html_content=admin_html,
        to_emails=[settings.ADMIN_NOTIFICATION_EMAIL],
        text_content=f"New registration from {registration.full_name}",
    )

    if registration.email:
        user_html = f"""
        <h2>Registration Received</h2>
        <p>Dear {registration.full_name},</p>
        <p>Thank you for registering with Yango Wing Fleet. Our team will contact you within 24 hours.</p>
        <p>City: {registration.city}<br/>Vehicle: {registration.vehicle_type}</p>
        <p>Regards,<br/>Yango Wing Fleet Team</p>
        """
        send_html_email(
            subject="Your Yango Wing Fleet registration was received",
            html_content=user_html,
            to_emails=[registration.email],
            text_content="Registration received. Our team will contact you within 24 hours.",
        )
