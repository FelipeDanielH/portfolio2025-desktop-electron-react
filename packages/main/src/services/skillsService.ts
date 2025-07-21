import { BaseService } from './baseService';
import type { Skill, Categoria, HomeSkills } from '../types/skills.types';

export class SkillsService extends BaseService<Skill> {
  constructor(baseURL: string) {
    super(baseURL, 'skills/skills');
  }

  // Métodos específicos para skills si son necesarios
  async getByCategoria(categoriaId: string): Promise<Skill[]> {
    return this.request<Skill[]>(`?categoria_id=${categoriaId}`);
  }

  async getByNivel(nivel: string): Promise<Skill[]> {
    return this.request<Skill[]>(`?nivel=${nivel}`);
  }

  // Método para obtener skills ordenados
  async getOrdered(): Promise<Skill[]> {
    const skills = await this.getAll();
    return skills.sort((a, b) => (a.orden || 1) - (b.orden || 1));
  }
}

export class CategoriesService extends BaseService<Categoria> {
  constructor(baseURL: string) {
    super(baseURL, 'skills/categorias');
  }

  // Métodos específicos para categorías
  async getOrdered(): Promise<Categoria[]> {
    const categorias = await this.getAll();
    return categorias.sort((a, b) => a.orden - b.orden);
  }
}

export class HomeSkillsService {
  constructor(private baseURL: string) {}

  async get(): Promise<HomeSkills> {
    return this.request<HomeSkills>('/home/skills');
  }

  async update(data: HomeSkills): Promise<HomeSkills> {
    return this.request<HomeSkills>('/home/skills', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${path}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ SERVICE: Error in ${path}:`, error);
      throw error;
    }
  }
} 