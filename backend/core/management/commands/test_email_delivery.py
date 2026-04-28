import logging
from django.core.management.base import BaseCommand
from django.conf import settings
from django.contrib.auth.models import User
from django.utils import timezone

from core.models import PasswordResetToken
from core.services.email_service import send_templated_email, send_html_email
from registrations.models import RegistrationSubmission, VehicleType
from registrations.services.notifications import send_registration_notifications


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


class Command(BaseCommand):
    help = 'Test email delivery end-to-end'

    def add_arguments(self, parser):
        parser.add_argument(
            'test_type',
            type=str,
            nargs='?',
            default='all',
            choices=['all', 'registration', 'password-reset', 'raw'],
            help='Type of email test to run'
        )
        parser.add_argument(
            '--recipient',
            type=str,
            help='Email recipient for testing',
        )

    def handle(self, *args, **options):
        test_type = options['test_type']
        recipient = options.get('recipient') or settings.ADMIN_NOTIFICATION_EMAIL

        self.stdout.write(self.style.SUCCESS('\n' + '='*70))
        self.stdout.write(self.style.SUCCESS('EMAIL DELIVERY DEBUG TEST'))
        self.stdout.write(self.style.SUCCESS('='*70))

        self.stdout.write(f'\nTest Type: {test_type}')
        self.stdout.write(f'Admin Email: {settings.ADMIN_NOTIFICATION_EMAIL}')
        self.stdout.write(f'Test Recipient: {recipient}')
        self.stdout.write(f'Frontend Base URL: {settings.FRONTEND_BASE_URL}')
        self.stdout.write(f'Email Backend: {settings.EMAIL_BACKEND}')
        self.stdout.write(f'SMTP Host: {settings.EMAIL_HOST}')
        self.stdout.write(f'SMTP Port: {settings.EMAIL_PORT}')
        self.stdout.write(f'SMTP TLS: {settings.EMAIL_USE_TLS}')
        self.stdout.write(f'SMTP User: {settings.EMAIL_HOST_USER}')
        self.stdout.write('')

        try:
            if test_type in ['all', 'raw']:
                self.test_raw_smtp(recipient)

            if test_type in ['all', 'registration']:
                self.test_registration_email(recipient)

            if test_type in ['all', 'password-reset']:
                self.test_password_reset_email(recipient)

            self.stdout.write(self.style.SUCCESS('\n' + '='*70))
            self.stdout.write(self.style.SUCCESS('ALL TESTS COMPLETED'))
            self.stdout.write(self.style.SUCCESS('='*70 + '\n'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'\nFATAL ERROR: {str(e)}'))
            logger.exception('Test command failed')

    def test_raw_smtp(self, recipient):
        """Test raw Django send_mail"""
        self.stdout.write(self.style.WARNING('\n1. TESTING RAW SMTP SEND'))
        self.stdout.write('-' * 70)

        try:
            self.stdout.write(f'Sending raw email to: {recipient}')
            from django.core.mail import send_mail

            result = send_mail(
                subject='[TEST] Yango Wing Fleet Email System Check',
                message='This is a test email from Yango Wing Fleet email debugging.\n\nIf you received this, SMTP is working correctly.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient],
                fail_silently=False,
            )
            self.stdout.write(self.style.SUCCESS(f'[OK] Raw SMTP send() returned: {result}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'[ERROR] Raw SMTP failed: {str(e)}'))
            logger.exception('Raw SMTP test failed')

    def test_registration_email(self, recipient):
        """Test registration notification email"""
        self.stdout.write(self.style.WARNING('\n2. TESTING REGISTRATION EMAIL'))
        self.stdout.write('-' * 70)

        try:
            # Create test registration
            test_registration = RegistrationSubmission.objects.create(
                full_name='Test Rider Debug',
                phone='+923001234567',
                email=recipient,
                cnic='12345-6789012-3',
                city='Test City',
                vehicle_type=VehicleType.CAR,
                vehicle_model='Test Model',
                vehicle_year=2024,
                notes='Test registration for email debugging',
            )
            self.stdout.write(f'Created test registration: id={test_registration.id}')

            # Send notifications
            self.stdout.write('Calling send_registration_notifications()...')
            send_registration_notifications(test_registration)

            # Clean up
            test_registration.delete()
            self.stdout.write(self.style.SUCCESS('[OK] Registration email test completed'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'[ERROR] Registration email test failed: {str(e)}'))
            logger.exception('Registration email test failed')

    def test_password_reset_email(self, recipient):
        """Test password reset email"""
        self.stdout.write(self.style.WARNING('\n3. TESTING PASSWORD RESET EMAIL'))
        self.stdout.write('-' * 70)

        try:
            # Get or create test user
            email = 'passwordreset_test@example.com'
            user, created = User.objects.get_or_create(
                email=email,
                defaults={'username': 'passwordreset_test'}
            )
            self.stdout.write(f'{"Created" if created else "Found"} test user: {user.username} ({user.email})')

            # Create reset token
            token_obj = PasswordResetToken.create_for_user(user, None)
            self.stdout.write(f'Created reset token: {token_obj.token[:10]}...')

            # Build reset link
            reset_link = f"{settings.FRONTEND_BASE_URL}/admin/reset-password/{token_obj.token}"

            # Send reset email to test recipient
            context = {
                "user": user,
                "reset_link": reset_link,
            }

            self.stdout.write(f'Sending password reset email to: {recipient}')
            send_templated_email(
                subject="[TEST] Reset Your Yango Wing Fleet Password",
                template_name="emails/password_reset.html",
                context=context,
                to_emails=[recipient],
            )
            self.stdout.write(self.style.SUCCESS('[OK] Password reset email test completed'))

            # Clean up
            token_obj.delete()

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'[ERROR] Password reset email test failed: {str(e)}'))
            logger.exception('Password reset email test failed')
