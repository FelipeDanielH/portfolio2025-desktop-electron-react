import type { BaseEntity } from './base.types';

export interface Education extends BaseEntity {
  tipo: "formacion" | "certificacion";
  titulo: string;
  institucion: string;
  estado: "En curso" | "Completado" | "Abandonado";
  fecha_inicio?: string; // Formato: "YYYY-MM"
  fecha_fin?: string | null; // Formato: "YYYY-MM" o null si sigue en curso
  descripcion?: string;
  aprendizajes?: string[];
  certificado_url?: string | null;
  links_relevantes?: {
    titulo: string;
    url: string;
  }[];
}

export interface EducationFormData {
  tipo: "formacion" | "certificacion";
  titulo: string;
  institucion: string;
  estado: "En curso" | "Completado" | "Abandonado";
  fecha_inicio?: string;
  fecha_fin?: string | null;
  descripcion?: string;
  aprendizajes?: string[];
  certificado_url?: string | null;
  links_relevantes?: {
    titulo: string;
    url: string;
  }[];
} 