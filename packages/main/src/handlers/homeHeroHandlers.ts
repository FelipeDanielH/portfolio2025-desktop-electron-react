import { ipcMain } from 'electron';
import { HomeHeroService } from '../services/homeHeroService';

export function registerHomeHeroHandlers(baseURL: string) {
  const homeHeroService = new HomeHeroService(baseURL);

  ipcMain.handle('homeHero:get', async () => {
    return homeHeroService.get();
  });

  ipcMain.handle('homeHero:update', async (_event, data) => {
    return homeHeroService.update(data);
  });
} 