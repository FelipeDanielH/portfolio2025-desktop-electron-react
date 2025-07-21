// Skills destacados en home
export interface HomeSkills {
  skills: string[];
}
export interface HomeExperience {
  experience: string[];
}
export interface HomeProjects {
  projects: string[];
}
export interface HomeEducation {
  education: string[];
}
export interface HomeAbout {
  about: string[];
}
export interface HomeCertifications {
  certifications: string[];
}
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
export interface HomeContact {
  email: string;
  telefono: string;
  linkedin: string;
  github?: string;
  portfolio_url?: string;
}
export interface HomeCallToAction {
  titulo: string;
  subtitulo: string;
} 