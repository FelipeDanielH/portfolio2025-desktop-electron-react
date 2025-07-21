import type { HomeHero } from '../types/home.types';

export class HomeHeroService {
  private baseURL: string;
  private endpoint: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.endpoint = 'home/hero';
  }

  private async request<R>(
    path: string = '',
    options: RequestInit = {}
  ): Promise<R> {
    const url = `${this.baseURL}/${this.endpoint}${path}`;
    console.log('[HomeHeroService] Intentando fetch:', url, options);
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      console.log('[HomeHeroService] Respuesta recibida:', response.status, response.statusText);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[HomeHeroService] Error HTTP:', errorData, response.status);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      const data = await response.json();
      console.log('[HomeHeroService] Datos recibidos:', data);
      return data;
    } catch (error) {
      console.error('[HomeHeroService] Error en fetch:', error);
      throw error;
    }
  }

  async get(): Promise<HomeHero> {
    return this.request<HomeHero>('');
  }

  async update(data: HomeHero): Promise<HomeHero> {
    return this.request<HomeHero>('', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
} 