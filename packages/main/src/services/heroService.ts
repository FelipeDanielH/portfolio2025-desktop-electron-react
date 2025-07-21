import { HeroConfig } from '../types/hero.types';

export class HeroService {
  constructor(private baseURL: string) {}

  async get(): Promise<HeroConfig> {
    const res = await fetch(`${this.baseURL}/home/hero`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json();
  }

  async update(data: HeroConfig): Promise<HeroConfig> {
    const res = await fetch(`${this.baseURL}/home/hero`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json();
  }
} 