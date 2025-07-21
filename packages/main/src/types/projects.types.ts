import type { BaseEntity } from './base.types';

export interface Project extends BaseEntity {
  nombre: string;
  descripcion: string;
  tecnologias: string[];
  roles?: string[];
  frameworks?: string[];
  lenguajes?: string[];
  herramientas?: string[];
  estado: "en desarrollo" | "completado" | "abandonado";
  año: number;
  imagen?: string;
  links: {
    demo?: string;
    frontend?: string;
    backend?: string;
    github?: string;
    otros?: { titulo: string; url: string }[];
  };
}

export interface Tech extends BaseEntity {
  tipo: "lenguaje" | "framework" | "rol" | "herramienta";
  nombre: string;
  icono?: string;
}

export interface ProjectFormData extends Omit<Project, '_id'> {}
export interface TechFormData extends Omit<Tech, '_id'> {}

export interface HomeProjects extends BaseEntity {
  projects: string[]; // IDs de proyectos a mostrar en inicio, ordenadas
} 