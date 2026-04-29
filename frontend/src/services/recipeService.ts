import axios from 'axios';
import type { Recipe, FormattedRecipe, PaginatedResponse } from '../types/recipe';
import { ErrorHandler, formatValidationError } from '../utils/errorHandler';

const API_URL = 'http://localhost:8000/api';

// Interfaz para los parámetros de búsqueda y paginación
interface RecipeSearchParams {
    page?: number;
    pageSize?: number;
    search?: string;
    orderBy?: string;
}

// Predefined recipes for mead
export const predefinedMeadRecipes: Recipe[] = [
    {
        id: 1,
        nombre: 'Hidromiel Tradicional',
        volumen: 10,
        og: 1.100,
        tipo_miel: 'multifloral',
        levadura: 'd47',
        eficiencia: 75,
        especias: '',
        frutas: '',
        cantidad_frutas: 0,
        bloqueador: 'no',
        tipo_bloqueador: 'ninguno',
        nutrientes: 'si',
        tipo_nutrientes: 'dap',
        clarificante: 'no',
        tipo_clarificante: 'ninguno',
        temperatura: 20,
        duracion: 30,
        ph: 4.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notas: '',
        owner: 1
    },
    {
        id: 2,
        nombre: 'Hidromiel Seco',
        volumen: 10,
        og: 1.080,
        tipo_miel: 'acacia',
        levadura: 'k1v1116',
        eficiencia: 85,
        especias: '',
        frutas: '',
        cantidad_frutas: 0,
        bloqueador: 'no',
        tipo_bloqueador: 'ninguno',
        nutrientes: 'si',
        tipo_nutrientes: 'fermaid',
        clarificante: 'si',
        tipo_clarificante: 'bentonita',
        temperatura: 18,
        duracion: 45,
        ph: 3.8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notas: '',
        owner: 1
  },
  {
    id: 3,
    nombre: 'Hidromiel Fuerte',
    volumen: 10,
    og: 1.130,
    tipo_miel: 'manuka',
    levadura: 'rc212',
    eficiencia: 80,
    especias: 'vainilla',
    frutas: '',
    cantidad_frutas: 0,
    bloqueador: 'no',
    tipo_bloqueador: 'sorbato',
    nutrientes: 'si',
    tipo_nutrientes: 'goferit',
    clarificante: 'si',
    tipo_clarificante: 'gelatina',
    temperatura: 22,
    duracion: 60,
    ph: 4.2,
    created_at: new Date().toISOString(),
    owner: 1
  },
  {
    id: 4,
    nombre: 'Hidromiel de Lavanda',
    volumen: 10,
    og: 1.110,
    tipo_miel: 'lavanda',
    levadura: 'd80',
    eficiencia: 75,
    especias: 'lavanda',
    frutas: '',
    cantidad_frutas: 0,
    bloqueador: 'no',
    tipo_bloqueador: 'sorbato',
    nutrientes: 'si',
    tipo_nutrientes: 'dap',
    clarificante: 'si',
    tipo_clarificante: 'bentonita',
    temperatura: 20,
    duracion: 30,
    ph: 4.0,
    created_at: new Date().toISOString(),
    owner: 1
  }
];

// Predefined recipes for wine
export const predefinedWineRecipes: Recipe[] = [
  {
    id: 5,
    nombre: 'Vino Tinto Clásico',
    volumen: 10,
    og: 1.090,
    tipo_miel: 'cabernet',
    levadura: 'rc212',
    eficiencia: 75,
    especias: '',
    frutas: 'uva',
    cantidad_frutas: 15,
    bloqueador: 'no',
    tipo_bloqueador: 'sorbato',
    nutrientes: 'si',
    tipo_nutrientes: 'dap',
    clarificante: 'si',
    tipo_clarificante: 'bentonita',
    temperatura: 25,
    duracion: 14,
    ph: 3.6,
    created_at: new Date().toISOString(),
    owner: 1
  },
  {
    id: 6,
    nombre: 'Vino Blanco Seco',
    volumen: 10,
    og: 1.085,
    tipo_miel: 'chardonnay',
    levadura: 'd47',
    eficiencia: 80,
    especias: '',
    frutas: 'uva',
    cantidad_frutas: 14,
    bloqueador: 'no',
    tipo_bloqueador: 'sorbato',
    nutrientes: 'si',
    tipo_nutrientes: 'fermaidk',
    clarificante: 'si',
    tipo_clarificante: 'bentonita',
    temperatura: 18,
    duracion: 21,
    ph: 3.2,
    created_at: new Date().toISOString(),
    owner: 1
  },
  {
    id: 7,
    nombre: 'Vino Rosado',
    volumen: 10,
    og: 1.095,
    tipo_miel: 'pinot',
    levadura: 'd80',
    eficiencia: 75,
    especias: '',
    frutas: 'uva',
    cantidad_frutas: 16,
    bloqueador: 'no',
    tipo_bloqueador: 'sorbato',
    nutrientes: 'si',
    tipo_nutrientes: 'dap',
    clarificante: 'si',
    tipo_clarificante: 'gelatina',
    temperatura: 20,
    duracion: 10,
    ph: 3.4,
    created_at: new Date().toISOString(),
    owner: 1
  }
];

// Combine all predefined recipes
export const getAllPredefinedRecipes = (): Recipe[] => {
  return [...predefinedMeadRecipes, ...predefinedWineRecipes];
};

// Get predefined recipes by type
export const getPredefinedRecipesByType = (type: 'mead' | 'wine'): Recipe[] => {
  if (type === 'mead') {
    return predefinedMeadRecipes;
  } else {
    return predefinedWineRecipes;
  }
};

// Calculate recipe ingredients
export const calculateRecipeIngredients = (recipe: Recipe) => {
  const volumen = recipe.volumen;
  const og = recipe.og;
  
  // Calculate honey/must needed (simplified calculation)
  const puntosGravedad = (og - 1) * 1000;
  const librasPorGalon = puntosGravedad / 35; // 35 points per pound of honey
  const totalLibras = librasPorGalon * (volumen / 3.78541); // Convert liters to gallons
  const mielKg = totalLibras * 0.453592; // Convert pounds to kg
  
  // Calculate water needed
  const densidadMiel = 1.42; // kg/L
  const volumenMiel = mielKg / densidadMiel;
  const aguaLitros = volumen - volumenMiel;
  
  // Calculate ABV
  const abv = (og - 1) * 131.25 * (recipe.eficiencia / 100);
  
  // Calculate nutrients
  const nutrientesGramos = recipe.nutrientes === 'si' ? volumen * 0.5 : 0;
  
  // Calculate clarifying agents
  const clarificanteGramos = recipe.clarificante === 'si' ? volumen * 1 : 0;
  
  return {
    mielKg,
    aguaLitros,
    abv,
    nutrientesGramos,
    clarificanteGramos
  };
};

// Format recipe for display
export const formatRecipeForDisplay = (recipe: Recipe): FormattedRecipe => {
  const ingredients = calculateRecipeIngredients(recipe);
  
  return {
    ...recipe,
    tipo: recipe.frutas ? 'vino' : 'hidromiel',
    abv: ingredients.abv.toFixed(1),
    ingredientes: {
      miel: ingredients.mielKg.toFixed(2),
      agua: ingredients.aguaLitros.toFixed(2),
      nutrientes: ingredients.nutrientesGramos.toFixed(2),
      clarificante: ingredients.clarificanteGramos.toFixed(2)
    }
  } as FormattedRecipe;
};