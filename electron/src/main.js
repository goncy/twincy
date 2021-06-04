
const { exec } = require('child_process');
const path = require('path');
const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');

// If installing, quit
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Create windiws
function createWindow () {
  const main = new BrowserWindow({
    width: 1024,
    height: 768,
    autoHideMenuBar: true,
    show: false,
    backgroundColor: '#5C16C5',
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, '/assets/icon.png')
  });
  const splash = new BrowserWindow({
    width: 810,
    height: 610,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    icon: path.join(__dirname, '/assets/icon.png')
  });

  // Load the splash
  splash.loadFile(path.join(__dirname, '/splash.html'));
  main.loadURL('http://localhost:8000/admin');

  // If server is not ready, try again
  main.webContents.on('did-fail-load', () => {
    main.loadURL('http://localhost:8000/admin');
  });

  // Remove splash when app is ready
  main.webContents.on('did-stop-loading', () => {
    splash.destroy();
    main.show();
  });
}

app.whenReady().then(() => {
  if (isDev) {
    exec('cd .. && npm run dev');
  } else {
    require('../packages/server/dist/app');
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
