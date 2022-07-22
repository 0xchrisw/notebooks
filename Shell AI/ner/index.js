const { app, BrowserWindow } = require('electron');
const path = require('path')


// If development environment
const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  try {
      require( 'electron-reloader' )( module, {
          debug: true,
          watchRenderer: true
      } );
  } catch (_) { console.log( 'Error' ); }
}


function createWindow ( ) {
  const win = new BrowserWindow( {
    show: false,
    title: 'NER Tagger',
    //darkTheme: true, // Only works on some GTK+3 desktop environments.
    // icon: './app/assets/img/icon.png',  // TODO
    backgroundColor: '#2e2c29',
    //opacity: 0.75,
    x:      0,         // DEV
    y:      0,         // DEV
    width:  1920 / 2,  // DEV
    height: 1047,      // DEV
    webPreferences: {
      accessibleTitle:             'Sneakr',
      nodeIntegration:             true,
      contextIsolation:            false,
      nodeIntegrationInWorker:     true,
      webSecurity:                 false,   // TODO - Research more on this...
      allowRunningInsecureContent: true,    // TODO - Research more on this...
      textAreasAreResizable:       false,
      defaultFontFamily:           'fantasy',
      defaultEncoding:             'UTF-8'
      //preload: 'path/to/preload' // Specifies a scriptto load before other scripts run.
      //enableRemoteModule

    },
    disableAutoHideCursor: true, // Hide cursor when typing.
    autoHideMenuBar: true,  // Auto hide the menu bar unless the Alt key is pressed.
    //devTools: false // Set to `true` in Production
  } )

  // and load the index.html of the app.
  win.loadFile('index.html')
  //win.loadFile(`file://${__dirname}/index.html`)

  // Show window once everything is loaded
  win.once( 'ready-to-show', ( ) => {
    win.show( )

    // Open the DevTools.
    win.webContents.openDevTools()

    // Maximize the window
    //win.maximize( )
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
