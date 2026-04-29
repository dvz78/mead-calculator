import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import { getRecipes } from '../utils/api';

interface UserProfileProps {
    username: string;
    onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ username, onLogout }) => {
    const [recipesCount, setRecipesCount] = useState(0);
    const [joinDate, setJoinDate] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // For now, we'll simulate the join date
                const today = new Date();
                setJoinDate(today.toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long' 
                }));
                
                // Fetch recipes count
                const recipes = await getRecipes();
                setRecipesCount(recipes.length);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <div className="user-profile">
            <div className="profile-header">
                <div className="profile-avatar">
                    <i className="fas fa-user"></i>
                </div>
                <div className="profile-info">
                    <h2>{username}</h2>
                    <p>Miembro desde {joinDate}</p>
                </div>
            </div>
            
            <div className="profile-stats">
                <div className="stat-item">
                    <span className="stat-value">{recipesCount}</span>
                    <span className="stat-label">Recetas Guardadas</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">0</span>
                    <span className="stat-label">Proyectos Activos</span>
                </div>
            </div>
            
            <div className="profile-actions">
                <button className="btn-secondary" onClick={onLogout}>
                    <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default UserProfile;