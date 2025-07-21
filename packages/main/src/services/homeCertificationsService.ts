import type { HomeCertifications } from '../types/home.types';

export class HomeCertificationsService {
  private baseURL: string;
  private endpoint: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.endpoint = 'home/certifications';
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
      console.error(`❌ HomeCertificationsService: Error in ${this.endpoint}${path}:`, error);
      throw error;
    }
  }

  async get(): Promise<HomeCertifications> {
    return this.request<HomeCertifications>('');
  }

  async update(data: HomeCertifications): Promise<HomeCertifications> {
    return this.request<HomeCertifications>('', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
} 