#!/bin/bash
set -o errexit

pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py collectstatic --noinput

# Create admin user with all permissions (idempotent)
python3 manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
admin_created = User.objects.update_or_create(
    username='yangowingfleet_admin',
    defaults={
        'email': 'yangowingfleet@gmail.com',
        'is_staff': True,
        'is_superuser': True,
        'is_active': True,
    }
)
if admin_created[1]:
    admin_created[0].set_password('yangowingfleet786')   # CHANGE THIS PASSWORD
    admin_created[0].save()
    print("Superuser admin created/updated with staff & superuser flags.")
else:
    print("Superuser already exists, flags verified.")
EOF