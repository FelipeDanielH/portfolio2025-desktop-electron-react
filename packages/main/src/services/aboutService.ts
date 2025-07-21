import { AboutBlock } from '../types/about.types';

export class AboutService {
  constructor(private baseURL: string) {}

  async getAll(): Promise<AboutBlock[]> {
    try {
      const response = await fetch(`${this.baseURL}/about`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Mapear _id a id para compatibilidad con el frontend
      const bloquesMapeados = data.map((bloque: any) => ({
        ...bloque,
        id: bloque._id, // Mapear _id a id
        _id: bloque._id // Mantener _id también
      }));
      
      return bloquesMapeados;
    } catch (error) {
      console.error('❌ SERVICE: Error al obtener bloques About:', error);
      throw error;
    }
  }

  async create(data: Omit<AboutBlock, 'id'>): Promise<AboutBlock> {
    try {
      const response = await fetch(`${this.baseURL}/about`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const nuevoBloque = await response.json();
      
      // Mapear _id a id para compatibilidad
      return {
        ...nuevoBloque,
        id: nuevoBloque._id,
        _id: nuevoBloque._id
      };
    } catch (error) {
      console.error('❌ SERVICE: Error al crear bloque About:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<AboutBlock>): Promise<AboutBlock | null> {
    try {
      const response = await fetch(`${this.baseURL}/about/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const bloqueActualizado = await response.json();
      
      // Mapear _id a id para compatibilidad
      return {
        ...bloqueActualizado,
        id: bloqueActualizado._id,
        _id: bloqueActualizado._id
      };
    } catch (error) {
      console.error('❌ SERVICE: Error al actualizar bloque About:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseURL}/about/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return true;
  }
} 