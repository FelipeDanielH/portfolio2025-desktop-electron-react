import { BaseService } from './baseService';
import type { Tech } from '../types/projects.types';

export class TechsService extends BaseService<Tech> {
  constructor(baseURL: string) {
    super(baseURL, 'techs');
  }
} 