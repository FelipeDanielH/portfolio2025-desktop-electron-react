import { useState, useEffect, useCallback } from 'react';
import type { Project, ProjectFormData } from '../../types/projects.types';

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  getAll: () => Promise<void>;
  create: (data: ProjectFormData) => Promise<void>;
  update: (id: string, data: Partial<Project>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  clearMessages: () => void;
}

// Datos de ejemplo para testing cuando el backend está vacío
const projectsEjemplo: Project[] = [
  {
    _id: "1",
    nombre: "Portfolio Web",
    descripcion: "Sitio personal desarrollado con Next.js y Tailwind CSS. Incluye secciones para proyectos, habilidades y contacto.",
    tecnologias: ["React", "Next.js", "TypeScript"],
    roles: ["Frontend", "Full Stack"],
    frameworks: ["Next.js", "Tailwind CSS"],
    lenguajes: ["TypeScript", "JavaScript"],
    herramientas: ["Vercel", "Git"],
    estado: "completado",
    año: 2024,
    imagen: "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Portfolio+Web",
    links: {
      demo: "https://portfolio.vercel.app",
      github: "https://github.com/miusuario/portfolio",
      frontend: "https://github.com/miusuario/portfolio-frontend"
    }
  },
  {
    _id: "2",
    nombre: "API de Gestión de Tareas",
    descripcion: "API REST para gestión de tareas con autenticación JWT y base de datos PostgreSQL. Incluye CRUD completo y filtros avanzados.",
    tecnologias: ["Node.js", "Express", "PostgreSQL"],
    roles: ["Backend", "Full Stack"],
    frameworks: ["Express", "Sequelize"],
    lenguajes: ["JavaScript", "SQL"],
    herramientas: ["Docker", "PostgreSQL", "JWT"],
    estado: "completado",
    año: 2023,
    imagen: "https://via.placeholder.com/400x300/10B981/FFFFFF?text=API+Tareas",
    links: {
      github: "https://github.com/miusuario/tasks-api",
      backend: "https://github.com/miusuario/tasks-api-backend"
    }
  },
  {
    _id: "3",
    nombre: "App de E-commerce",
    descripcion: "Aplicación de comercio electrónico con carrito de compras, pagos con Stripe y panel de administración.",
    tecnologias: ["React", "Node.js", "MongoDB"],
    roles: ["Full Stack"],
    frameworks: ["React", "Express", "Mongoose"],
    lenguajes: ["JavaScript", "TypeScript"],
    herramientas: ["Stripe", "MongoDB", "AWS"],
    estado: "en desarrollo",
    año: 2024,
    imagen: "https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=E-commerce+App",
    links: {
      demo: "https://ecommerce-app.vercel.app",
      github: "https://github.com/miusuario/ecommerce-app",
      frontend: "https://github.com/miusuario/ecommerce-frontend",
      backend: "https://github.com/miusuario/ecommerce-backend"
    }
  }
];

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearMessages = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
  }, []);

  const getAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await window.electronAPI.projects.getAll();
      
      // Si no hay datos en el backend, usar datos de ejemplo
      if (!data || data.length === 0) {
        console.log('📝 No hay proyectos en el backend, usando datos de ejemplo');
        setProjects(projectsEjemplo);
      } else {
        setProjects(data);
      }
    } catch (err) {
      console.error('❌ useProjects: Error getting projects:', err);
      console.log('📝 Usando datos de ejemplo debido al error');
      setProjects(projectsEjemplo);
      setError(err instanceof Error ? err.message : 'Error al obtener proyectos');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: ProjectFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newProject = await window.electronAPI.projects.create(data);
      setProjects(prev => [...prev, newProject]);
      setSuccessMessage('Proyecto creado exitosamente');
    } catch (err) {
      console.error('❌ useProjects: Error creating project:', err);
      setError(err instanceof Error ? err.message : 'Error al crear proyecto');
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: string, data: Partial<Project>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedProject = await window.electronAPI.projects.update(id, data);
      setProjects(prev => prev.map(project => project._id === id ? updatedProject : project));
      setSuccessMessage('Proyecto actualizado exitosamente');
    } catch (err) {
      console.error('❌ useProjects: Error updating project:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar proyecto');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await window.electronAPI.projects.delete(id);
      setProjects(prev => prev.filter(project => project._id !== id));
      setSuccessMessage('Proyecto eliminado exitosamente');
    } catch (err) {
      console.error('❌ useProjects: Error deleting project:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar proyecto');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar proyectos al montar el hook
  useEffect(() => {
    getAll();
  }, [getAll]);

  return {
    projects,
    loading,
    error,
    successMessage,
    getAll,
    create,
    update,
    delete: deleteProject,
    clearMessages,
  };
} 