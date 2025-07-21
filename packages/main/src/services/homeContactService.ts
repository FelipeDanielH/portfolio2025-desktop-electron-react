import type { HomeContact } from '../types/home.types';

export class HomeContactService {
  private baseURL: string;
  private endpoint: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.endpoint = 'home/contact';
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
      console.error(`❌ HomeContactService: Error in ${this.endpoint}${path}:`, error);
      throw error;
    }
  }

  async get(): Promise<HomeContact> {
    return this.request<HomeContact>('');
  }

  async update(data: HomeContact): Promise<HomeContact> {
    return this.request<HomeContact>('', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
} 