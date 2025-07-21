import { useState, useEffect, useCallback } from 'react';
import type { Tech, TechFormData } from '../../types/projects.types';

interface UseTechsReturn {
  techs: Tech[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  getAll: () => Promise<void>;
  create: (data: TechFormData) => Promise<void>;
  update: (id: string, data: Partial<Tech>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  clearMessages: () => void;
}

// Datos de ejemplo para testing cuando el backend está vacío
const techsEjemplo: Tech[] = [
  // Frameworks
  { _id: "1", tipo: "framework", nombre: "React" },
  { _id: "2", tipo: "framework", nombre: "Vue.js" },
  { _id: "3", tipo: "framework", nombre: "Angular" },
  { _id: "4", tipo: "framework", nombre: "Next.js" },
  { _id: "5", tipo: "framework", nombre: "Express" },
  { _id: "6", tipo: "framework", nombre: "FastAPI" },
  { _id: "7", tipo: "framework", nombre: "Django" },
  { _id: "8", tipo: "framework", nombre: "Laravel" },
  
  // Lenguajes
  { _id: "9", tipo: "lenguaje", nombre: "JavaScript" },
  { _id: "10", tipo: "lenguaje", nombre: "TypeScript" },
  { _id: "11", tipo: "lenguaje", nombre: "Python" },
  { _id: "12", tipo: "lenguaje", nombre: "Java" },
  { _id: "13", tipo: "lenguaje", nombre: "C#" },
  { _id: "14", tipo: "lenguaje", nombre: "PHP" },
  { _id: "15", tipo: "lenguaje", nombre: "Go" },
  { _id: "16", tipo: "lenguaje", nombre: "Rust" },
  
  // Roles
  { _id: "17", tipo: "rol", nombre: "Frontend" },
  { _id: "18", tipo: "rol", nombre: "Backend" },
  { _id: "19", tipo: "rol", nombre: "Full Stack" },
  { _id: "20", tipo: "rol", nombre: "DevOps" },
  { _id: "21", tipo: "rol", nombre: "Mobile" },
  { _id: "22", tipo: "rol", nombre: "UI/UX" },
  
  // Herramientas
  { _id: "23", tipo: "herramienta", nombre: "Docker" },
  { _id: "24", tipo: "herramienta", nombre: "Git" },
  { _id: "25", tipo: "herramienta", nombre: "AWS" },
  { _id: "26", tipo: "herramienta", nombre: "Vercel" },
  { _id: "27", tipo: "herramienta", nombre: "Figma" },
  { _id: "28", tipo: "herramienta", nombre: "PostgreSQL" },
  { _id: "29", tipo: "herramienta", nombre: "MongoDB" },
  { _id: "30", tipo: "herramienta", nombre: "Redis" }
];

export function useTechs(): UseTechsReturn {
  const [techs, setTechs] = useState<Tech[]>([]);
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
      
      const data = await window.electronAPI.techs.getAll();
      
      // Si no hay datos en el backend, usar datos de ejemplo
      if (!data || data.length === 0) {
        console.log('📝 No hay tecnologías en el backend, usando datos de ejemplo');
        setTechs(techsEjemplo);
      } else {
        setTechs(data);
      }
    } catch (err) {
      console.error('❌ useTechs: Error getting techs:', err);
      console.log('📝 Usando datos de ejemplo debido al error');
      setTechs(techsEjemplo);
      setError(err instanceof Error ? err.message : 'Error al obtener tecnologías');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: TechFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newTech = await window.electronAPI.techs.create(data);
      setTechs(prev => [...prev, newTech]);
      setSuccessMessage('Tecnología creada exitosamente');
    } catch (err) {
      console.error('❌ useTechs: Error creating tech:', err);
      setError(err instanceof Error ? err.message : 'Error al crear tecnología');
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: string, data: Partial<Tech>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedTech = await window.electronAPI.techs.update(id, data);
      setTechs(prev => prev.map(tech => tech._id === id ? updatedTech : tech));
      setSuccessMessage('Tecnología actualizada exitosamente');
    } catch (err) {
      console.error('❌ useTechs: Error updating tech:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar tecnología');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTech = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await window.electronAPI.techs.delete(id);
      setTechs(prev => prev.filter(tech => tech._id !== id));
      setSuccessMessage('Tecnología eliminada exitosamente');
    } catch (err) {
      console.error('❌ useTechs: Error deleting tech:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar tecnología');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar tecnologías al montar el hook
  useEffect(() => {
    getAll();
  }, [getAll]);

  return {
    techs,
    loading,
    error,
    successMessage,
    getAll,
    create,
    update,
    delete: deleteTech,
    clearMessages,
  };
} 