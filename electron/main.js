const { exec } = require('child_process');
const { app, BrowserWindow } = require('electron')

// Window
function createWindow() {
  const main = new BrowserWindow({
    width: 1024,
    height: 768,
    autoHideMenuBar: true,
    show: false,
    backgroundColor: '#5C16C5',
    titleBarStyle: 'hidden'
  })
  const splash = new BrowserWindow({ width: 810, height: 610, transparent: true, frame: false, alwaysOnTop: true });

  splash.loadFile('splash.html')
  main.loadURL('http://localhost:8000');

  main.webContents.on('did-fail-load', () => {
    main.loadURL('http://localhost:8000');
  })

  main.webContents.on('did-stop-loading', () => {
    splash.destroy();
    main.show();
  })
}

app.whenReady().then(() => {
  exec('npm run dev');

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
