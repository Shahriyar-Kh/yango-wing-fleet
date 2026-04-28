import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags


logger = logging.getLogger(__name__)


def send_html_email(*, subject, html_content, to_emails, text_content=""):
    """Small wrapper to centralize outgoing HTML email behavior."""
    logger.info(f"send_html_email called: subject='{subject}', to_emails={to_emails}")
    
    if not to_emails:
        logger.warning("send_html_email: No recipients provided, skipping")
        return

    try:
        logger.debug(f"Creating EmailMultiAlternatives with from_email={settings.DEFAULT_FROM_EMAIL}")
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content or "This email requires an HTML-compatible client.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=to_emails,
        )
        msg.attach_alternative(html_content, "text/html")
        
        logger.info(f"Sending email via SMTP: subject='{subject}', recipients={to_emails}")
        msg.send(fail_silently=False)
        logger.info(f"Email sent successfully: subject='{subject}', recipients={to_emails}")
    except Exception as e:
        logger.exception(f"SMTP send failed: subject='{subject}', recipients={to_emails}, error={str(e)}")
        raise




def send_templated_email(*, subject, template_name, context, to_emails):
    """
    Send email using Django templates.
    
    Args:
        subject: Email subject line
        template_name: Path to template (e.g., 'emails/password_reset.html')
        context: Context dict for template rendering
        to_emails: List of recipient email addresses
    """
    logger.info(f"send_templated_email called: subject='{subject}', template='{template_name}', to_emails={to_emails}")
    
    if not to_emails:
        logger.warning(f"send_templated_email: No recipients for template '{template_name}', skipping")
        return

    try:
        logger.debug(f"Rendering template: {template_name}")
        html_content = render_to_string(template_name, context)
        logger.debug(f"Template rendered successfully, size={len(html_content)} bytes")
        
        text_content = strip_tags(html_content)
        logger.debug(f"Extracted text content, size={len(text_content)} bytes")

        send_html_email(
            subject=subject,
            html_content=html_content,
            to_emails=to_emails,
            text_content=text_content,
        )
        logger.info(f"send_templated_email completed successfully: '{subject}'")
    except Exception as e:
        logger.exception(f"send_templated_email failed: subject='{subject}', template='{template_name}', error={str(e)}")
        raise
