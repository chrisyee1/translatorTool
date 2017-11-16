const electron = require('electron');
const url = require('url');
const path = require('path');
const randomString = require("randomstring");
const translate = require('google-translate-api');

const {app, BrowserWindow, Menu, ipcMain} = electron;

// SET ENV
//process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', function(){
  // Create new window
  mainWindow = new BrowserWindow({});

  // Load HTML into Window file://__dirname/mainWindow.html
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Quit app when closed
  mainWindow.on('closed', function(){
    app.quit();
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  // Insert menu
  Menu.setApplicationMenu(mainMenu);

});

// Handle create add window
function createAddWindow(){
  // Create new window
  addWindow = new BrowserWindow({
    width: 300,
    height: 250,
    title: 'Add Test'
  });

  // Load HTML into Window file://__dirname/mainWindow.html
  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Garbage collection handle
  addWindow.on('close', function(){
    addWindow = null;
  });
}

// Catch item:add
ipcMain.on('item:add', function(e, item){
  console.log(item);
  translate(item, {from: 'ja', to: 'en'}).then(res => {
    console.log(res.text);
    mainWindow.webContents.send('item:add', item, res.text);
  }).catch(err => {
      console.error(err);
  });
  //mainWindow.webContents.send('item:add', item, item2);
  addWindow.close();
});

// Create menu template
const mainMenuTemplate = [
  {
    label:'File',
    submenu: [
      {
        label: 'Add Item',
        click(){
          createAddWindow();
        }
      },
      {
        label: 'Clear Items',
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Exit',
        accelerator: process.platform  == 'darwin' ? 'Command+Q' :
          'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  }
];

// If Mac, add empty object to menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

// Add developer tools item if not in production
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform  == 'darwin' ? 'Command+I' :
          'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        label: 'Add Test Item',
        accelerator: process.platform  == 'darwin' ? 'Command+D' :
          'Ctrl+D',
        click(){
          mainWindow.webContents.send('item:add', randomString.generate(), randomString.generate());
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}