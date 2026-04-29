export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface Recipe {
    id: number;
    nombre: string;
    volumen: number;
    og: number;
    tipo_miel: TipoMiel;
    levadura: string;
    eficiencia: number;
    especias: string;
    frutas: string;
    cantidad_frutas: number;
    bloqueador: 'si' | 'no';
    tipo_bloqueador: TipoBloqueador;
    nutrientes: 'si' | 'no';
    tipo_nutrientes: TipoNutrientes;
    clarificante: 'si' | 'no';
    tipo_clarificante: TipoClarificante;
    temperatura: number;
    duracion: number;
    ph: number | null;
    created_at: string;
    updated_at: string;
    notas: string;
    owner: number;
}

export type TipoMiel = 'multifloral' | 'eucalipto' | 'acacia' | 'naranjo' | 'castaño' | 'romero' | 'otros';
export type TipoBloqueador = 'metabisulfito' | 'sorbato' | 'ninguno';
export type TipoNutrientes = 'dap' | 'fermaid' | 'ninguno';
export type TipoClarificante = 'bentonita' | 'gelatina' | 'ninguno';

export interface FormattedRecipe extends Recipe {
    tipo: 'hidromiel' | 'vino';
    abv: string;
    ingredientes: {
      miel: string;
      agua: string;
      nutrientes: string;
      clarificante: string;
    };
  }
  
  export interface RecipeFormData {
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