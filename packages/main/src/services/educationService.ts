import { BaseService } from './baseService';
import type { Education } from '../types/education.types';

export class EducationService extends BaseService<Education> {
  constructor(baseURL: string) {
    super(baseURL, 'education');
  }

  async getByType(tipo: "formacion" | "certificacion"): Promise<Education[]> {
    return this.request<Education[]>(`?tipo=${tipo}`);
  }

  async getByStatus(estado: "En curso" | "Completado" | "Abandonado"): Promise<Education[]> {
    return this.request<Education[]>(`?estado=${estado}`);
  }
} 