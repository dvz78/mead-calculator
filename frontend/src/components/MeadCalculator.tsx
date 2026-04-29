import React, { useState, useEffect } from 'react';
import './MeadCalculator.css';
import { saveRecipe, updateRecipe, type Recipe } from '../utils/api';

interface FormData {
  nombre: string;
  volumen: number;
  og: number;
  tipo_miel: string;
  levadura: string;
  eficiencia: number;
  especias: string;
  frutas: string;
  cantidad_frutas: number;
  bloqueador: string;
  tipo_bloqueador: string;
  nutrientes: string;
  tipo_nutrientes: string;
  clarificante: string;
  tipo_clarificante: string;
  temperatura: number;
  duracion: number;
  ph: number;
}

interface CalculationResults {
  miel: number;
  agua: number;
  fg: number;
  abv: number;
  dulzura: string;
  nutrientes: number;
  clarificante: number;
}

const MeadCalculator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: 'Mi Hidromiel Especial',
    volumen: 10,
    og: 1.100,
    tipo_miel: 'multifloral',
    levadura: 'd47',
    eficiencia: 75,
    especias: '',
    frutas: '',
    cantidad_frutas: 0,
    bloqueador: 'no',
    tipo_bloqueador: 'sorbato',
    nutrientes: 'si',
    tipo_nutrientes: 'dap',
    clarificante: 'no',
    tipo_clarificante: 'bentonita',
    temperatura: 20,
    duracion: 30,
    ph: 4.0
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Load recipe from localStorage if editing
  useEffect(() => {
    const recipeJson = localStorage.getItem('recipeToEdit');
    if (recipeJson) {
      try {
        const recipe: Recipe = JSON.parse(recipeJson);
        setFormData({
          nombre: recipe.nombre,
          volumen: recipe.volumen,
          og: recipe.og,
          tipo_miel: recipe.tipo_miel,
          levadura: recipe.levadura,
          eficiencia: recipe.eficiencia,
          especias: recipe.especias || '',
          frutas: recipe.frutas || '',
          cantidad_frutas: recipe.cantidad_frutas,
          bloqueador: recipe.bloqueador,
          tipo_bloqueador: recipe.tipo_bloqueador,
          nutrientes: recipe.nutrientes,
          tipo_nutrientes: recipe.tipo_nutrientes,
          clarificante: recipe.clarificante,
          tipo_clarificante: recipe.tipo_clarificante,
          temperatura: recipe.temperatura,
          duracion: recipe.duracion,
          ph: recipe.ph || 4.0
        });
        setEditingId(recipe.id || null);
        localStorage.removeItem('recipeToEdit');
      } catch (e) {
        console.error('Error loading recipe to edit:', e);
      }
    }
  }, []);

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'volumen' || name === 'og' || name === 'eficiencia' || 
              name === 'cantidad_frutas' || name === 'temperatura' || 
              name === 'duracion' || name === 'ph' ? 
              parseFloat(value) : value
    }));
  };

  const calculateResults = (): CalculationResults => {
    const volumen = formData.volumen;
    const og = formData.og;
    const eficiencia = formData.eficiencia / 100;

    // Calcular miel requerida (aproximación)
    const puntosGravedad = (og - 1) * 1000;
    const librasPorGalon = puntosGravedad / 35; // 35 puntos por libra de miel
    const totalLibras = librasPorGalon * (volumen / 3.78541);
    const miel = totalLibras * 0.453592; // Convertir a kg

    // Calcular agua
    const densidadMiel = 1.42; // kg/L
    const volumenMiel = miel / densidadMiel;
    const agua = volumen - volumenMiel;

    // Calcular perfil
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
      miel,
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
        og: formData.og,
        tipo_miel: formData.tipo_miel,
        levadura: formData.levadura,
        eficiencia: formData.eficiencia,
        especias: formData.especias,
        frutas: formData.frutas,
        cantidad_frutas: formData.cantidad_frutas,
        bloqueador: formData.bloqueador,
        tipo_bloqueador: formData.tipo_bloqueador,
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
      nombre: 'Mi Hidromiel Especial',
      volumen: 10,
      og: 1.100,
      tipo_miel: 'multifloral',
      levadura: 'd47',
      eficiencia: 75,
      especias: '',
      frutas: '',
      cantidad_frutas: 0,
      bloqueador: 'no',
      tipo_bloqueador: 'sorbato',
      nutrientes: 'si',
      tipo_nutrientes: 'dap',
      clarificante: 'no',
      tipo_clarificante: 'bentonita',
      temperatura: 20,
      duracion: 30,
      ph: 4.0
    });
    setResults(null);
    setShowResults(false);
  };

  return (
    <div className="mead-calculator">
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div className="calculator-header">
          <h2><i className="fas fa-calculator"></i> Calculadora de Hidromiel</h2>
          <p>Completa los parámetros para calcular tu receta</p>
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
              <label htmlFor="og">Gravedad Específica Inicial (OG)</label>
              <select
                id="og"
                name="og"
                value={formData.og}
                onChange={handleInputChange}
                required
              >
                <option value={1.080}>1.080 - Suave</option>
                <option value={1.090}>1.090 - Medio-suave</option>
                <option value={1.100}>1.100 - Medio</option>
                <option value={1.110}>1.110 - Medio-fuerte</option>
                <option value={1.120}>1.120 - Fuerte</option>
                <option value={1.130}>1.130 - Muy fuerte</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3><i className="fas fa-flask"></i> Ingredientes</h3>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="tipo_miel">Tipo de Miel</label>
              <select
                id="tipo_miel"
                name="tipo_miel"
                value={formData.tipo_miel}
                onChange={handleInputChange}
                required
              >
                <option value="multifloral">Multifloral</option>
                <option value="acacia">Acacia</option>
                <option value="lavanda">Lavanda</option>
                <option value="eucalipto">Eucalipto</option>
                <option value="romero">Romero</option>
                <option value="manuka">Manuka</option>
                <option value="silvestre">Silvestre</option>
              </select>
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
          <h3><i className="fas fa-mortar-pestle"></i> Aditivos</h3>
          <div className="form-grid">
            <div className="input-group">
              <label htmlFor="especias">Especias</label>
              <select
                id="especias"
                name="especias"
                value={formData.especias}
                onChange={handleInputChange}
              >
                <option value="">Ninguna</option>
                <option value="jengibre">Jengibre</option>
                <option value="canela">Canela</option>
                <option value="clavo">Clavo</option>
                <option value="cardamomo">Cardamomo</option>
                <option value="vainilla">Vainilla</option>
                <option value="naranja">Cáscara de naranja</option>
                <option value="limon">Cáscara de limón</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="frutas">Frutas</label>
              <select
                id="frutas"
                name="frutas"
                value={formData.frutas}
                onChange={handleInputChange}
              >
                <option value="">Ninguna</option>
                <option value="manzana">Manzana</option>
                <option value="pera">Pera</option>
                <option value="ciruela">Ciruela</option>
                <option value="cereza">Cereza</option>
                <option value="mora">Mora</option>
                <option value="uva">Uva</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="cantidad_frutas">Cantidad de Frutas (kg)</label>
              <input
                type="number"
                id="cantidad_frutas"
                name="cantidad_frutas"
                value={formData.cantidad_frutas}
                onChange={handleInputChange}
                min="0"
                step="0.5"
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
                max="25"
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
                max="5.0"
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
              <h4><i className="fas fa-weight"></i> Ingredientes Principales</h4>
              <div className="result-item">
                <span className="label">Miel:</span>
                <span className="value">{results.miel.toFixed(2)} kg</span>
              </div>
              <div className="result-item">
                <span className="label">Agua:</span>
                <span className="value">{results.agua.toFixed(2)} litros</span>
              </div>
            </div>

            <div className="result-card">
              <h4><i className="fas fa-beer"></i> Perfil del Hidromiel</h4>
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

export default MeadCalculator;