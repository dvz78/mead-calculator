import logging
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError

logger = logging.getLogger('api')

class Receta(models.Model):
    TIPOS_MIEL = [
        ('multifloral', 'Multifloral'),
        ('eucalipto', 'Eucalipto'),
        ('acacia', 'Acacia'),
        ('naranjo', 'Naranjo'),
        ('castaño', 'Castaño'),
        ('romero', 'Romero'),
        ('lavanda', 'Lavanda'),
        ('manuka', 'Manuka'),
        ('silvestre', 'Silvestre'),
        ('otros', 'Otros'),
    ]

    TIPOS_BLOQUEADOR = [
        ('metabisulfito', 'Metabisulfito'),
        ('sorbato', 'Sorbato de potasio'),
        ('ninguno', 'Ninguno'),
    ]

    TIPOS_NUTRIENTES = [
        ('dap', 'DAP'),
        ('fermaid', 'Fermaid'),
        ('fermaidk', 'Fermaid K'),
        ('goferit', 'GoFerm IT'),
        ('ninguno', 'Ninguno'),
    ]

    TIPOS_CLARIFICANTE = [
        ('bentonita', 'Bentonita'),
        ('gelatina', 'Gelatina'),
        ('silica', 'Sílice'),
        ('ninguno', 'Ninguno'),
    ]

    # Campos básicos
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recetas')
    nombre = models.CharField(max_length=100, default='Mi Hidromiel')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notas = models.TextField(blank=True)

    # Campos de la receta con validaciones
    volumen = models.FloatField(
        validators=[MinValueValidator(1), MaxValueValidator(1000)],
        help_text="Volumen en litros (1-1000)"
    )
    og = models.FloatField(
        validators=[MinValueValidator(1.000), MaxValueValidator(1.200)],
        help_text="Densidad original (1.000-1.200)"
    )
    tipo_miel = models.CharField(
        max_length=50,
        choices=TIPOS_MIEL,
        default='multifloral'
    )
    levadura = models.CharField(
        max_length=50,
        help_text="Tipo de levadura utilizada"
    )
    eficiencia = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Eficiencia en porcentaje (0-100)"
    )

    # Ingredientes opcionales
    especias = models.CharField(max_length=200, blank=True, null=True)
    frutas = models.CharField(max_length=200, blank=True, null=True)
    cantidad_frutas = models.FloatField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text="Cantidad de frutas en gramos"
    )

    # Aditivos
    bloqueador = models.CharField(
        max_length=20,
        choices=[('si', 'Sí'), ('no', 'No')],
        default='no'
    )
    tipo_bloqueador = models.CharField(
        max_length=50,
        choices=TIPOS_BLOQUEADOR,
        default='ninguno'
    )
    nutrientes = models.CharField(
        max_length=20,
        choices=[('si', 'Sí'), ('no', 'No')],
        default='no'
    )
    tipo_nutrientes = models.CharField(
        max_length=50,
        choices=TIPOS_NUTRIENTES,
        default='ninguno'
    )
    clarificante = models.CharField(
        max_length=20,
        choices=[('si', 'Sí'), ('no', 'No')],
        default='no'
    )
    tipo_clarificante = models.CharField(
        max_length=50,
        choices=TIPOS_CLARIFICANTE,
        default='ninguno'
    )

    # Parámetros de fermentación
    temperatura = models.FloatField(
        validators=[MinValueValidator(10), MaxValueValidator(35)],
        help_text="Temperatura en °C (10-35)"
    )
    duracion = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(365)],
        help_text="Duración en días (1-365)"
    )
    ph = models.FloatField(
        validators=[MinValueValidator(2.0), MaxValueValidator(7.0)],
        blank=True, null=True,
        help_text="pH (2.0-7.0)"
    )

    def clean(self):
        """Validaciones personalizadas"""
        if self.bloqueador == 'no' and self.tipo_bloqueador != 'ninguno':
            raise ValidationError({'tipo_bloqueador': 'No se puede especificar un tipo de bloqueador si no se usa bloqueador'})
        
        if self.nutrientes == 'no' and self.tipo_nutrientes != 'ninguno':
            raise ValidationError({'tipo_nutrientes': 'No se puede especificar un tipo de nutriente si no se usan nutrientes'})
        
        if self.clarificante == 'no' and self.tipo_clarificante != 'ninguno':
            raise ValidationError({'tipo_clarificante': 'No se puede especificar un tipo de clarificante si no se usa clarificante'})

        if self.cantidad_frutas > 0 and not self.frutas:
            raise ValidationError({'frutas': 'Debe especificar las frutas si indica una cantidad'})

    def save(self, *args, **kwargs):
        """Sobrescribimos save para ejecutar validaciones personalizadas"""
        self.clean()
        super().save(*args, **kwargs)
        logger.info(f"Receta {self.nombre} guardada/actualizada", 
                   extra={'user_id': self.owner_id, 'receta_id': self.id})

    def __str__(self):
        return f"{self.nombre} ({self.created_at.strftime('%Y-%m-%d')})"

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Receta'
        verbose_name_plural = 'Recetas'