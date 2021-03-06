const electron = require('electron');
const url = require('url');
const path = require('path');
const randomString = require("randomstring");
const translate = require('google-translate-api');
const hello = require('./bin/linux-x64-54/translatorTool')

const {app, BrowserWindow, Menu, ipcMain} = electron;

// SET ENV
//process.env.NODE_ENV = 'production';

let mainWindow;
let processWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', function(){
  // Create new window
  console.log(hello.hello());
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
  processWindow.close();
});

// Catch item:add
ipcMain.on('process:open', function(e){
  createProcessWindow();
});

// Handle create add window
function createProcessWindow(){
  // Create new window
  processWindow = new BrowserWindow({
    width: 500,
    height: 250,
    title: 'Process List'
  });

  // Load HTML into Window file://__dirname/mainWindow.html
  processWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'processWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Garbage collection handle
  processWindow.on('close', function(){
    processWindow = null;
  });
}

function createAddWindow(){
  // Create new window
  processWindow = new BrowserWindow({
    width: 300,
    height: 250,
    title: 'Add Test'
  });

  // Load HTML into Window file://__dirname/mainWindow.html
  processWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Garbage collection handle
  processWindow.on('close', function(){
    processWindow = null;
  });
}

// Create menu template
const mainMenuTemplate = [
  {
    label:'File',
    submenu: [
      {
        label: 'Process List',
        click(){
          createProcessWindow();
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
        label: 'Open Add Item Window',
        click(){
          createAddWindow();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}