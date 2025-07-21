export interface Experience {
  _id?: string;
  rol: string;
  empresa: string;
  ubicacion: string;
  modalidad?: "Remoto" | "Presencial" | "Híbrido";
  equipo?: string;
  sector?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  descripcion: string;
  responsabilidades?: string[];
  logros?: string[];
  tecnologias?: string[];
}

export interface ExperienceFormData {
  rol: string;
  empresa: string;
  ubicacion: string;
  modalidad?: "Remoto" | "Presencial" | "Híbrido";
  equipo?: string;
  sector?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  descripcion: string;
  responsabilidades?: string[];
  logros?: string[];
  tecnologias?: string[];
} 