from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Deletes conflicting admin users and creates a fresh superuser'

    def handle(self, *args, **options):
        target_username = 'yangowingfleet'
        target_email = 'yangowingfleet@gmail.com'
        target_password = 'yangowingfleet786'

        # Delete any users with conflicting usernames
        usernames_to_delete = ['admin', 'yangowingfleet_admin']
        deleted = 0
        for username in usernames_to_delete:
            users = User.objects.filter(username=username)
            count = users.count()
            if count:
                users.delete()
                deleted += count
                self.stdout.write(self.style.WARNING(f'Deleted {count} user(s) with username "{username}".'))
        if deleted:
            self.stdout.write(self.style.WARNING(f'Total {deleted} conflicting user(s) removed.'))

        # Create fresh superuser
        user, created = User.objects.get_or_create(
            username=target_username,
            defaults={
                'email': target_email,
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
            }
        )
        # Force correct password and flags (even if user existed)
        user.set_password(target_password)
        user.email = target_email
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save()

        if created:
            self.stdout.write(self.style.SUCCESS(f'Superuser "{target_username}" created successfully.'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Superuser "{target_username}" updated with full permissions.'))