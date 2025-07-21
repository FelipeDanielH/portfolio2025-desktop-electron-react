import type { HomeExperience } from '../types/home.types';

export class HomeExperienceService {
  private baseURL: string;
  private endpoint: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.endpoint = 'home/experience';
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
      console.error(`❌ HomeExperienceService: Error in ${this.endpoint}${path}:`, error);
      throw error;
    }
  }

  async get(): Promise<HomeExperience> {
    return this.request<HomeExperience>('');
  }

  async update(data: HomeExperience): Promise<HomeExperience> {
    return this.request<HomeExperience>('', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
} 