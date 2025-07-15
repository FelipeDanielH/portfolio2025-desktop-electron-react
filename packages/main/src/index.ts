import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Cargar variables desde el .env en la raíz del proyecto
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const baseURL = process.env.VITE_BACKEND_URL || 'http://localhost:4000';
console.log('📦 Backend URL cargada desde .env:', baseURL);

// Canal IPC para exponer la URL al preload
ipcMain.handle('get-backend-url', () => baseURL);

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

  win.loadURL('http://localhost:5173');
  // win.webContents.openDevTools(); // Solo para desarrollo
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
