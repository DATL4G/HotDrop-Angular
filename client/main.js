const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const url = require("url");
const path = require("path");
const os = require("os");

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true
    },
    backgroundColor: '#fafafa'
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '/dist/index.html'),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  mainWindow.removeMenu();
  mainWindow.setMenu(null);
  mainWindow.setMenuBarVisibility(false);
  Menu.setApplicationMenu(null);

  mainWindow.on('closed', function () {
    mainWindow = null
  });

  ipcMain.on('request-peer-data', () => {
    mainWindow.webContents.send('peer-data', { id: null, name: os.hostname() });
  });
}

app.on('ready', () => createWindow());

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

