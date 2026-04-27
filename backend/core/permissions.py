from rest_framework.permissions import IsAdminUser


class IsDashboardAdmin(IsAdminUser):
    """Allows access only to staff users for private dashboard APIs."""
