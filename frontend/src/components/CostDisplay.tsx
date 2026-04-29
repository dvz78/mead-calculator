import type { CostoReceta } from '../utils/costCalculator';

interface CostDisplayProps {
    costos: CostoReceta;
}

export const CostDisplay: React.FC<CostDisplayProps> = ({ costos }) => {
    return (
        <div className="cost-display">
            <h3>Desglose de Costos</h3>
            
            <div className="ingredients-list">
                <h4>Ingredientes</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Ingrediente</th>
                            <th>Cantidad</th>
                            <th>Unidad</th>
                            <th>Precio Unit.</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {costos.ingredientes.map((ing, index) => (
                            <tr key={index}>
                                <td>{ing.nombre}</td>
                                <td>{ing.cantidad.toFixed(2)}</td>
                                <td>{ing.unidad}</td>
                                <td>€{ing.precioUnitario.toFixed(2)}</td>
                                <td>€{ing.total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="costs-summary">
                <h4>Resumen de Costos</h4>
                <div className="cost-item">
                    <span>Total Materiales:</span>
                    <span>€{costos.totalMateriales.toFixed(2)}</span>
                </div>
                <div className="cost-item">
                    <span>Costo Envases:</span>
                    <span>€{costos.costoEnvases.toFixed(2)}</span>
                </div>
                <div className="cost-item">
                    <span>Costo Etiquetas:</span>
                    <span>€{costos.costoEtiquetas.toFixed(2)}</span>
                </div>
                <div className="cost-item">
                    <span>Otros Gastos:</span>
                    <span>€{costos.otrosGastos.toFixed(2)}</span>
                </div>
                <div className="cost-item total">
                    <span>Costo Total:</span>
                    <span>€{costos.total.toFixed(2)}</span>
                </div>
            </div>

            <div className="pricing-analysis">
                <h4>Análisis de Precios</h4>
                <div className="cost-item">
                    <span>Costo por Litro:</span>
                    <span>€{costos.costoPorLitro.toFixed(2)}</span>
                </div>
                <div className="cost-item">
                    <span>Precio de Venta Sugerido:</span>
                    <span>€{costos.precioVentaSugerido.toFixed(2)}</span>
                </div>
                <div className="cost-item">
                    <span>Margen de Beneficio:</span>
                    <span>{costos.margenBeneficio.toFixed(1)}%</span>
                </div>
            </div>
        </div>
    );
};