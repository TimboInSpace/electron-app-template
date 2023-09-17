const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');

var connection = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

var mainWindow;

const createMainWindow = () => {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

const createAboutWindow = () => {
  const aboutWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    title: 'About',
    width: 300,
    height: 400,
  });
  aboutWindow.setMenu(null);
  aboutWindow.loadURL(ABOUT_WINDOW_WEBPACK_ENTRY);
};



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // Connect to the database
  //connection = require('./database.js').getConnection();
  //console.log(await connection.getData());

  // Establish all IPC callbacks:
  ipcMain.handle('ping', () => {return 'pong'});

  createMainWindow();
  // Implement the menu:
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
});


// Create a menu template
const menu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        click: () => { app.quit() },
        accelerator: 'CmdOrCtrl+Q'
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About',
        click: createAboutWindow
      }
    ]
  },
];

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (connection) {
      connection.disconnect();
    }
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
