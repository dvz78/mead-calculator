import React, { useState } from 'react';
import './BrewingDashboard.css';
import { useAuth } from '../context/AuthContext';

const BrewingDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'recipes' | 'saved'>('overview');

  // Predefined recipes data
  const predefinedRecipes = [
    {
      id: 1,
      name: 'Hidromiel Tradicional',
      type: 'hidromiel',
      abv: '13.5',
      volume: '10L',
      difficulty: 'Fácil'
    },
    {
      id: 2,
      name: 'Hidromiel Seco',
      type: 'hidromiel',
      abv: '10.5',
      volume: '10L',
      difficulty: 'Fácil'
    },
    {
      id: 3,
      name: 'Hidromiel Fuerte',
      type: 'hidromiel',
      abv: '17.5',
      volume: '10L',
      difficulty: 'Intermedia'
    },
    {
      id: 4,
      name: 'Vino Tinto Clásico',
      type: 'vino',
      abv: '13.0',
      volume: '10L',
      difficulty: 'Intermedia'
    },
    {
      id: 5,
      name: 'Vino Blanco Seco',
      type: 'vino',
      abv: '12.0',
      volume: '10L',
      difficulty: 'Fácil'
    },
    {
      id: 6,
      name: 'Vino Rosado',
      type: 'vino',
      abv: '12.5',
      volume: '10L',
      difficulty: 'Fácil'
    }
  ];

  const handleRecipeSelect = (recipeName: string) => {
    alert(`Cargando receta: ${recipeName}`);
  };

  return (
    <div className="brewing-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1><i className="fas fa-beer"></i> BrewMaster Pro</h1>
          <p>Calculadora Profesional de Fermentaciones</p>
        </div>
        <div className="user-controls">
          <div className="user-info">
            <i className="fas fa-user-circle"></i>
            <span>{user?.username}</span>
          </div>
          <button className="logout-btn" onClick={logout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'overview' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-home"></i>
          <span>Inicio</span>
        </button>
        <button 
          className={activeTab === 'recipes' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('recipes')}
        >
          <i className="fas fa-book"></i>
          <span>Recetas</span>
        </button>
        <button 
          className={activeTab === 'saved' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('saved')}
        >
          <i className="fas fa-save"></i>
          <span>Guardadas</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="welcome-section">
              <h2>Bienvenido, {user?.username}!</h2>
              <p>Explora recetas, calcula ingredientes y gestiona tus fermentaciones</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon bg-primary">
                  <i className="fas fa-beer"></i>
                </div>
                <div className="stat-info">
                  <h3>0</h3>
                  <p>Recetas Guardadas</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon bg-secondary">
                  <i className="fas fa-flask"></i>
                </div>
                <div className="stat-info">
                  <h3>0</h3>
                  <p>En Proceso</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon bg-success">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-info">
                  <h3>0</h3>
                  <p>Completadas</p>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Acciones Rápidas</h3>
              <div className="actions-grid">
                <button className="action-btn" onClick={() => alert('Calculadora en desarrollo')}>
                  <i className="fas fa-calculator"></i>
                  <span>Nueva Receta</span>
                </button>
                <button className="action-btn" onClick={() => setActiveTab('recipes')}>
                  <i className="fas fa-book"></i>
                  <span>Explorar Recetas</span>
                </button>
                <button className="action-btn" onClick={() => setActiveTab('saved')}>
                  <i className="fas fa-save"></i>
                  <span>Ver Guardadas</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recipes Tab */}
        {activeTab === 'recipes' && (
          <div className="recipes-content">
            <div className="recipes-header">
              <h2><i className="fas fa-book"></i> Recetas Predefinidas</h2>
            </div>

            <div className="recipes-grid">
              {predefinedRecipes.map(recipe => (
                <div 
                  key={recipe.id} 
                  className="recipe-card"
                  onClick={() => handleRecipeSelect(recipe.name)}
                >
                  <div className="recipe-header">
                    <div className={`recipe-icon ${recipe.type === 'hidromiel' ? 'bg-mead' : 'bg-wine'}`}>
                      <i className={`fas ${recipe.type === 'hidromiel' ? 'fa-beer' : 'fa-wine-glass-alt'}`}></i>
                    </div>
                    <div className="recipe-meta">
                      <span className="recipe-type-badge">
                        {recipe.type === 'hidromiel' ? 'Hidromiel' : 'Vino'}
                      </span>
                      <span className="recipe-abv">{recipe.abv}% ABV</span>
                    </div>
                  </div>
                  <div className="recipe-body">
                    <h3>{recipe.name}</h3>
                    <div className="recipe-details">
                      <div className="detail-item">
                        <span className="label">Volumen:</span>
                        <span className="value">{recipe.volume}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Dificultad:</span>
                        <span className="value">{recipe.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  <div className="recipe-footer">
                    <button className="btn-secondary">
                      <i className="fas fa-plus"></i> Usar Receta
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Recipes Tab */}
        {activeTab === 'saved' && (
          <div className="saved-content">
            <div className="saved-header">
              <h2><i className="fas fa-save"></i> Mis Recetas Guardadas</h2>
              <button className="btn-primary" onClick={() => alert('Crear nueva receta')}>
                <i className="fas fa-plus"></i> Nueva Receta
              </button>
            </div>

            <div className="empty-state">
              <i className="fas fa-book"></i>
              <h3>No tienes recetas guardadas</h3>
              <p>¡Crea tu primera receta usando la calculadora!</p>
              <button className="btn-primary" onClick={() => alert('Ir a calculadora')}>
                <i className="fas fa-calculator"></i> Crear Receta
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BrewingDashboard;