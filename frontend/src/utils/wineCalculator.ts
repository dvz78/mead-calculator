import type { WineFormData } from "../components/WineCalculator";

// Define la estructura de los resultados de cálculo de vino
export interface WineCalculationResults {
  uva: number;
  azucar: number;
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
export function calcularABVVino(di: number, df: number): number {
    return (di - df) * 131.25;
}

// Función para calcular la cantidad de uva necesaria
export function calcularUva(volumen: number): number {
    // Aproximación: 1.5 kg de uva por litro de vino
    return volumen * 1.5;
}

// Función para calcular el agua necesaria para vino
export function calcularAguaVino(volumenTotal: number, kgUva: number): number {
    // Aproximación: la uva contiene aproximadamente 80% de agua
    const aguaEnUva = kgUva * 0.8;
    return volumenTotal - aguaEnUva;
}

// Función para calcular azúcar adicional
export function calcularAzucarAdicional(volumen: number, azucar: number): number {
    // Convertir de g/L a kg total
    return (azucar * volumen) / 1000;
}

// Función para determinar el nivel de dulzura para vino
export function determinarDulzuraVino(df: number): string {
    const residual = (df - 0.990) * 1000;
    if (residual < 5) return "Seco";
    if (residual < 15) return "Semi-seco";
    if (residual < 30) return "Medio";
    if (residual < 50) return "Semi-dulce";
    return "Dulce";
}

// Función para calcular nutrientes de levadura
export function calcularNutrientesVino(volumen: number): number {
    // Aproximación: 0.5g de nutrientes por litro
    return volumen * 0.5;
}

// Función para calcular clarificante
export function calcularClarificanteVino(volumen: number): number {
    // Aproximación: 1g de bentonita por litro
    return volumen * 1;
}

// Función para calcular ajuste de acidez
export function calcularAcidezVino(volumen: number, ph: number): number {
    // Aproximación: 0.1g de ácido cítrico por litro para cada 0.1 de pH que se quiere bajar
    const phObjetivo = 3.5;
    const diferenciaPH = ph - phObjetivo;
    if (diferenciaPH > 0) {
        return volumen * diferenciaPH * 1;
    }
    return 0;
}

// Función para calcular ajuste de tanino
export function calcularTaninoVino(volumen: number): number {
    // Aproximación: 0.1g de tanino por litro para vinos que lo necesiten
    return volumen * 0.1;
}

// Función para estimar tiempo de fermentación
export function calcularTiempoFermentacionVino(abv: number, temperatura: number): number {
    // Aproximación: 1 semana por 1% ABV, ajustado por temperatura
    const semanasBase = abv;
    const ajusteTemperatura = temperatura < 18 ? 1.5 : temperatura > 24 ? 0.8 : 1;
    return Math.round(semanasBase * ajusteTemperatura);
}

// Esta función principal tomará los datos del formulario y devolverá los resultados calculados
export function performWineCalculations(formData: WineFormData): WineCalculationResults {
    const volumen = formData.volumen;
    const azucar = formData.azucar;
    const ph = formData.ph;
    const temperatura = formData.temperatura;
    
    // Calcular densidad inicial basada en azúcar
    const di = 1.000 + (azucar * 0.00426); // Aproximación básica
    
    // Calcular densidad final basada en eficiencia
    const eficiencia = formData.eficiencia / 100;
    const df = 1.000 + (di - 1.000) * (1 - eficiencia);
    
    // Calcular contenido de alcohol (ABV)
    const abv = calcularABVVino(di, df);
    
    // Calcular ingredientes
    const uva = calcularUva(volumen);
    const agua = calcularAguaVino(volumen, uva);
    const azucarAdicional = calcularAzucarAdicional(volumen, azucar);
    
    // Determinar dulzura
    const dulzura = determinarDulzuraVino(df);
    
    // Calcular nutrientes
    const nutrientes = formData.nutrientes === 'si' ? calcularNutrientesVino(volumen) : 0;
    
    // Calcular clarificante
    const clarificante = formData.clarificante === 'si' ? calcularClarificanteVino(volumen) : 0;
    
    // Calcular acidez
    const acidez = calcularAcidezVino(volumen, ph);
    
    // Calcular tanino
    const tanino = calcularTaninoVino(volumen);
    
    // Calcular tiempo de fermentación
    const tiempoFermentacion = calcularTiempoFermentacionVino(abv, temperatura);
    
    return {
        uva,
        azucar: azucarAdicional,
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