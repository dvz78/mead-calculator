import type { Recipe } from '../types/recipe';

interface CostoIngrediente {
    nombre: string;
    cantidad: number;
    unidad: string;
    precioUnitario: number;
    total: number;
}

export interface CostoReceta {
    ingredientes: CostoIngrediente[];
    totalMateriales: number;
    costoEnvases: number;
    costoEtiquetas: number;
    otrosGastos: number;
    total: number;
    costoPorLitro: number;
    precioVentaSugerido: number;
    margenBeneficio: number;
}

export function calcularCostos(recipe: Recipe, precios: {
    precioMiel: number;
    precioLevadura: number;
    precioNutrientes: number;
    precioClarificante: number;
    precioBloqueador: number;
    precioEspecias?: number;
    precioFrutas?: number;
    costoEnvase: number;
    costoEtiqueta: number;
    otrosGastos: number;
    margenDeseado: number;
}): CostoReceta {
    const ingredientes: CostoIngrediente[] = [];
    
    // Cálculo de miel necesaria (kg)
    const kgMiel = (recipe.og - 1) * 2.5 * recipe.volumen;
    ingredientes.push({
        nombre: 'Miel',
        cantidad: kgMiel,
        unidad: 'kg',
        precioUnitario: precios.precioMiel,
        total: kgMiel * precios.precioMiel
    });

    // Levadura
    ingredientes.push({
        nombre: 'Levadura',
        cantidad: 1,
        unidad: 'paquete',
        precioUnitario: precios.precioLevadura,
        total: precios.precioLevadura
    });

    // Nutrientes si se usan
    if (recipe.nutrientes === 'si') {
        ingredientes.push({
            nombre: recipe.tipo_nutrientes,
            cantidad: recipe.volumen * 0.5, // 0.5g por litro
            unidad: 'g',
            precioUnitario: precios.precioNutrientes,
            total: (recipe.volumen * 0.5 * precios.precioNutrientes) / 1000
        });
    }

    // Clarificante si se usa
    if (recipe.clarificante === 'si') {
        ingredientes.push({
            nombre: recipe.tipo_clarificante,
            cantidad: recipe.volumen * 0.3, // 0.3g por litro
            unidad: 'g',
            precioUnitario: precios.precioClarificante,
            total: (recipe.volumen * 0.3 * precios.precioClarificante) / 1000
        });
    }

    // Bloqueador si se usa
    if (recipe.bloqueador === 'si') {
        ingredientes.push({
            nombre: recipe.tipo_bloqueador,
            cantidad: recipe.volumen * 0.2, // 0.2g por litro
            unidad: 'g',
            precioUnitario: precios.precioBloqueador,
            total: (recipe.volumen * 0.2 * precios.precioBloqueador) / 1000
        });
    }

    // Especias si se usan
    if (recipe.especias && precios.precioEspecias) {
        ingredientes.push({
            nombre: 'Especias',
            cantidad: recipe.volumen * 0.1, // 0.1g por litro
            unidad: 'g',
            precioUnitario: precios.precioEspecias,
            total: (recipe.volumen * 0.1 * precios.precioEspecias) / 1000
        });
    }

    // Frutas si se usan
    if (recipe.frutas && recipe.cantidad_frutas > 0 && precios.precioFrutas) {
        ingredientes.push({
            nombre: recipe.frutas,
            cantidad: recipe.cantidad_frutas,
            unidad: 'g',
            precioUnitario: precios.precioFrutas,
            total: (recipe.cantidad_frutas * precios.precioFrutas) / 1000
        });
    }

    // Calcular totales
    const totalMateriales = ingredientes.reduce((sum, ing) => sum + ing.total, 0);
    const costoEnvases = recipe.volumen * precios.costoEnvase;
    const costoEtiquetas = Math.ceil(recipe.volumen) * precios.costoEtiqueta;
    const total = totalMateriales + costoEnvases + costoEtiquetas + precios.otrosGastos;
    const costoPorLitro = total / recipe.volumen;
    const precioVentaSugerido = costoPorLitro * (1 + precios.margenDeseado);
    const margenBeneficio = (precioVentaSugerido - costoPorLitro) / precioVentaSugerido * 100;

    return {
        ingredientes,
        totalMateriales,
        costoEnvases,
        costoEtiquetas,
        otrosGastos: precios.otrosGastos,
        total,
        costoPorLitro,
        precioVentaSugerido,
        margenBeneficio
    };
}