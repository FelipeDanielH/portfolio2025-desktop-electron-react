import type { BaseEntity } from '../types/base.types';

export abstract class BaseService<T extends BaseEntity> {
  constructor(
    protected baseURL: string,
    protected endpoint: string
  ) {}

  protected async request<R = T>(
    path: string,
    options: RequestInit = {}
  ): Promise<R> {
    const url = `${this.baseURL}/${this.endpoint}${path}`;
    
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
      console.error(`❌ SERVICE: Error in ${this.endpoint}${path}:`, error);
      throw error;
    }
  }

  async getAll(): Promise<T[]> {
    return this.request<T[]>('');
  }

  async getById(id: string): Promise<T> {
    return this.request<T>(`/${id}`);
  }

  async create(data: Omit<T, '_id'>): Promise<T> {
    return this.request<T>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.request<T>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(id: string): Promise<boolean> {
    await this.request(`/${id}`, {
      method: 'DELETE',
    });
    return true;
  }
} 