import { ipcMain } from 'electron';
import { HeroService } from '../services/heroService';

export function registerHeroHandlers(heroService: HeroService) {
  ipcMain.handle('api:hero:get', async () => {
    return heroService.get();
  });

  ipcMain.handle('api:hero:update', async (_event, data) => {
    return heroService.update(data);
  });
} 