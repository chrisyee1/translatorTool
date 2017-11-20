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