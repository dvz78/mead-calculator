import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Recipe } from '../types/recipe';
import { getRecipes } from '../services/api';
import { ErrorMessage } from './common/ErrorMessage';
import { useDebounce } from '../hooks/useDebounce';
import './RecipeSearch.css';

interface RecipeSearchProps {
    onRecipeSelect?: (recipe: Recipe) => void;
}

export const RecipeSearch: React.FC<RecipeSearchProps> = ({ onRecipeSelect }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [tipoMiel, setTipoMiel] = useState('');
    const [orderBy, setOrderBy] = useState('-created_at');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [totalRecipes, setTotalRecipes] = useState(0);
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getRecipes({
                    page,
                    search: debouncedSearch,
                    tipo_miel: tipoMiel || undefined,
                    orderBy
                });
                setRecipes(response.results);
                setTotalRecipes(response.count);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [page, debouncedSearch, tipoMiel, orderBy]);

    const handleRecipeClick = (recipe: Recipe) => {
        if (onRecipeSelect) {
            onRecipeSelect(recipe);
        } else {
            navigate(`/recipes/${recipe.id}`);
        }
    };

    return (
        <div className="recipe-search">
            <div className="search-controls">
                <input
                    type="text"
                    placeholder="Buscar recetas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                
                <select
                    value={tipoMiel}
                    onChange={(e) => setTipoMiel(e.target.value)}
                    className="filter-select"
                >
                    <option value="">Todos los tipos de miel</option>
                    <option value="multifloral">Multifloral</option>
                    <option value="eucalipto">Eucalipto</option>
                    <option value="acacia">Acacia</option>
                    <option value="naranjo">Naranjo</option>
                    <option value="castaño">Castaño</option>
                    <option value="romero">Romero</option>
                    <option value="otros">Otros</option>
                </select>

                <select
                    value={orderBy}
                    onChange={(e) => setOrderBy(e.target.value)}
                    className="sort-select"
                >
                    <option value="-created_at">Más recientes primero</option>
                    <option value="created_at">Más antiguos primero</option>
                    <option value="nombre">Nombre (A-Z)</option>
                    <option value="-nombre">Nombre (Z-A)</option>
                    <option value="-og">Mayor densidad inicial</option>
                    <option value="og">Menor densidad inicial</option>
                </select>
            </div>

            {error && <ErrorMessage error={error} />}

            {loading ? (
                <div className="loading">Cargando recetas...</div>
            ) : (
                <>
                    <div className="recipes-grid">
                        {recipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="recipe-card"
                                onClick={() => handleRecipeClick(recipe)}
                            >
                                <h3>{recipe.nombre}</h3>
                                <div className="recipe-details">
                                    <p>Tipo de miel: {recipe.tipo_miel}</p>
                                    <p>Volumen: {recipe.volumen}L</p>
                                    <p>Densidad inicial: {recipe.og}</p>
                                    <p>Creada: {new Date(recipe.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalRecipes > 10 && (
                        <div className="pagination">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Anterior
                            </button>
                            <span>Página {page} de {Math.ceil(totalRecipes / 10)}</span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= Math.ceil(totalRecipes / 10)}
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};