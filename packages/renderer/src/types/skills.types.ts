import type { BaseEntity } from './base.types';

// Tipos para Skills y Categorías
export interface Concepto extends BaseEntity {
  nombre: string;
  aprendido: boolean;
}

export interface Categoria extends BaseEntity {
  nombre: string;
  orden: number;
}

export interface Skill extends BaseEntity {
  categoria_id: string;         // Referencia a la categoría (relación 1:N)
  tecnologia: string;           // Ej: "React", "Node.js"
  nivel: "Básico" | "Intermedio" | "Avanzado" | "Experto";
  puntuacion: number;           // 1-10, para visualización tipo barra/estrella
  descripcion?: string;         // Opcional, detalles o contexto de la habilidad
  conceptos?: Concepto[];       // Conceptos clave asociados a la habilidad
  orden?: number;               // Para orden personalizado en la UI
}

// Tipos para el estado de la UI
export interface SkillsState {
  skills: Skill[];
  categorias: Categoria[];
  loading: boolean;
  error: string | null;
  selectedSkill: Skill | null;
  selectedCategoria: Categoria | null;
  isEditingSkill: boolean;
  isEditingCategoria: boolean;
}

// Tipos para formularios
export interface SkillFormData {
  categoria_id: string;
  tecnologia: string;
  nivel: "Básico" | "Intermedio" | "Avanzado" | "Experto";
  puntuacion: number;
  descripcion?: string;
  conceptos?: Concepto[];
  orden?: number;
}

export interface CategoriaFormData {
  nombre: string;
  orden: number;
}

// Tipos para filtros y búsqueda
export interface SkillsFilters {
  categoria_id?: string;
  nivel?: string;
  search?: string;
}

// Tipos para home skills (destacados en inicio)
export interface HomeSkills {
  skills: string[]; // IDs de skills a mostrar en inicio, ordenadas
} 