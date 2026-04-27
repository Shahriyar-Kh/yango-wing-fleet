from django.conf import settings
from django.core.mail import EmailMultiAlternatives


def send_html_email(*, subject, html_content, to_emails, text_content=""):
    """Small wrapper to centralize outgoing HTML email behavior."""
    if not to_emails:
        return

    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_content or "This email requires an HTML-compatible client.",
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=to_emails,
    )
    msg.attach_alternative(html_content, "text/html")
    msg.send(fail_silently=False)
