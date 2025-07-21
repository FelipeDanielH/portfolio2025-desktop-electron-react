import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { registerAllHandlers } from './handlers';
import * as fs from 'fs';
import { ipcMain } from 'electron';

// Solo cargar dotenv en desarrollo, y solo si está disponible
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== undefined) {
  try {
    require.resolve('dotenv');
    require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
  } catch (e) {
    // Ignora si dotenv no está instalado o no hay .env
  }
}

function getConfigPath() {
  return path.join(app.getPath('userData'), 'config.json');
}

function getBackendUrl() {
  if (app.isPackaged) {
    const configPath = getConfigPath();
    console.log('Intentando leer config.json en:', configPath);
    try {
      const raw = fs.readFileSync(configPath, 'utf-8');
      console.log('Contenido leído de config.json:', raw);
      const config = JSON.parse(raw);
      return config.backendUrl || 'https://tu-backend.com';
    } catch (e) {
      console.error('Error leyendo config.json:', e);
      return 'https://tu-backend.com';
    }
  } else {
    return process.env.VITE_BACKEND_URL || 'http://localhost:4000';
  }
}

const baseURL = getBackendUrl();

// Exponer la URL por IPC
ipcMain.handle('get-backend-url', () => {
  console.log('URL backend usada:', getBackendUrl());
  return getBackendUrl();
});

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.resolve(__dirname, '../../preload/dist/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.resolve(__dirname, '../../renderer/dist/index.html'));
  } else {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools(); 
  }

 
};

app.whenReady().then(() => {
  registerAllHandlers(baseURL);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
