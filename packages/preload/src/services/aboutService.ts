// Servicio modular para los endpoints de 'about'
// Sigue principios SOLID y Clean Architecture

export interface AboutBlock {
  titulo: string;
  descripcion: string;
  orden: number;
  id?: string;
}

export const aboutService = {
  async getAll(baseURL: string): Promise<AboutBlock[] | null> {
    try {
      const res = await fetch(`${baseURL}/about`);
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error('❌ Error al obtener bloques About:', e);
      return null;
    }
  },
  async create(baseURL: string, data: Omit<AboutBlock, 'id'>): Promise<AboutBlock | null> {
    try {
      const res = await fetch(`${baseURL}/about`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error('❌ Error al crear bloque About:', e);
      return null;
    }
  },
  async update(baseURL: string, id: string, data: Partial<AboutBlock>): Promise<AboutBlock | null> {
    try {
      const res = await fetch(`${baseURL}/about/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return await res.json();
    } catch (e) {
      console.error('❌ Error al actualizar bloque About:', e);
      return null;
    }
  },
  async remove(baseURL: string, id: string): Promise<boolean> {
    try {
      const res = await fetch(`${baseURL}/about/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return true;
    } catch (e) {
      console.error('❌ Error al eliminar bloque About:', e);
      return false;
    }
  },
}; 