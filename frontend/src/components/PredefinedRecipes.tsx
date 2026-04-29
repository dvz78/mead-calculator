import React from 'react';
import './PredefinedRecipes.css';

interface PredefinedRecipe {
  id: number;
  nombre: string;
  tipo: 'hidromiel' | 'vino';
  og: number;
  volumen: number;
  abv: number;
  dificultad: string;
  descripcion: string;
}

interface PredefinedRecipesProps {
  onSelectRecipe: (recipe: PredefinedRecipe) => void;
}

const PredefinedRecipes: React.FC<PredefinedRecipesProps> = ({ onSelectRecipe }) => {
  const predefinedHoneyRecipes: PredefinedRecipe[] = [
    {
      id: 1,
      nombre: 'Hidromiel Tradicional',
      tipo: 'hidromiel',
      og: 1.100,
      volumen: 10,
      abv: 13.5,
      dificultad: 'Fácil',
      descripcion: 'Un clásico equilibrado y suave'
    },
    {
      id: 2,
      nombre: 'Hidromiel Seco',
      tipo: 'hidromiel',
      og: 1.080,
      volumen: 10,
      abv: 10.5,
      dificultad: 'Fácil',
      descripcion: 'Bajo en azúcar residual, perfecto para degustar'
    },
    {
      id: 3,
      nombre: 'Hidromiel Fuerte',
      tipo: 'hidromiel',
      og: 1.130,
      volumen: 10,
      abv: 17.5,
      dificultad: 'Intermedia',
      descripcion: 'Alto contenido alcohólico, intenso y complejo'
    },
    {
      id: 4,
      nombre: 'Hidromiel Aromático',
      tipo: 'hidromiel',
      og: 1.110,
      volumen: 10,
      abv: 14.5,
      dificultad: 'Avanzada',
      descripcion: 'Con especias y hierbas para un perfil complejo'
    }
  ];

  const predefinedWineRecipes: PredefinedRecipe[] = [
    {
      id: 5,
      nombre: 'Vino Tinto Clásico',
      tipo: 'vino',
      og: 1.090,
      volumen: 10,
      abv: 13.0,
      dificultad: 'Intermedia',
      descripcion: 'Vino tinto robusto con cuerpo y taninos'
    },
    {
      id: 6,
      nombre: 'Vino Blanco Seco',
      tipo: 'vino',
      og: 1.085,
      volumen: 10,
      abv: 12.0,
      dificultad: 'Fácil',
      descripcion: 'Vino blanco limpio y refrescante'
    },
    {
      id: 7,
      nombre: 'Vino Rosado',
      tipo: 'vino',
      og: 1.095,
      volumen: 10,
      abv: 12.5,
      dificultad: 'Fácil',
      descripcion: 'Vino rosado frutal y afrutado'
    },
    {
      id: 8,
      nombre: 'Vino Espumoso',
      tipo: 'vino',
      og: 1.110,
      volumen: 10,
      abv: 11.5,
      dificultad: 'Avanzada',
      descripcion: 'Vino con burbujas naturales y elegante'
    }
  ];

  return (
    <div className="predefined-recipes">
      <div className="recipes-section">
        <div className="section-header">
          <h3><i className="fas fa-beer"></i> Recetas Predefinidas de Hidromiel</h3>
        </div>
        <div className="recipes-grid">
          {predefinedHoneyRecipes.map(recipe => (
            <div 
              key={recipe.id} 
              className="recipe-card"
              onClick={() => onSelectRecipe(recipe)}
            >
              <div className="recipe-icon bg-honey">
                <i className="fas fa-beer"></i>
              </div>
              <div className="recipe-content">
                <h4>{recipe.nombre}</h4>
                <p className="recipe-description">{recipe.descripcion}</p>
                <div className="recipe-meta">
                  <span className="recipe-param">
                    <i className="fas fa-tint"></i> {recipe.volumen}L
                  </span>
                  <span className="recipe-param">
                    <i className="fas fa-chart-line"></i> OG: {recipe.og.toFixed(3)}
                  </span>
                  <span className="recipe-param">
                    <i className="fas fa-percent"></i> ABV: {recipe.abv}%
                  </span>
                </div>
                <div className="recipe-footer">
                  <span className={`difficulty-badge ${recipe.dificultad.toLowerCase()}`}>
                    {recipe.dificultad}
                  </span>
                  <button className="btn-use">
                    <i className="fas fa-plus"></i> Usar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recipes-section">
        <div className="section-header">
          <h3><i className="fas fa-wine-glass-alt"></i> Recetas Predefinidas de Vino</h3>
        </div>
        <div className="recipes-grid">
          {predefinedWineRecipes.map(recipe => (
            <div 
              key={recipe.id} 
              className="recipe-card"
              onClick={() => onSelectRecipe(recipe)}
            >
              <div className="recipe-icon bg-wine">
                <i className="fas fa-wine-glass-alt"></i>
              </div>
              <div className="recipe-content">
                <h4>{recipe.nombre}</h4>
                <p className="recipe-description">{recipe.descripcion}</p>
                <div className="recipe-meta">
                  <span className="recipe-param">
                    <i className="fas fa-tint"></i> {recipe.volumen}L
                  </span>
                  <span className="recipe-param">
                    <i className="fas fa-chart-line"></i> OG: {recipe.og.toFixed(3)}
                  </span>
                  <span className="recipe-param">
                    <i className="fas fa-percent"></i> ABV: {recipe.abv}%
                  </span>
                </div>
                <div className="recipe-footer">
                  <span className={`difficulty-badge ${recipe.dificultad.toLowerCase()}`}>
                    {recipe.dificultad}
                  </span>
                  <button className="btn-use">
                    <i className="fas fa-plus"></i> Usar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredefinedRecipes;