export {};

import type { Skill, Categoria, HomeSkills } from './skills.types';
import type { Experience } from './experience.types';
import type { Project, Tech, HomeProjects } from './projects.types';
import type { Education, HomeEducation } from './education.types';
import type { HomeExperience, HomeAbout, HomeCertifications, HomeHero, HomeContact, HomeCallToAction } from './home.types';

declare global {
  interface Window {
    electronAPI: {
      getHero: () => Promise<{
        nombre: string;
        titulo: string;
        claim: string;
        telefono: string;
        ubicacion: string;
        email: string;
        linkedin: string;
        cv: string;
        boton_contacto: string;
      } | null>;
      getResumen: () => Promise<{
        bloques: Array<{
          id?: string;
          titulo: string;
          contenido: string;
          orden: number;
        }>;
      } | null>;
      saveResumen: (data: {
        bloques: Array<{
          id?: string;
          titulo: string;
          contenido: string;
          orden: number;
        }>;
      }) => Promise<boolean>;
      getBackendUrl: () => Promise<string>;
      // --- APIs Modulares ---
      about: {
        getAll: () => Promise<Array<{
          id?: string;
          titulo: string;
          descripcion: string;
          orden: number;
        }> | null>;
        create: (data: { titulo: string; descripcion: string; orden: number }) => Promise<{
          id?: string;
          titulo: string;
          descripcion: string;
          orden: number;
        } | null>;
        update: (id: string, data: Partial<{ titulo: string; descripcion: string; orden: number }>) => Promise<{
          id?: string;
          titulo: string;
          descripcion: string;
          orden: number;
        } | null>;
        delete: (id: string) => Promise<boolean>;
      };
      skills: {
        getAll: () => Promise<Skill[]>;
        getOrdered: () => Promise<Skill[]>;
        getById: (id: string) => Promise<Skill>;
        create: (data: Omit<Skill, '_id'>) => Promise<Skill>;
        update: (id: string, data: Partial<Skill>) => Promise<Skill>;
        delete: (id: string) => Promise<boolean>;
        getByCategoria: (categoriaId: string) => Promise<Skill[]>;
        getByNivel: (nivel: string) => Promise<Skill[]>;
      };
      categories: {
        getAll: () => Promise<Categoria[]>;
        getOrdered: () => Promise<Categoria[]>;
        getById: (id: string) => Promise<Categoria>;
        create: (data: Omit<Categoria, '_id'>) => Promise<Categoria>;
        update: (id: string, data: Partial<Categoria>) => Promise<Categoria>;
        delete: (id: string) => Promise<boolean>;
      };
      homeSkills: {
        get: () => Promise<HomeSkills>;
        update: (data: HomeSkills) => Promise<HomeSkills>;
      };
      homeExperience: {
        get: () => Promise<HomeExperience>;
        update: (data: HomeExperience) => Promise<HomeExperience>;
      };
      homeProjects: {
        get: () => Promise<HomeProjects>;
        update: (data: HomeProjects) => Promise<HomeProjects>;
      };
      homeEducation: {
        get: () => Promise<HomeEducation>;
        update: (data: HomeEducation) => Promise<HomeEducation>;
      };
      homeAbout: {
        get: () => Promise<HomeAbout>;
        update: (data: HomeAbout) => Promise<HomeAbout>;
      };
      homeCertifications: {
        get: () => Promise<HomeCertifications>;
        update: (data: HomeCertifications) => Promise<HomeCertifications>;
      };
      homeHero: {
        get: () => Promise<HomeHero>;
        update: (data: HomeHero) => Promise<HomeHero>;
      };
      homeContact: {
        get: () => Promise<HomeContact>;
        update: (data: HomeContact) => Promise<HomeContact>;
      };
      homeCallToAction: {
        get: () => Promise<HomeCallToAction>;
        update: (data: HomeCallToAction) => Promise<HomeCallToAction>;
      };
      experience: {
        getAll: () => Promise<Experience[]>;
        getById: (id: string) => Promise<Experience>;
        create: (data: Omit<Experience, '_id'>) => Promise<Experience>;
        update: (id: string, data: Partial<Experience>) => Promise<Experience>;
        delete: (id: string) => Promise<boolean>;
      };
      projects: {
        getAll: () => Promise<Project[]>;
        getById: (id: string) => Promise<Project>;
        create: (data: Omit<Project, '_id'>) => Promise<Project>;
        update: (id: string, data: Partial<Project>) => Promise<Project>;
        delete: (id: string) => Promise<boolean>;
      };
      techs: {
        getAll: () => Promise<Tech[]>;
        getById: (id: string) => Promise<Tech>;
        create: (data: Omit<Tech, '_id'>) => Promise<Tech>;
        update: (id: string, data: Partial<Tech>) => Promise<Tech>;
        delete: (id: string) => Promise<boolean>;
      };
      education: {
        getAll: () => Promise<Education[]>;
        getById: (id: string) => Promise<Education>;
        create: (data: Omit<Education, '_id'>) => Promise<Education>;
        update: (id: string, data: Partial<Education>) => Promise<Education>;
        delete: (id: string) => Promise<boolean>;
        getByType: (tipo: "formacion" | "certificacion") => Promise<Education[]>;
        getByStatus: (estado: "En curso" | "Completado" | "Abandonado") => Promise<Education[]>;
      };
    };
  }
}

export type BloqueResumen = {
  id?: string;
  titulo: string;
  contenido: string;
  orden: number;
};