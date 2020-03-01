const {app, BrowserWindow, Menu} = require('electron');
const url = require("url");
const path = require("path");

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, '/dist/assets/images/ic_launcher_round.png'),
    backgroundColor: '#ffffff'
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
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow()
});
