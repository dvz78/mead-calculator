import { useState, lazy, Suspense, useCallback } from 'react';
import './App.css';
import Auth from './components/Auth';
import type { Recipe } from './utils/api';

// Lazy load components
const LazyMeadCalculator = lazy(() => import('./components/MeadCalculator'));
const LazyWineCalculator = lazy(() => import('./components/WineCalculator'));
const LazyRecipeList = lazy(() => import('./components/RecipeList'));

function App() {
  const [currentView, setCurrentView] = useState<'mead' | 'wine' | 'recipes'>('mead');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setCurrentView('mead');
    setRecipeToEdit(null);
  };

  const handleEditRecipe = useCallback((recipe: Recipe) => {
    // Save recipe to localStorage for the calculator to pick up
    localStorage.setItem('recipeToEdit', JSON.stringify(recipe));
    setRecipeToEdit(recipe);
    // Determine if it's wine or mead based on frutas field
    if (recipe.frutas) {
      setCurrentView('wine');
    } else {
      setCurrentView('mead');
    }
  }, []);

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="main-app">
      <header className="app-header">
        <div className="header-content">
          <h1><i className="fas fa-wine-bottle"></i> BrewMaster Pro</h1>
          <p>Calculadora Profesional de Fermentaciones</p>
        </div>
        <div className="header-actions">
          <div className="user-menu">
            <button className="user-button">
              <i className="fas fa-user"></i>
              <span>Usuario</span>
            </button>
            <div className="dropdown-menu">
              <button onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="main-nav">
        <button 
          className={currentView === 'mead' ? 'nav-button active' : 'nav-button'}
          onClick={() => setCurrentView('mead')}
        >
          <i className="fas fa-beer"></i>
          <span>Hidromiel</span>
        </button>
        <button 
          className={currentView === 'wine' ? 'nav-button active' : 'nav-button'}
          onClick={() => setCurrentView('wine')}
        >
          <i className="fas fa-wine-glass-alt"></i>
          <span>Vino</span>
        </button>
        <button 
          className={currentView === 'recipes' ? 'nav-button active' : 'nav-button'}
          onClick={() => setCurrentView('recipes')}
        >
          <i className="fas fa-book"></i>
          <span>Mis Recetas</span>
        </button>
      </nav>

      <main className="app-main">
        <Suspense fallback={<div>Cargando...</div>}>
          {currentView === 'mead' && <LazyMeadCalculator key={recipeToEdit?.id || 'new'} />}
          {currentView === 'wine' && <LazyWineCalculator key={recipeToEdit?.id || 'new'} />}
          {currentView === 'recipes' && <LazyRecipeList onEditRecipe={handleEditRecipe} />}
        </Suspense>
      </main>
    </div>
  );
}

export default App;