import React from 'react';
import type { ApiError } from '../../utils/errorHandler';
import { ErrorHandler } from '../../utils/errorHandler';
import './ErrorMessage.css';

interface ErrorMessageProps {
    error: ApiError;
    onClose?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onClose }) => {
    const message = ErrorHandler.getErrorMessage(error);

    return (
        <div className="error-message" role="alert">
            <h4>{error.error}</h4>
            <p>{message}</p>
            {onClose && (
                <button 
                    type="button" 
                    className="close" 
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
            )}
        </div>
    );
};

interface FormErrorProps {
    error?: string;
}

export const FormError: React.FC<FormErrorProps> = ({ error }) => {
    if (!error) return null;

    return (
        <div className="error-feedback">
            {error}
        </div>
    );
};