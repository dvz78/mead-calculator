import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Set up axios with default headers
const apiClient = axios.create({
  baseURL: API_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token might be expired, remove it
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

// Auth interface
export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface User {
  id: number;
  username: string;
}

// Recipe interface matching the backend model
export interface Recipe {
  id: number;
  nombre: string;
  volumen: number;
  og: number;
  tipo_miel: string;
  levadura: string;
  eficiencia: number;
  especias: string | null;
  frutas: string | null;
  cantidad_frutas: number;
  bloqueador: string;
  tipo_bloqueador: string;
  nutrientes: string;
  tipo_nutrientes: string;
  clarificante: string;
  tipo_clarificante: string;
  temperatura: number;
  duracion: number;
  ph: number | null;
  created_at: string;
}

// Register a new user
export const register = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post('/register/', { username, password });
  return response.data;
};

// Login user
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await apiClient.post('/token/', { username, password });
  return response.data;
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/user/');
  return response.data;
};

// Save a recipe
export const saveRecipe = async (recipe: Omit<Recipe, 'id' | 'created_at'>): Promise<Recipe> => {
  const response = await apiClient.post('/recetas/', recipe);
  return response.data;
};

// Get all recipes for the current user
export const getRecipes = async (): Promise<Recipe[]> => {
  const response = await apiClient.get('/recetas/');
  // Handle paginated response from DRF
  if (response.data.results) {
    return response.data.results;
  }
  return response.data;
};

// Get a specific recipe by ID
export const getRecipe = async (id: number): Promise<Recipe> => {
  const response = await apiClient.get(`/recetas/${id}/`);
  return response.data;
};

// Update a recipe
export const updateRecipe = async (id: number, recipe: Partial<Recipe>): Promise<Recipe> => {
  const response = await apiClient.put(`/recetas/${id}/`, recipe);
  return response.data;
};

// Delete a recipe
export const deleteRecipe = async (id: number): Promise<void> => {
  await apiClient.delete(`/recetas/${id}/`);
};