import { ipcMain } from 'electron';
import { SkillsService, CategoriesService, HomeSkillsService } from '../services/skillsService';

export function registerSkillsHandlers(
  skillsService: SkillsService,
  categoriesService: CategoriesService,
  homeSkillsService: HomeSkillsService
) {
  // Skills handlers
  ipcMain.handle('api:skills:getAll', async () => {
    return skillsService.getAll();
  });

  ipcMain.handle('api:skills:getOrdered', async () => {
    return skillsService.getOrdered();
  });

  ipcMain.handle('api:skills:getById', async (_event, id: string) => {
    return skillsService.getById(id);
  });

  ipcMain.handle('api:skills:create', async (_event, data: any) => {
    return skillsService.create(data);
  });

  ipcMain.handle('api:skills:update', async (_event, id: string, data: any) => {
    return skillsService.update(id, data);
  });

  ipcMain.handle('api:skills:delete', async (_event, id: string) => {
    return skillsService.delete(id);
  });

  ipcMain.handle('api:skills:getByCategoria', async (_event, categoriaId: string) => {
    return skillsService.getByCategoria(categoriaId);
  });

  ipcMain.handle('api:skills:getByNivel', async (_event, nivel: string) => {
    return skillsService.getByNivel(nivel);
  });

  // Categories handlers
  ipcMain.handle('api:categories:getAll', async () => {
    return categoriesService.getAll();
  });

  ipcMain.handle('api:categories:getOrdered', async () => {
    return categoriesService.getOrdered();
  });

  ipcMain.handle('api:categories:getById', async (_event, id: string) => {
    return categoriesService.getById(id);
  });

  ipcMain.handle('api:categories:create', async (_event, data: any) => {
    return categoriesService.create(data);
  });

  ipcMain.handle('api:categories:update', async (_event, id: string, data: any) => {
    return categoriesService.update(id, data);
  });

  ipcMain.handle('api:categories:delete', async (_event, id: string) => {
    return categoriesService.delete(id);
  });

  // Home skills handlers
  ipcMain.handle('api:homeSkills:get', async () => {
    return homeSkillsService.get();
  });

  ipcMain.handle('api:homeSkills:update', async (_event, data: any) => {
    return homeSkillsService.update(data);
  });
} 