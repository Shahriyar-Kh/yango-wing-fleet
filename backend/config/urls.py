from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.http import JsonResponse
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


# ✅ Root health check (IMPORTANT for Render)
def root_view(request):
    return JsonResponse({
        "status": "ok",
        "message": "Yango Wing Fleet Backend Running",
        "api": "/api/"
    })


urlpatterns = [
    # ✅ Root endpoint (fixes Render 404)
    path("", root_view),

    path('admin/', admin.site.urls),

    # Auth
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # APIs
    path('api/', include('core.urls')),
    path('api/', include('public_content.urls')),
    path('api/', include('registrations.urls')),
    path('api/', include('inquiries.urls')),
    path('api/', include('dashboard.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)