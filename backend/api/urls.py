from django.urls import path
from .views import RegisterView, RecetaListCreateView, RecetaDetailView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('recetas/', RecetaListCreateView.as_view(), name='receta-list-create'),
    path('recetas/<int:pk>/', RecetaDetailView.as_view(), name='receta-detail'),
]
