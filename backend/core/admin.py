from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Forces recreation of the admin superuser with full permissions'

    def handle(self, *args, **options):
        target_username = 'admin'
        target_email = 'yangowingfleet@gmail.com'
        target_password = 'yangowingfleet786'

        # Delete any existing user with this username
        users_deleted, _ = User.objects.filter(username=target_username).delete()
        if users_deleted:
            self.stdout.write(self.style.WARNING(f'Deleted {users_deleted} existing user(s) with username "{target_username}".'))

        # Create fresh superuser
        user = User.objects.create_superuser(target_username, target_email, target_password)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save()

        self.stdout.write(self.style.SUCCESS(f'Superuser "{target_username}" created/updated with full permissions.'))