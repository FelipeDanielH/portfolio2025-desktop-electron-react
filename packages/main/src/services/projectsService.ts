import { BaseService } from './baseService';
import type { Project } from '../types/projects.types';

export class ProjectsService extends BaseService<Project> {
  constructor(baseURL: string) {
    super(baseURL, 'projects');
  }
} 