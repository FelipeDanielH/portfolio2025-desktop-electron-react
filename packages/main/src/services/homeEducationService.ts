import type { HomeEducation } from '../types/home.types';

export class HomeEducationService {
  private baseURL: string;
  private endpoint: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.endpoint = 'home/education';
  }

  private async request<R>(
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
      console.error(`❌ HomeEducationService: Error in ${this.endpoint}${path}:`, error);
      throw error;
    }
  }

  async get(): Promise<HomeEducation> {
    return this.request<HomeEducation>('');
  }

  async update(data: HomeEducation): Promise<HomeEducation> {
    return this.request<HomeEducation>('', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
} 