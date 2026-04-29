import React, { useState, useEffect } from 'react';
import './WineCalculator.css';
import { saveRecipe, updateRecipe, type Recipe } from '../utils/api';

export interface WineFormData {
  nombre: string;
  volumen: number;
  tipo_uva: string;
  azucar: number;
  levadura: string;
  eficiencia: number;
  nutrientes: string;
  tipo_nutrientes: string;
  clarificante: string;
  tipo_clarificante: string;
  temperatura: number;
  duracion: number;
  ph: number;
}

interface CalculationResults {
  uva: number;
  azucar_adicional: number;
  agua: number;
  fg: number;
  abv: number;
  dulzura: string;
  nutrientes: number;
  clarificante: number;
}

const WineCalculator: React.FC = () => {
  const [formData, setFormData] = useState<WineFormData>({
    nombre: 'Mi Vino Especial',
    volumen: 10,
    tipo_uva: 'cabernet',
    azucar: 20,
    levadura: 'rc212',
    eficiencia: 75,
    nutrientes: 'si',
    tipo_nutrientes: 'dap',
    clarificante: 'no',
    tipo_clarificante: 'bentonita',
    temperatura: 20,
    duracion: 30,
    ph: 3.6
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Load recipe from localStorage if editing
  useEffect(() => {
    const recipeJson = localStorage.getItem('recipeToEdit');
    if (recipeJson) {
      try {
        const recipe: Recipe = JSON.parse(recipeJson);
        setFormData({
          nombre: recipe.nombre,
          volumen: recipe.volumen,
          tipo_uva: recipe.tipo_miel || 'cabernet',
          azucar: (recipe.og - 1) * 235 || 20, // Estimate sugar from OG
          levadura: recipe.levadura,
          eficiencia: recipe.eficiencia,
          nutrientes: recipe.nutrientes,
          tipo_nutrientes: recipe.tipo_nutrientes,
          clarificante: recipe.clarificante,
          tipo_clarificante: recipe.tipo_clarificante,
          temperatura: recipe.temperatura,
          duracion: recipe.duracion,
          ph: recipe.ph || 3.6
        });
        setEditingId(recipe.id || null);
        localStorage.removeItem('recipeToEdit');
      } catch (e) {
        console.error('Error loading recipe to edit:', e);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'volumen' || name === 'azucar' || name === 'eficiencia' || 
              name === 'temperatura' || name === 'duracion' || name === 'ph' ? 
              parseFloat(value) : value
    }));
  };

  const calculateResults = (): CalculationResults => {
    const volumen = formData.volumen;
    const azucar = formData.azucar;
    const eficiencia = formData.eficiencia / 100;

    // Calcular uva requerida (aproximación)
    const uva = volumen * 1.5; // 1.5 kg de uva por litro de vino

    // Calcular azúcar adicional
    const azucar_adicional = (azucar * volumen) / 1000; // Convertir g/L a kg

    // Calcular agua
    const agua_en_uva = uva * 0.8; // 80% de agua en uva
    const agua = volumen - agua_en_uva;

    // Calcular perfil
    const og = 1.000 + (azucar * 0.00426); // Aproximación básica
    const fg = 1.000 + (og - 1.000) * (1 - eficiencia);
    const abv = (og - fg) * 131.25;

    // Determinar dulzura
    const residual = (fg - 1.000) * 1000;
    let dulzura = "Seco";
    if (residual >= 5) dulzura = "Semi-seco";
    if (residual >= 15) dulzura = "Medio";
    if (residual >= 30) dulzura = "Semi-dulce";
    if (residual >= 50) dulzura = "Dulce";

    // Calcular nutrientes
    const nutrientes = formData.nutrientes === 'si' ? volumen * 0.5 : 0;

    // Calcular clarificante
    const clarificante = formData.clarificante === 'si' ? volumen * 1 : 0;

    return {
      uva,
      azucar_adicional,
      agua,
      fg,
      abv,
      dulzura,
      nutrientes,
      clarificante
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedResults = calculateResults();
    setResults(calculatedResults);
    setShowResults(true);
  };

  const handleSaveRecipe = async () => {
    try {
      const recipeData = {
        nombre: formData.nombre,
        volumen: formData.volumen,
        og: 1.000 + (formData.azucar * 0.00426), // Convert sugar to OG approximation
        tipo_miel: formData.tipo_uva,
        levadura: formData.levadura,
        eficiencia: formData.eficiencia,
        especias: '',
        frutas: 'uva',
        cantidad_frutas: formData.volumen * 1.5 // Uva in kg
        bloqueador: 'no',
        tipo_bloqueador: 'sorbato',
        nutrientes: formData.nutrientes,
        tipo_nutrientes: formData.tipo_nutrientes,
        clarificante: formData.clarificante,
        tipo_clarificante: formData.tipo_clarificante,
        temperatura: formData.temperatura,
        duracion: formData.duracion,
        ph: formData.ph
      };
      
      if (editingId) {
        await updateRecipe(editingId, recipeData);
        alert('Receta actualizada exitosamente!');
      } else {
        await saveRecipe(recipeData);
        alert('Receta guardada exitosamente!');
      }
      setEditingId(null);
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Error al guardar la receta');
    }
  };

  const handleReset = () => {
    setFormData({
      nombre: 'Mi Vino Especial',
      volumen: 10,
      tipo_uva: 'cabernet',
      azucar: 20,
      levadura: 'rc212',
      eficiencia: 75,
      nutrientes: 'si',
      tipo_nutrientes: 'dap',
      clarificante: 'no',
      tipo_clarificante: 'bentonita',
      temperatura: 20,
      duracion: 30,
      ph: 3.6
    });
    setResults(null);
    setShowResults(false);
  };

  return (
    <div className="wine-calculator">
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div className="calculator-header">
          <h2><i className="fas fa-wine-glass-alt"></i> Calculadora de Vino</h2>
          <p>Completa los parámetros para calcular tu receta de vino</p>
        </div>

        <div className="form-section">
          <h3><i className="fas fa-list"></i> Información Básica</h3>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="nombre">Nombre de la Receta</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="volumen">Volumen Final (litros)</label>
              <input
                type="number"
                id="volumen"
                name="volumen"
                value={formData.volumen}
                onChange={handleInputChange}
                min="1"
                step="0.5"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="tipo_uva">Tipo de Uva</label>
              <select
                id="tipo_uva"
                name="tipo_uva"
                value={formData.tipo_uva}
                onChange={handleInputChange}
                required
              >
                <option value="cabernet">Cabernet Sauvignon</option>
                <option value="merlot">Merlot</option>
                <option value="malbec">Malbec</option>
                <option value="syrah">Syrah</option>
                <option value="tempranillo">Tempranillo</option>
                <option value="pinot">Pinot Noir</option>
                <option value="chardonnay">Chardonnay</option>
                <option value="sauvignon">Sauvignon Blanc</option>
                <option value="riesling">Riesling</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3><i className="fas fa-cubes"></i> Ingredientes</h3>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="azucar">Azúcar Adicional (g/L)</label>
              <input
                type="number"
                id="azucar"
                name="azucar"
                value={formData.azucar}
                onChange={handleInputChange}
                min="0"
                max="50"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="levadura">Levadura</label>
              <select
                id="levadura"
                name="levadura"
                value={formData.levadura}
                onChange={handleInputChange}
                required
              >
                <option value="v71b">V71/B - Lavanda, afrutada</option>
                <option value="d47">D47 - Limpia, neutra</option>
                <option value="d80">D80 - Compleja, afrutada</option>
                <option value="k1v1116">K1V-1116 - Alta fermentación</option>
                <option value="rc212">RC212 - Borgoña, rica</option>
                <option value="71b4">71B-4 - Baja fermentación, dulce</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="eficiencia">Eficiencia de Fermentación (%)</label>
              <input
                type="number"
                id="eficiencia"
                name="eficiencia"
                value={formData.eficiencia}
                onChange={handleInputChange}
                min="60"
                max="90"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3><i className="fas fa-cog"></i> Parámetros Avanzados</h3>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="nutrientes">Nutrientes para Levaduras</label>
              <select
                id="nutrientes"
                name="nutrientes"
                value={formData.nutrientes}
                onChange={handleInputChange}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="tipo_nutrientes">Tipo de Nutrientes</label>
              <select
                id="tipo_nutrientes"
                name="tipo_nutrientes"
                value={formData.tipo_nutrientes}
                onChange={handleInputChange}
                disabled={formData.nutrientes === 'no'}
              >
                <option value="dap">DAP</option>
                <option value="fermaidk">Fermaid K</option>
                <option value="goferit">GoFerm IT</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="clarificante">Clarificante</label>
              <select
                id="clarificante"
                name="clarificante"
                value={formData.clarificante}
                onChange={handleInputChange}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="tipo_clarificante">Tipo de Clarificante</label>
              <select
                id="tipo_clarificante"
                name="tipo_clarificante"
                value={formData.tipo_clarificante}
                onChange={handleInputChange}
                disabled={formData.clarificante === 'no'}
              >
                <option value="bentonita">Bentonita</option>
                <option value="gelatina">Gelatina</option>
                <option value="silica">Sílice</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="temperatura">Temperatura de Fermentación (°C)</label>
              <input
                type="number"
                id="temperatura"
                name="temperatura"
                value={formData.temperatura}
                onChange={handleInputChange}
                min="15"
                max="30"
              />
            </div>
            <div className="input-group">
              <label htmlFor="ph">pH Inicial</label>
              <input
                type="number"
                id="ph"
                name="ph"
                value={formData.ph}
                onChange={handleInputChange}
                min="3.0"
                max="4.0"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            <i className="fas fa-calculator"></i> Calcular Receta
          </button>
          <button type="reset" className="btn-secondary">
            <i className="fas fa-broom"></i> Limpiar
          </button>
        </div>
      </form>

      {showResults && results && (
        <div className="results-section">
          <div className="results-header">
            <h3><i className="fas fa-clipboard-list"></i> Resultados de la Receta</h3>
            <button onClick={handleSaveRecipe} className="btn-success">
              <i className="fas fa-save"></i> Guardar Receta
            </button>
          </div>

          <div className="results-grid">
            <div className="result-card">
              <h4><i className="fas fa-grapes"></i> Ingredientes Principales</h4>
              <div className="result-item">
                <span className="label">Uva:</span>
                <span className="value">{results.uva.toFixed(2)} kg</span>
              </div>
              <div className="result-item">
                <span className="label">Azúcar Adicional:</span>
                <span className="value">{results.azucar_adicional.toFixed(2)} kg</span>
              </div>
              <div className="result-item">
                <span className="label">Agua:</span>
                <span className="value">{results.agua.toFixed(2)} litros</span>
              </div>
            </div>

            <div className="result-card">
              <h4><i className="fas fa-wine-glass-alt"></i> Perfil del Vino</h4>
              <div className="result-item">
                <span className="label">Gravedad Final (FG):</span>
                <span className="value">{results.fg.toFixed(3)}</span>
              </div>
              <div className="result-item">
                <span className="label">Contenido Alcohólico (ABV):</span>
                <span className="value">{results.abv.toFixed(2)}%</span>
              </div>
              <div className="result-item">
                <span className="label">Nivel de Dulzura:</span>
                <span className="value">{results.dulzura}</span>
              </div>
            </div>

            <div className="result-card">
              <h4><i className="fas fa-mortar-pestle"></i> Aditivos</h4>
              <div className="result-item">
                <span className="label">Nutrientes para Levadura:</span>
                <span className="value">
                  {results.nutrientes > 0 ? results.nutrientes.toFixed(2) + ' g' : 'No'}
                </span>
              </div>
              <div className="result-item">
                <span className="label">Clarificante:</span>
                <span className="value">
                  {results.clarificante > 0 ? results.clarificante.toFixed(2) + ' g' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WineCalculator;