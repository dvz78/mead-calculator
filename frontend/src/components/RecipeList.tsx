import React, { useState, useEffect } from 'react';
import './RecipeList.css';
import { getRecipes, type Recipe } from '../utils/api';

interface RecipeListProps {
  onEditRecipe?: (recipe: Recipe) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ onEditRecipe }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchRecipes();
    } else {
      setError('No se encontró el token de autenticación. Por favor, inicie sesión.');
      setLoading(false);
    }
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug: Check if token exists
      const token = localStorage.getItem('authToken');
      console.log('Token in localStorage:', token ? `${token.substring(0, 20)}...` : 'None');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const data = await getRecipes();
      setRecipes(data as unknown as Recipe[]); // Type assertion to match our interface
    } catch (err: any) {
      console.error('Error fetching recipes:', err);
      setError('Error al cargar las recetas: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta receta?')) {
      try {
        // In a real app, we would call deleteRecipe API
        // For now, we'll just filter it from the local state
        setRecipes(recipes.filter(recipe => recipe.id !== id));
        if (selectedRecipe?.id === id) {
          setSelectedRecipe(null);
        }
        alert('Receta eliminada exitosamente');
      } catch (err: any) {
        console.error('Error deleting recipe:', err);
        alert('Error al eliminar la receta: ' + (err.message || ''));
      }
    }
  };

  const handleLoadRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    alert(`Cargando receta: ${recipe.nombre}`);
  };

  if (loading) {
    return (
      <div className="recipe-list">
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando recetas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-list">
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Error</h3>
          <p>{error}</p>
          <div style={{display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px'}}>
            <button onClick={fetchRecipes} className="btn-primary">
              <i className="fas fa-redo"></i> Reintentar
            </button>
            <button onClick={() => {
              localStorage.removeItem('authToken');
              window.location.reload();
            }} className="btn-secondary">
              <i className="fas fa-sign-in-alt"></i> Ir a Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      <div className="list-header">
        <h2><i className="fas fa-book"></i> Mis Recetas Guardadas</h2>
        <div className="header-actions">
          <span className="recipe-count">{recipes.length} recetas</span>
          <button onClick={fetchRecipes} className="btn-secondary">
            <i className="fas fa-sync"></i> Actualizar
          </button>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-wine-bottle"></i>
          <h3>No tienes recetas guardadas</h3>
          <p>¡Crea tu primera receta usando la calculadora!</p>
          <button 
            className="btn-primary" 
            onClick={() => window.location.href = '/'}
          >
            <i className="fas fa-calculator"></i> Ir a Calculadora
          </button>
        </div>
      ) : (
        <>
          <div className="recipes-grid">
            {recipes.map(recipe => (
              <div key={recipe.id} className="recipe-card">
                <div className="recipe-header">
                  <div className={`recipe-icon ${recipe.frutas ? 'wine' : 'mead'}`}>
                    <i className={`fas ${recipe.frutas ? 'fa-wine-glass-alt' : 'fa-beer'}`}></i>
                  </div>
                  <div className="recipe-title">
                    <h3>{recipe.nombre}</h3>
                    <span className="recipe-type">
                      {recipe.frutas ? 'Vino' : 'Hidromiel'}
                    </span>
                  </div>
                  <div className="recipe-actions">
                    <button 
                      className="icon-button" 
                      onClick={() => handleLoadRecipe(recipe)}
                      title="Cargar receta"
                    >
                      <i className="fas fa-play"></i>
                    </button>
                    <button 
                      className="icon-button danger" 
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      title="Eliminar receta"
                    >
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
                    <span className="label">ABV:</span>
                    <span className="value">{((recipe.og - 1) * 131.25 * (recipe.eficiencia / 100)).toFixed(1)}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Levadura:</span>
                    <span className="value">{recipe.levadura}</span>
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

          {selectedRecipe && (
            <div className="recipe-preview">
              <div className="preview-header">
                <h3><i className="fas fa-eye"></i> Vista Previa: {selectedRecipe.nombre}</h3>
                <button 
                  className="close-button" 
                  onClick={() => setSelectedRecipe(null)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="preview-content">
                <div className="preview-section">
                  <h4><i className="fas fa-info-circle"></i> Información General</h4>
                  <div className="preview-grid">
                    <div className="preview-item">
                      <span className="label">Tipo:</span>
                      <span className="value">{selectedRecipe.frutas ? 'Vino' : 'Hidromiel'}</span>
                    </div>
                    <div className="preview-item">
                      <span className="label">Volumen:</span>
                      <span className="value">{selectedRecipe.volumen}L</span>
                    </div>
                    <div className="preview-item">
                      <span className="label">Densidad Inicial:</span>
                      <span className="value">{selectedRecipe.og.toFixed(3)}</span>
                    </div>
                    <div className="preview-item">
                      <span className="label">Eficiencia:</span>
                      <span className="value">{selectedRecipe.eficiencia}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="preview-section">
                  <h4><i className="fas fa-flask"></i> Ingredientes</h4>
                  <div className="preview-grid">
                    <div className="preview-item">
                      <span className="label">Levadura:</span>
                      <span className="value">{selectedRecipe.levadura}</span>
                    </div>
                    <div className="preview-item">
                      <span className="label">Nutrientes:</span>
                      <span className="value">{selectedRecipe.nutrientes === 'si' ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="preview-item">
                      <span className="label">Clarificante:</span>
                      <span className="value">{selectedRecipe.clarificante === 'si' ? 'Sí' : 'No'}</span>
                    </div>
                    {selectedRecipe.frutas && (
                      <div className="preview-item">
                        <span className="label">Frutas:</span>
                        <span className="value">{selectedRecipe.frutas} ({selectedRecipe.cantidad_frutas}kg)</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="preview-section">
                  <h4><i className="fas fa-cog"></i> Parámetros</h4>
                  <div className="preview-grid">
                    <div className="preview-item">
                      <span className="label">Temperatura:</span>
                      <span className="value">{selectedRecipe.temperatura}°C</span>
                    </div>
                    <div className="preview-item">
                      <span className="label">pH:</span>
                      <span className="value">{selectedRecipe.ph || 'N/A'}</span>
                    </div>
                    <div className="preview-item">
                      <span className="label">Duración:</span>
                      <span className="value">{selectedRecipe.duracion} días</span>
                    </div>
                  </div>
                </div>
                
                 <div className="preview-actions">
                  <button className="btn-primary" onClick={() => {
                    if (selectedRecipe && onEditRecipe) {
                      onEditRecipe(selectedRecipe);
                    }
                  }}>
                    <i className="fas fa-edit"></i> Editar Receta
                  </button>
                  <button className="btn-secondary" onClick={() => {
                    if (selectedRecipe) {
                      const printContent = `
                        <html>
                          <head><title>${selectedRecipe.nombre}</title>
                          <style>body { font-family: Arial; padding: 20px; } h1 { color: #8B6914; } p { margin: 8px 0; }</style>
                          </head>
                          <body>
                            <h1>${selectedRecipe.nombre}</h1>
                            <p><strong>Tipo:</strong> ${selectedRecipe.frutas ? 'Vino' : 'Hidromiel'}</p>
                            <p><strong>Volumen:</strong> ${selectedRecipe.volumen}L</p>
                            <p><strong>Densidad Inicial:</strong> ${selectedRecipe.og.toFixed(3)}</p>
                            <p><strong>Eficiencia:</strong> ${selectedRecipe.eficiencia}%</p>
                            <p><strong>Levadura:</strong> ${selectedRecipe.levadura}</p>
                            <p><strong>ABV Estimado:</strong> ${((selectedRecipe.og - 1) * 131.25 * (selectedRecipe.eficiencia / 100)).toFixed(1)}%</p>
                            <p><strong>Temperatura:</strong> ${selectedRecipe.temperatura}°C</p>
                            <p><strong>Duración:</strong> ${selectedRecipe.duracion} días</p>
                            ${selectedRecipe.frutas ? `<p><strong>Frutas:</strong> ${selectedRecipe.frutas} (${selectedRecipe.cantidad_frutas}kg)</p>` : ''}
                            <p><strong>Nutrientes:</strong> ${selectedRecipe.nutrientes === 'si' ? 'Sí' : 'No'}</p>
                            <p><strong>Clarificante:</strong> ${selectedRecipe.clarificante === 'si' ? 'Sí' : 'No'}</p>
                            <p><strong>pH:</strong> ${selectedRecipe.ph || 'N/A'}</p>
                          </body>
                        </html>
                      `;
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(printContent);
                        printWindow.document.close();
                        setTimeout(() => {
                          printWindow.print();
                        }, 250);
                      }
                    }
                  }}>
                    <i className="fas fa-print"></i> Imprimir
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecipeList;