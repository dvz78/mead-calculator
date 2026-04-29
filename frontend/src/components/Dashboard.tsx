import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useAuth } from '../context/AuthContext';
import { getRecipes } from '../utils/api';

interface Recipe {
  id: number;
  nombre: string;
  volumen: number;
  og: number;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'recipes' | 'steps'>('overview');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await getRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const predefinedRecipes = [
    {
      id: 1,
      name: 'Hidromiel Tradicional',
      og: 1.100,
      volume: 10,
      description: 'Un clásico equilibrado',
      difficulty: 'Fácil',
      type: 'hidromiel'
    },
    {
      id: 2,
      name: 'Hidromiel Seco',
      og: 1.080,
      volume: 10,
      description: 'Bajo en azúcar residual',
      difficulty: 'Fácil',
      type: 'hidromiel'
    },
    {
      id: 3,
      name: 'Hidromiel Fuerte',
      og: 1.130,
      volume: 10,
      description: 'Alto contenido alcohólico',
      difficulty: 'Intermedia',
      type: 'hidromiel'
    },
    {
      id: 4,
      name: 'Vino Tinto Clásico',
      og: 1.090,
      volume: 10,
      description: 'Vino tinto robusto',
      difficulty: 'Intermedia',
      type: 'vino'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <div className="user-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="user-details">
            <h2>Bienvenido, {user?.username}</h2>
            <p>Miembro desde hace {Math.floor(Math.random() * 12) + 1} meses</p>
          </div>
        </div>
        
        <div className="dashboard-nav">
          <button 
            className={activeSection === 'overview' ? 'nav-button active' : 'nav-button'}
            onClick={() => setActiveSection('overview')}
          >
            <i className="fas fa-home"></i>
            <span>Inicio</span>
          </button>
          <button 
            className={activeSection === 'recipes' ? 'nav-button active' : 'nav-button'}
            onClick={() => setActiveSection('recipes')}
          >
            <i className="fas fa-book"></i>
            <span>Mis Recetas</span>
          </button>
          <button 
            className={activeSection === 'steps' ? 'nav-button active' : 'nav-button'}
            onClick={() => setActiveSection('steps')}
          >
            <i className="fas fa-list-ol"></i>
            <span>Guía de Pasos</span>
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeSection === 'overview' && (
          <div className="overview-section">
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-beer"></i>
                </div>
                <div className="stat-info">
                  <h3>{recipes.length}</h3>
                  <p>Recetas Guardadas</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-flask"></i>
                </div>
                <div className="stat-info">
                  <h3>{Math.floor(Math.random() * 5)}</h3>
                  <p>En Proceso</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <i className="fas fa-trophy"></i>
                </div>
                <div className="stat-info">
                  <h3>{Math.floor(Math.random() * 20)}</h3>
                  <p>Proyectos Completados</p>
                </div>
              </div>
            </div>

            <div className="section-title">
              <h3><i className="fas fa-fire"></i> Recetas Populares</h3>
            </div>
            
            <div className="recipes-grid">
              {predefinedRecipes.map(recipe => (
                <div key={recipe.id} className="recipe-card" onClick={() => alert(`Cargando ${recipe.name}`)}>
                  <div className="recipe-icon">
                    <i className={`fas ${recipe.type === 'hidromiel' ? 'fa-beer' : 'fa-wine-glass-alt'}`}></i>
                  </div>
                  <div className="recipe-content">
                    <h4>{recipe.name}</h4>
                    <p className="recipe-desc">{recipe.description}</p>
                    <div className="recipe-meta">
                      <span className="difficulty-badge">{recipe.difficulty}</span>
                      <span className="recipe-volume">{recipe.volume}L</span>
                    </div>
                    {recipe.type === 'hidromiel' ? (
                      <p className="recipe-param">OG: {recipe.og.toFixed(3)}</p>
                    ) : (
                      <p className="recipe-param">OG: {recipe.og.toFixed(3)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'recipes' && (
          <div className="recipes-section">
            <div className="section-header">
              <h3><i className="fas fa-book"></i> Mis Recetas Guardadas</h3>
              <button className="btn-primary">
                <i className="fas fa-plus"></i> Nueva Receta
              </button>
            </div>
            
            {loading ? (
              <div className="loading-state">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Cargando recetas...</p>
              </div>
            ) : recipes.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-wine-bottle"></i>
                <h4>No tienes recetas guardadas</h4>
                <p>¡Crea tu primera receta usando la calculadora!</p>
                <button className="btn-primary" onClick={() => alert('Ir a calculadora')}>
                  <i className="fas fa-calculator"></i> Crear Receta
                </button>
              </div>
            ) : (
              <div className="saved-recipes">
                {recipes.map(recipe => (
                  <div key={recipe.id} className="saved-recipe-card">
                    <div className="recipe-header">
                      <h4>{recipe.nombre}</h4>
                      <div className="recipe-actions">
                        <button className="icon-button" title="Ver">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="icon-button" title="Editar">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="icon-button danger" title="Eliminar">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <div className="recipe-details">
                      <div className="detail-item">
                        <span className="label">Volumen:</span>
                        <span className="value">{recipe.volumen}L</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Densidad:</span>
                        <span className="value">{recipe.og.toFixed(3)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Fecha:</span>
                        <span className="value">
                          {new Date(recipe.created_at).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === 'steps' && (
          <div className="steps-section">
            <div className="section-header">
              <h3><i className="fas fa-list-ol"></i> Guía de Elaboración</h3>
              <div className="steps-filter">
                <button className="filter-button active">Hidromiel</button>
                <button className="filter-button">Vino</button>
              </div>
            </div>
            
            <div className="steps-timeline">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Preparación del Mosto</h4>
                  <p>Calienta el agua y disuelve la miel gradualmente hasta obtener una mezcla homogénea.</p>
                  <div className="step-meta">
                    <span className="duration"><i className="fas fa-clock"></i> 30-45 min</span>
                    <span className="tips"><i className="fas fa-lightbulb"></i> No hiervas la miel</span>
                  </div>
                </div>
              </div>
              
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Ajuste de pH y Nutrientes</h4>
                  <p>Mide el pH y ajústalo a 4.0-4.5. Añade nutrientes para levaduras.</p>
                  <div className="step-meta">
                    <span className="duration"><i className="fas fa-clock"></i> 15 min</span>
                  </div>
                </div>
              </div>
              
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Enfriamiento</h4>
                  <p>Enfría el mosto a 20-24°C antes de añadir la levadura.</p>
                  <div className="step-meta">
                    <span className="duration"><i className="fas fa-clock"></i> 30-60 min</span>
                    <span className="tips"><i className="fas fa-temperature-low"></i> Usar mosto enfriador</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="steps-footer">
              <button className="btn-secondary">
                <i className="fas fa-download"></i> Descargar Guía Completa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;