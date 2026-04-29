import axios from 'axios';
import type { Recipe, PaginatedResponse } from '../types/recipe';
import { ErrorHandler, formatValidationError } from '../utils/errorHandler';

// Constants
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const RECIPES_ENDPOINT = `${API_URL}/recetas/`;

// Types for recipe status and filtering
export type RecipeStatus = 'active' | 'archived' | 'completed';

export interface RecipeSearchParams {
    page?: number;
    pageSize?: number;
    search?: string;
    orderBy?: string;
    status?: RecipeStatus;
    tipo_miel?: string;
}

// API functions
export async function getRecipes(params: RecipeSearchParams = {}): Promise<PaginatedResponse<Recipe>> {
    try {
        const queryParams = new URLSearchParams();
        
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.pageSize) queryParams.append('page_size', params.pageSize.toString());
        if (params.search) queryParams.append('search', params.search);
        if (params.orderBy) queryParams.append('ordering', params.orderBy);
        if (params.status) queryParams.append('status', params.status);
        if (params.tipo_miel) queryParams.append('tipo_miel', params.tipo_miel);

        const response = await axios.get<PaginatedResponse<Recipe>>(`${RECIPES_ENDPOINT}?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        throw ErrorHandler.handleApiError(error);
    }
}

export async function getRecipe(id: number): Promise<Recipe> {
    try {
        const response = await axios.get<Recipe>(`${RECIPES_ENDPOINT}${id}/`);
        return response.data;
    } catch (error) {
        throw ErrorHandler.handleApiError(error);
    }
}

export async function createRecipe(recipe: Omit<Recipe, 'id' | 'created_at' | 'updated_at' | 'owner'>): Promise<Recipe> {
    try {
        const response = await axios.post<Recipe>(RECIPES_ENDPOINT, recipe);
        return response.data;
    } catch (error) {
        const apiError = ErrorHandler.handleApiError(error);
        const validationErrors = formatValidationError(error);
        throw { ...apiError, validationErrors };
    }
}

export async function updateRecipe(id: number, recipe: Partial<Recipe>): Promise<Recipe> {
    try {
        const response = await axios.patch<Recipe>(`${RECIPES_ENDPOINT}${id}/`, recipe);
        return response.data;
    } catch (error) {
        const apiError = ErrorHandler.handleApiError(error);
        const validationErrors = formatValidationError(error);
        throw { ...apiError, validationErrors };
    }
}

export async function deleteRecipe(id: number): Promise<void> {
    try {
        await axios.delete(`${RECIPES_ENDPOINT}${id}/`);
    } catch (error) {
        throw ErrorHandler.handleApiError(error);
    }
}

export async function duplicateRecipe(id: number): Promise<Recipe> {
    try {
        const response = await axios.post<Recipe>(`${RECIPES_ENDPOINT}${id}/duplicate/`);
        return response.data;
    } catch (error) {
        throw ErrorHandler.handleApiError(error);
    }
}

export async function exportRecipe(id: number, format: 'pdf' | 'json'): Promise<Blob | Recipe> {
    try {
        const response = await axios.get<Blob | Recipe>(`${RECIPES_ENDPOINT}${id}/export/?format=${format}`, {
            responseType: format === 'pdf' ? 'blob' : 'json'
        });
        
        if (format === 'pdf') {
            const blob = new Blob([response.data as BlobPart], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `recipe-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            return blob;
        } else {
            return response.data as Recipe;
        }
    } catch (error) {
        throw ErrorHandler.handleApiError(error);
    }
}

// Export all functions as a service object
export const recipeService = {
    getRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    duplicateRecipe,
    exportRecipe,
};