from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, RecetaSerializer
from .models import Receta

class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer

class RecetaListCreateView(generics.ListCreateAPIView):
    serializer_class = RecetaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Receta.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class RecetaDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RecetaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Receta.objects.filter(owner=self.request.user)