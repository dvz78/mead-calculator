import React, { useState } from 'react';
import './CalculatorForm.css';
import FermentationTracker from './FermentationTracker';

// Interfaz para los datos del formulario
interface FormData {
    nombreReceta: string;
    volumen: string;
    unidadVolumen: string;
    di: string;
    df: string;
    tipoIngrediente: string;
    pesoVolumen: string;
    unidadPesoVolumen: string;
    tipoLevadura: string;
    nutrientes: string;
    tipoNutrientes: string;
    clarificante: string;
    tipoClarificante: string;
    temperatura: string;
    ph: string;
    registrarFermentacion: string;
}

// Propiedades que el componente recibirá
interface CalculatorFormProps {
    onCalculate: (data: FormData) => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate }) => {
    const [formData, setFormData] = useState<FormData>({
        nombreReceta: 'Mi Receta Especial',
        volumen: '10',
        unidadVolumen: 'litros',
        di: '1.100',
        df: '1.020',
        tipoIngrediente: 'miel',
        pesoVolumen: '3',
        unidadPesoVolumen: 'kg',
        tipoLevadura: 'd47',
        nutrientes: 'si',
        tipoNutrientes: 'dap',
        clarificante: 'no',
        tipoClarificante: 'bentonita',
        temperatura: '20',
        ph: '4.0',
        registrarFermentacion: 'no'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFermentationProgress = (readings: any[]) => {
        // TODO: Implement fermentation progress calculation
        alert(`Registradas ${readings.length} lecturas de fermentación`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCalculate(formData);
    };

    const handleReset = () => {
        setFormData({
            nombreReceta: 'Mi Receta Especial',
            volumen: '10',
            unidadVolumen: 'litros',
            di: '1.100',
            df: '1.020',
            tipoIngrediente: 'miel',
            pesoVolumen: '3',
            unidadPesoVolumen: 'kg',
            tipoLevadura: 'd47',
            nutrientes: 'si',
            tipoNutrientes: 'dap',
            clarificante: 'no',
            tipoClarificante: 'bentonita',
            temperatura: '20',
            ph: '4.0',
            registrarFermentacion: 'no'
        });
    };

    return (
        <form id="hidromielForm" className="recipe-form" onSubmit={handleSubmit} onReset={handleReset}>
            {/* --- SECCIONES DEL FORMULARIO --- */}
            <div className="form-section">
                <h3><i className="fas fa-list"></i> Receta</h3>
                <div className="form-grid">
                    <div className="input-group">
                        <label htmlFor="nombreReceta">Nombre de la Receta</label>
                        <input 
                            type="text" 
                            id="nombreReceta" 
                            name="nombreReceta"
                            value={formData.nombreReceta}
                            onChange={handleInputChange}
                            placeholder="Mi Receta Especial" 
                        />
                    </div>
                </div>
            </div>
            
            <div className="form-section">
                <h3><i className="fas fa-flask"></i> Parámetros de la Receta</h3>
                <div className="form-grid">
                    <div className="input-group">
                        <label htmlFor="volumen">Volumen Total</label>
                        <div className="input-with-unit">
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
                            <select
                                id="unidadVolumen"
                                name="unidadVolumen"
                                value={formData.unidadVolumen}
                                onChange={handleInputChange}
                            >
                                <option value="litros">Litros</option>
                                <option value="galones">Galones</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="di">Densidad Inicial (DI)</label>
                        <select id="di" name="di" value={formData.di} onChange={handleInputChange} required>
                            <option value="1.080">1.080 - Suave</option>
                            <option value="1.090">1.090 - Medio-suave</option>
                            <option value="1.100">1.100 - Medio</option>
                            <option value="1.110">1.110 - Medio-fuerte</option>
                            <option value="1.120">1.120 - Fuerte</option>
                            <option value="1.130">1.130 - Muy fuerte</option>
                        </select>
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="df">Densidad Final (DF)</label>
                        <select id="df" name="df" value={formData.df} onChange={handleInputChange} required>
                            <option value="0.990">0.990 - Muy seco</option>
                            <option value="1.000">1.000 - Seco</option>
                            <option value="1.010">1.010 - Semi-seco</option>
                            <option value="1.020">1.020 - Medio</option>
                            <option value="1.030">1.030 - Semi-dulce</option>
                            <option value="1.040">1.040 - Dulce</option>
                        </select>
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="tipoIngrediente">Tipo de Ingrediente Principal</label>
                        <select id="tipoIngrediente" name="tipoIngrediente" value={formData.tipoIngrediente} onChange={handleInputChange} required>
                            <option value="miel">Miel</option>
                            <option value="azucar">Azúcar</option>
                            <option value="zumo">Zumo de Frutas</option>
                        </select>
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="pesoVolumen">Cantidad de Ingrediente</label>
                        <div className="input-with-unit">
                            <input 
                                type="number" 
                                id="pesoVolumen" 
                                name="pesoVolumen"
                                value={formData.pesoVolumen}
                                onChange={handleInputChange}
                                min="0"
                                step="0.1"
                                required
                            />
                            <select id="unidadPesoVolumen" name="unidadPesoVolumen" value={formData.unidadPesoVolumen} onChange={handleInputChange}>
                                <option value="kg">kg</option>
                                <option value="libras">libras</option>
                                <option value="litros">litros</option>
                                <option value="galones">galones</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3><i className="fas fa-vial"></i> Fermentación</h3>
                <div className="form-grid">
                    <div className="input-group">
                        <label htmlFor="tipoLevadura">Tipo de Levadura</label>
                        <select id="tipoLevadura" name="tipoLevadura" value={formData.tipoLevadura} onChange={handleInputChange} required>
                            <option value="v71b">V71/B - Lavanda, afrutada</option>
                            <option value="d47">D47 - Limpia, neutra</option>
                            <option value="d80">D80 - Compleja, afrutada</option>
                            <option value="k1v1116">K1V-1116 - Alta fermentación</option>
                            <option value="rc212">RC212 - Borgoña, rica</option>
                            <option value="71b4">71B-4 - Baja fermentación, dulce</option>
                        </select>
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="nutrientes">Nutrientes para Levaduras</label>
                        <select id="nutrientes" name="nutrientes" value={formData.nutrientes} onChange={handleInputChange}>
                            <option value="no">No</option>
                            <option value="si">Sí</option>
                        </select>
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="tipoNutrientes">Tipo de Nutrientes</label>
                        <select id="tipoNutrientes" name="tipoNutrientes" value={formData.tipoNutrientes} onChange={handleInputChange}>
                            <option value="dap">DAP</option>
                            <option value="fermaidk">Fermaid K</option>
                            <option value="goferit">GoFerm IT</option>
                        </select>
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="clarificante">Clarificante</label>
                        <select id="clarificante" name="clarificante" value={formData.clarificante} onChange={handleInputChange}>
                            <option value="no">No</option>
                            <option value="si">Sí</option>
                        </select>
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="tipoClarificante">Tipo de Clarificante</label>
                        <select id="tipoClarificante" name="tipoClarificante" value={formData.tipoClarificante} onChange={handleInputChange}>
                            <option value="bentonita">Bentonita</option>
                            <option value="gelatina">Gelatina</option>
                            <option value="silica">Sílice</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="form-section">
                <h3><i className="fas fa-cog"></i> Parámetros Avanzados</h3>
                <div className="form-grid">
                    <div className="input-group">
                        <label htmlFor="temperatura">Temperatura de Fermentación</label>
                        <div className="input-with-unit">
                            <select id="temperatura" name="temperatura" value={formData.temperatura} onChange={handleInputChange}>
                                {[15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                            <span className="unit">°C</span>
                        </div>
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="ph">pH Inicial</label>
                        <div className="input-with-unit">
                            <select id="ph" name="ph" value={formData.ph} onChange={handleInputChange}>
                                {[3.0, 3.2, 3.4, 3.5, 3.6, 3.8, 4.0, 4.2, 4.5, 4.8, 5.0].map(v => <option key={v} value={v.toFixed(1)}>{v.toFixed(1)}</option>)}
                            </select>
                            <span className="unit">pH</span>
                        </div>
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="registrarFermentacion">Registrar Fermentación</label>
                        <select id="registrarFermentacion" name="registrarFermentacion" value={formData.registrarFermentacion} onChange={handleInputChange}>
                            <option value="no">No</option>
                            <option value="si">Sí</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {formData.registrarFermentacion === 'si' && (
                <FermentationTracker onCalculateProgress={handleFermentationProgress} />
            )}
            
            <div className="form-actions">
                <button type="submit" className="btn-primary">
                    <i className="fas fa-calculator"></i> Calcular Receta
                </button>
                <button type="reset" className="btn-secondary">
                    <i className="fas fa-broom"></i> Limpiar
                </button>
            </div>
        </form>
    );
}

export default CalculatorForm;
