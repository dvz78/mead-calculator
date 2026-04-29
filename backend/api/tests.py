from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Receta
from rest_framework_simplejwt.tokens import RefreshToken

class RecetaTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        # Obtain JWT token
        response = self.client.post(
            reverse('token_obtain_pair'),
            {'username': 'testuser', 'password': 'testpassword'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token)

        self.list_create_url = reverse('receta-list-create') # Assuming this is the URL name

        # Create a Receta for detail view tests
        self.receta_data = {
            "nombre": "Receta de Prueba",
            "volumen": 10.0,
            "og": 1.070,
            "tipo_miel": "Azahar",
            "levadura": "Lalvin K1V-1116",
            "eficiencia": 80.0,
            "especias": "",
            "frutas": "",
            "cantidad_frutas": 0.0,
            "bloqueador": "Si",
            "tipo_bloqueador": "Sorbato de Potasio",
            "nutrientes": "Si",
            "tipo_nutrientes": "Fermaid K",
            "clarificante": "Si",
            "tipo_clarificante": "Bentonita",
            "temperatura": 22.0,
            "duracion": 60,
            "ph": 3.8
        }
        self.receta = Receta.objects.create(owner=self.user, **self.receta_data)
        self.detail_url = reverse('receta-detail', kwargs={'pk': self.receta.pk})

    def test_create_receta(self):
        data = {
            "nombre": "Mi Primera Hidromiel",
            "volumen": 5.0,
            "og": 1.060,
            "tipo_miel": "Multifloral",
            "levadura": "Safale US-05",
            "eficiencia": 75.0,
            "especias": "",
            "frutas": "",
            "cantidad_frutas": 0.0,
            "bloqueador": "Si",
            "tipo_bloqueador": "Sorbato de Potasio",
            "nutrientes": "Si",
            "tipo_nutrientes": "Fermaid O",
            "clarificante": "Si",
            "tipo_clarificante": "Bentonita",
            "temperatura": 20.0,
            "duracion": 30,
            "ph": 3.5
        }
        response = self.client.post(self.list_create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Receta.objects.count(), 2) # Now 2 recetas
        self.assertEqual(Receta.objects.get(nombre="Mi Primera Hidromiel").owner, self.user)
        self.assertEqual(response.data['owner'], self.user.id)

    def test_retrieve_receta(self):
        response = self.client.get(self.detail_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], self.receta_data['nombre'])
        self.assertEqual(response.data['owner'], self.user.id)

    def test_update_receta(self):
        updated_data = self.receta_data.copy()
        updated_data['nombre'] = "Receta Actualizada"
        updated_data['volumen'] = 12.0
        response = self.client.put(self.detail_url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.receta.refresh_from_db()
        self.assertEqual(self.receta.nombre, "Receta Actualizada")
        self.assertEqual(self.receta.volumen, 12.0)

    def test_delete_receta(self):
        response = self.client.delete(self.detail_url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Receta.objects.count(), 0) # Only 1 receta was created in setUp, now deleted
