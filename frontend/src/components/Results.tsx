import React from 'react';
import './Results.css';

// Define la estructura de los datos que el componente de resultados espera
interface CalculationResults {
  ingredientePrincipal: number;
  agua: number;
  fg: number;
  abv: number;
  dulzura: string;
  nutrientes: number;
  clarificante: number;
  acidez: number;
  tanino: number;
  volumenFinal: number;
  tiempoFermentacion: number;
}

interface ResultsProps {
    results: CalculationResults;
}

const Results: React.FC<ResultsProps> = ({ results }) => {
    return (
        <div className="results-panel">
            <div className="panel-header">
                <h2><i className="fas fa-clipboard-list"></i> Resultados de la Receta</h2>
            </div>
            <div className="results-grid">
                <div className="result-card">
                    <h3><i className="fas fa-weight"></i> Ingredientes Principales</h3>
                    <div className="ingredient-item">
                        <span className="ingredient-name">Ingrediente Principal:</span>
                        <span className="ingredient-amount">{results.ingredientePrincipal.toFixed(2)} kg</span>
                    </div>
                    <div className="ingredient-item">
                        <span className="ingredient-name">Agua:</span>
                        <span className="ingredient-amount">{results.agua.toFixed(2)} litros</span>
                    </div>
                </div>

                <div className="result-card">
                    <h3><i className="fas fa-beer"></i> Perfil de la Bebida</h3>
                    <div className="profile-item">
                        <span className="profile-label">Densidad Final (DF):</span>
                        <span className="profile-value">{results.fg.toFixed(3)}</span>
                    </div>
                    <div className="profile-item">
                        <span className="profile-label">Contenido Alcohólico (ABV):</span>
                        <span className="profile-value">{results.abv.toFixed(2)}%</span>
                    </div>
                    <div className="profile-item">
                        <span className="profile-label">Nivel de Dulzura:</span>
                        <span className="profile-value">{results.dulzura}</span>
                    </div>
                    <div className="profile-item">
                        <span className="profile-label">Tiempo de Fermentación Estimado:</span>
                        <span className="profile-value">{results.tiempoFermentacion} semanas</span>
                    </div>
                </div>
                
                <div className="result-card">
                    <h3><i className="fas fa-mortar-pestle"></i> Aditivos</h3>
                    <div className="ingredient-item">
                        <span className="ingredient-name">Nutrientes para Levadura:</span>
                        <span className="ingredient-amount">{results.nutrientes > 0 ? results.nutrientes.toFixed(2) + ' g' : 'No'}</span>
                    </div>
                    <div className="ingredient-item">
                        <span className="ingredient-name">Clarificante:</span>
                        <span className="ingredient-amount">{results.clarificante > 0 ? results.clarificante.toFixed(2) + ' g' : 'No'}</span>
                    </div>
                    <div className="ingredient-item">
                        <span className="ingredient-name">Ajuste de Acidez:</span>
                        <span className="ingredient-amount">{results.acidez > 0 ? results.acidez.toFixed(2) + ' g' : 'No necesario'}</span>
                    </div>
                    <div className="ingredient-item">
                        <span className="ingredient-name">Ajuste de Tanino:</span>
                        <span className="ingredient-amount">{results.tanino > 0 ? results.tanino.toFixed(2) + ' g' : 'No necesario'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Results;
