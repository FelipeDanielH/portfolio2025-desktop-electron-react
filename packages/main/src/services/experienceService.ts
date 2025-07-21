import { BaseService } from './baseService';
import type { Experience } from '../types/experience.types';

export class ExperienceService extends BaseService<Experience> {
  constructor(baseURL: string) {
    super(baseURL, 'experience');
  }
} 