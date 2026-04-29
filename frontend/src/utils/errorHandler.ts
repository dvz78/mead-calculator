import { AxiosError } from 'axios';

export interface ApiError {
    error: string;
    detail: string | string[] | Record<string, string[]>;
    status_code: number;
}

export class ErrorHandler {
    static handleApiError(error: unknown): ApiError {
        if (error instanceof AxiosError && error.response?.data) {
            const data = error.response.data;
            return {
                error: data.error || 'Error en la solicitud',
                detail: data.detail || 'No hay detalles disponibles',
                status_code: error.response.status
            };
        }
        
        return {
            error: 'Error inesperado',
            detail: 'Ha ocurrido un error inesperado',
            status_code: 500
        };
    }

    static getErrorMessage(error: ApiError): string {
        if (typeof error.detail === 'string') {
            return error.detail;
        }
        
        if (Array.isArray(error.detail)) {
            return error.detail.join('. ');
        }
        
        if (typeof error.detail === 'object') {
            return Object.entries(error.detail)
                .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                .join('. ');
        }
        
        return error.error;
    }
}

export function formatValidationError(error: unknown): Record<string, string> {
    if (error instanceof AxiosError && error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === 'object' && !Array.isArray(detail)) {
            return Object.entries(detail).reduce((acc, [key, value]) => {
                acc[key] = Array.isArray(value) ? value.join(', ') : String(value);
                return acc;
            }, {} as Record<string, string>);
        }
    }
    return {};
}