import React, { useState } from 'react';
import './FermentationTracker.css';

interface FermentationReading {
    fecha: string;
    di: string;
    temperatura: string;
    notas: string;
}

interface FermentationTrackerProps {
    onCalculateProgress: (readings: FermentationReading[]) => void;
}

const FermentationTracker: React.FC<FermentationTrackerProps> = ({ onCalculateProgress }) => {
    const [readings, setReadings] = useState<FermentationReading[]>([
        { fecha: new Date().toISOString().split('T')[0], di: '', temperatura: '', notas: '' }
    ]);

    const handleInputChange = (index: number, field: keyof FermentationReading, value: string) => {
        const newReadings = [...readings];
        newReadings[index][field] = value;
        setReadings(newReadings);
    };

    const addReading = () => {
        setReadings([
            ...readings,
            { fecha: new Date().toISOString().split('T')[0], di: '', temperatura: '', notas: '' }
        ]);
    };

    const removeReading = (index: number) => {
        if (readings.length > 1) {
            const newReadings = readings.filter((_, i) => i !== index);
            setReadings(newReadings);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCalculateProgress(readings);
    };

    return (
        <div className="fermentation-tracker">
            <h3><i className="fas fa-chart-line"></i> Registro de Fermentación</h3>
            <form onSubmit={handleSubmit}>
                {readings.map((reading, index) => (
                    <div key={index} className="reading-row">
                        <div className="input-group">
                            <label>Fecha</label>
                            <input
                                type="date"
                                value={reading.fecha}
                                onChange={(e) => handleInputChange(index, 'fecha', e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Densidad Inicial</label>
                            <select
                                value={reading.di}
                                onChange={(e) => handleInputChange(index, 'di', e.target.value)}
                                required
                            >
                                <option value="">Seleccionar</option>
                                <option value="1.080">1.080</option>
                                <option value="1.090">1.090</option>
                                <option value="1.100">1.100</option>
                                <option value="1.110">1.110</option>
                                <option value="1.120">1.120</option>
                                <option value="1.130">1.130</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Temperatura (°C)</label>
                            <select
                                value={reading.temperatura}
                                onChange={(e) => handleInputChange(index, 'temperatura', e.target.value)}
                                required
                            >
                                <option value="">Seleccionar</option>
                                {[15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map(temp => (
                                    <option key={temp} value={temp.toString()}>{temp}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Notas</label>
                            <input
                                type="text"
                                value={reading.notas}
                                onChange={(e) => handleInputChange(index, 'notas', e.target.value)}
                                placeholder="Observaciones"
                            />
                        </div>
                        <button 
                            type="button" 
                            onClick={() => removeReading(index)}
                            className="btn-remove"
                            disabled={readings.length <= 1}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                ))}
                <div className="tracker-actions">
                    <button type="button" onClick={addReading} className="btn-add">
                        <i className="fas fa-plus"></i> Añadir Lectura
                    </button>
                    <button type="submit" className="btn-primary">
                        <i className="fas fa-calculator"></i> Calcular Progreso
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FermentationTracker;