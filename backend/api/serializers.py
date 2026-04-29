from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Receta

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            password=validated_data['password']
        )
        return user

class RecetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receta
        fields = '__all__'
        read_only_fields = ('owner', 'created_at')

    def validate_volumen(self, value):
        if value <= 0:
            raise serializers.ValidationError("El volumen debe ser un valor positivo.")
        return value

    def validate_og(self, value):
        if value <= 1.000:
            raise serializers.ValidationError("La densidad original (OG) debe ser mayor que 1.000.")
        return value

    def validate_eficiencia(self, value):
        if not (0 < value <= 100):
            raise serializers.ValidationError("La eficiencia debe estar entre 0 y 100.")
        return value

    def validate_temperatura(self, value):
        if not (10 <= value <= 35):  # Match model validation
            raise serializers.ValidationError("La temperatura debe estar entre 10 y 35 grados Celsius.")
        return value

    def validate_duracion(self, value):
        if value <= 0:
            raise serializers.ValidationError("La duración debe ser un número positivo de días.")
        return value

    def validate_ph(self, value):
        if value is not None and not (2.5 <= value <= 5.0): # Typical pH range for mead/wine
            raise serializers.ValidationError("El pH debe estar entre 2.5 y 5.0.")
        return value
