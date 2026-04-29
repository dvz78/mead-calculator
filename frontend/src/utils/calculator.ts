// Define la estructura de los resultados de cálculo
export interface CalculationResults {
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

// Función para calcular ABV usando la fórmula de la American Homebrewers Association
export function calcularABV(di: number, df: number): number {
    return (di - df) * 131.25;
}

// Función para calcular la cantidad de ingrediente principal necesaria
export function calcularIngrediente(volumen: number, di: number, tipoIngrediente: string): number {
    // Aproximación basada en la densidad inicial
    const puntosGravedad = (di - 1) * 1000;
    
    switch (tipoIngrediente) {
        case 'miel':
            // Aproximación: 35 puntos de gravedad por libra de miel por galón
            const librasPorGalon = puntosGravedad / 35;
            const totalLibras = librasPorGalon * (volumen / 3.78541);
            return totalLibras * 0.453592; // Convertir a kg
        
        case 'azucar':
            // Aproximación: 46 puntos de gravedad por libra de azúcar por galón
            const librasAzucar = (puntosGravedad / 46) * (volumen / 3.78541);
            return librasAzucar * 0.453592; // Convertir a kg
        
        case 'zumo':
            // Para zumo, asumimos que ya tiene azúcares naturales
            return volumen * 0.8; // 80% del volumen como zumo
        
        default:
            return volumen * 0.3; // Valor por defecto
    }
}

// Función para calcular el agua necesaria
export function calcularAgua(volumenTotal: number, ingrediente: number, tipoIngrediente: string): number {
    switch (tipoIngrediente) {
        case 'miel':
            // Densidad de la miel es aprox 1.42 kg/L
            const volumenMiel = ingrediente / 1.42;
            return volumenTotal - volumenMiel;
        
        case 'azucar':
            // El azúcar se disuelve en agua, asumimos que no añade volumen significativo
            return volumenTotal;
        
        case 'zumo':
            // El zumo ya contiene agua, restamos el volumen de zumo
            return volumenTotal - ingrediente;
        
        default:
            return volumenTotal - ingrediente;
    }
}

// Función para determinar el nivel de dulzura
export function determinarDulzura(df: number): string {
    const residual = (df - 1.000) * 1000;
    if (residual < 5) return "Seco";
    if (residual < 15) return "Semi-seco";
    if (residual < 30) return "Medio";
    if (residual < 50) return "Semi-dulce";
    return "Dulce";
}

// Función para calcular nutrientes de levadura
export function calcularNutrientes(volumen: number): number {
    // Aproximación: 0.5g de nutrientes por litro
    return volumen * 0.5;
}

// Función para calcular clarificante
export function calcularClarificante(volumen: number): number {
    // Aproximación: 1g de bentonita por litro
    return volumen * 1;
}

// Función para calcular ajuste de acidez
export function calcularAcidez(volumen: number, ph: number): number {
    // Aproximación: 0.1g de ácido cítrico por litro para cada 0.1 de pH que se quiere bajar
    const phObjetivo = 3.5;
    const diferenciaPH = ph - phObjetivo;
    if (diferenciaPH > 0) {
        return volumen * diferenciaPH * 1;
    }
    return 0;
}

// Función para calcular ajuste de tanino
export function calcularTanino(volumen: number, tipoIngrediente: string): number {
    // Aproximación: 0.2g de tanino por litro para ingredientes con bajo tanino
    switch (tipoIngrediente) {
        case 'miel':
        case 'azucar':
            return volumen * 0.2;
        default:
            return 0;
    }
}

// Función para convertir unidades
export function convertirUnidades(valor: number, unidadOrigen: string, unidadDestino: string): number {
    const conversiones: Record<string, number> = {
        'litros->galones': 0.264172,
        'galones->litros': 3.78541,
        'kg->libras': 2.20462,
        'libras->kg': 0.453592
    };
    
    const clave = `${unidadOrigen}->${unidadDestino}`;
    return valor * (conversiones[clave] || 1);
}

// Función para estimar tiempo de fermentación
export function calcularTiempoFermentacion(abv: number, temperatura: number): number {
    // Aproximación: 1 semana por 1% ABV, ajustado por temperatura
    const semanasBase = abv;
    const ajusteTemperatura = temperatura < 18 ? 1.5 : temperatura > 24 ? 0.8 : 1;
    return Math.round(semanasBase * ajusteTemperatura);
}

// Esta función principal tomará los datos del formulario y devolverá los resultados calculados
export function performCalculations(formData: any): CalculationResults {
    const volumen = parseFloat(formData.volumen);
    const di = parseFloat(formData.di);
    const df = parseFloat(formData.df);
    const ph = parseFloat(formData.ph);
    const temperatura = parseFloat(formData.temperatura);
    
    // Calcular contenido de alcohol (ABV)
    const abv = calcularABV(di, df);
    
    // Calcular ingredientes
    const ingredientePrincipal = calcularIngrediente(volumen, di, formData.tipoIngrediente);
    const agua = calcularAgua(volumen, ingredientePrincipal, formData.tipoIngrediente);
    
    // Determinar dulzura
    const dulzura = determinarDulzura(df);
    
    // Calcular nutrientes
    const nutrientes = formData.nutrientes === 'si' ? calcularNutrientes(volumen) : 0;
    
    // Calcular clarificante
    const clarificante = formData.clarificante === 'si' ? calcularClarificante(volumen) : 0;
    
    // Calcular acidez
    const acidez = calcularAcidez(volumen, ph);
    
    // Calcular tanino
    const tanino = calcularTanino(volumen, formData.tipoIngrediente);
    
    // Calcular tiempo de fermentación
    const tiempoFermentacion = calcularTiempoFermentacion(abv, temperatura);
    
    return {
        ingredientePrincipal,
        agua,
        fg: df,
        abv,
        dulzura,
        nutrientes,
        clarificante,
        acidez,
        tanino,
        volumenFinal: volumen,
        tiempoFermentacion
    };
}
