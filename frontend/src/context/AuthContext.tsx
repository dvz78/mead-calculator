import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';

interface User {
    id: number;
    username: string;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Decode JWT token to get user info (simplified version)
const decodeToken = (token: string): User | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        return {
            id: payload.user_id || payload.id,
            username: payload.username || 'Usuario'
        };
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (token) {
            const decodedUser = decodeToken(token);
            setUser(decodedUser);
        } else {
            setUser(null);
        }
    }, [token]);

    const login = (newToken: string) => {
        console.log("Guardando nuevo token en el contexto:", newToken);
        setToken(newToken);
        localStorage.setItem('authToken', newToken);
        
        // Decode and set user
        const decodedUser = decodeToken(newToken);
        setUser(decodedUser);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
