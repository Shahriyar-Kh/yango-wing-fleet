from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Deletes all existing admin users and creates a fresh superuser'

    def handle(self, *args, **options):
        # Define the new admin credentials
        new_username = 'yangrowingfleet_admin'
        new_email = 'yangowingfleet@gmail.com'
        new_password = 'yangowingfleet786'

        # Delete any existing superusers or staff users
        # (you can also delete by specific usernames)
        admin_usernames_to_delete = ['admin']
        deleted_count = 0

        for username in admin_usernames_to_delete:
            users = User.objects.filter(username=username)
            if users.exists():
                count = users.count()
                users.delete()
                deleted_count += count
                self.stdout.write(self.style.WARNING(f'Deleted {count} user(s) with username "{username}".'))

        # Optionally, delete all superusers (uncomment if needed)
        # superusers = User.objects.filter(is_superuser=True)
        # if superusers.exists():
        #     deleted_count += superusers.count()
        #     superusers.delete()
        #     self.stdout.write(self.style.WARNING(f'Deleted {superusers.count()} superuser(s).'))

        if deleted_count > 0:
            self.stdout.write(self.style.WARNING(f'Total {deleted_count} admin user(s) removed.'))

        # Create the new superuser
        if not User.objects.filter(username=new_username).exists():
            user = User.objects.create_superuser(new_username, new_email, new_password)
            self.stdout.write(self.style.SUCCESS(f'Superuser "{new_username}" created successfully.'))
        else:
            # This should not happen because we deleted it, but as a fallback:
            user = User.objects.get(username=new_username)
            user.is_superuser = True
            user.is_staff = True
            user.is_active = True
            user.set_password(new_password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Superuser "{new_username}" updated with full permissions.'))

        # Ensure the user has all flags
        user = User.objects.get(username=new_username)
        user.is_superuser = True
        user.is_staff = True
        user.is_active = True
        user.email = new_email
        user.save()
        self.stdout.write(self.style.SUCCESS(f'Superuser "{new_username}" now has full admin permissions.'))