from django.conf import settings

from core.services.email_service import send_html_email


def send_inquiry_notification(inquiry):
    html = f"""
    <h2>New {inquiry.inquiry_type.title()} Inquiry</h2>
    <ul>
      <li><strong>Name:</strong> {inquiry.name}</li>
      <li><strong>Email:</strong> {inquiry.email}</li>
      <li><strong>Phone:</strong> {inquiry.phone}</li>
      <li><strong>Subject:</strong> {inquiry.subject}</li>
      <li><strong>Message:</strong> {inquiry.message}</li>
      <li><strong>Status:</strong> {inquiry.status}</li>
      <li><strong>Submitted At:</strong> {inquiry.created_at}</li>
    </ul>
    """
    send_html_email(
        subject=f"New {inquiry.inquiry_type.title()} Inquiry: {inquiry.name}",
        html_content=html,
        to_emails=[settings.ADMIN_NOTIFICATION_EMAIL],
        text_content=f"New inquiry from {inquiry.name}",
    )
