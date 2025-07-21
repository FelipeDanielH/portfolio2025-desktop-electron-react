// Skills destacados en home
export interface HomeSkills {
  skills: string[]; // IDs de skills destacados
}

// Experiencia destacada en home
export interface HomeExperience {
  experience: string[]; // IDs de experiencias destacadas
}

// Proyectos destacados en home
export interface HomeProjects {
  projects: string[]; // IDs de proyectos destacados
}

// Formación/certificaciones destacadas en home
export interface HomeEducation {
  education: string[]; // IDs de formaciones/certificaciones destacadas
}

// About destacados en home
export interface HomeAbout {
  about: string[]; // IDs de bloques about destacados
}

// Certificaciones destacadas en home
export interface HomeCertifications {
  certifications: string[]; // IDs de certificaciones destacadas
}

// Configuración del hero de inicio
export interface HomeHero {
  nombre: string;
  titulo: string;
  claim: string;
  telefono: string;
  ubicacion: string;
  email: string;
  linkedin: string;
  cv: string;
  boton_contacto: string;
}

// Configuración de contacto de inicio
export interface HomeContact {
  email: string;
  telefono: string;
  linkedin: string;
  github?: string;
  portfolio_url?: string;
}

// Configuración de llamada a la acción de inicio
export interface HomeCallToAction {
  titulo: string;
  subtitulo: string;
} 