const path = require('path')
const os = require('os')
const { app, BrowserWindow, Menu, globalShortcut, ipcMain, shell } = require("electron")
const log = require('electron-log')

const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const slash = require('slash')

// set env
process.env.NODE_ENV = "production"

const isDev = process.env.NODE_ENV !== "production" ? true : false
const isMac = process.platform === "darwin" ? true : false

//vars
let mainWindow

function createMainWindow() {
  mainWindow = new BrowserWindow({
    // set properties of the new window
    title: "ImageShrink", // it is overwritten by the title of the index.html
    width: isDev ? 800 : 500,
    height: 600,
    icon: `${__dirname}/assets/icons/icons/Icon_256x256.png`, // icon path always has to be the absolute path
    resizable: isDev ? true : false,
    backgroundColor: "White",
    webPreferences: {
      nodeIntegration: true,
    },
  })
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
  // set file which is loaded
  mainWindow.loadFile("./app/index.html") // as an alternative i could use: mainWindow.loadURL(`file://${__dirname}/app/index.html`)
}
function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    // set properties of the new window
    title: "ImageShrink", // it is overwritten by the title of the index.html
    width: 300,
    height: 300,
    icon: `${__dirname}/assets/icons/icons/Icon_256x256.png`, // icon path always has to be the absolute path
    backgroundColor: "White",
  })
  // set file which is loaded
  aboutWindow.loadFile("./app/about.html") // as an alternative i could use: aboutWindow.loadURL(`file://${__dirname}/app/index.html`)
}

// app.on("ready", createMainWindow)
// in cause of garbage collection use an anonymous function
app.on("ready", () => {
  createMainWindow()
  // set a global shortcut
  globalShortcut.register("CmdOrCtrl+R", () => mainWindow.reload())
  globalShortcut.register(isMac ? "Command+Alt+J" : "Ctrl+Shift+J", () =>
    mainWindow.toggleDevTools()
  )

  // create Menu
  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)

  mainWindow.on("close", () => (mainWindow = null))
})
// define menu
const menu = [
  ...(isMac ? [{ role: "Menu" }] : []),
  {
    // do it manually:
    //  label: 'File',
    //  submenu: [
    //    {
    //      label: 'Quit',
    //      accelerator: 'CmdOrCtrl+Q',
    //      click: () => app.quit()/home/johannes/Sonstiges/Programmieren/javascript/electron/udemy/electron_from_scratch/imageShrink/app/webfonts
    //    }
    //  ]

    // do it quickly
    role: "fileMenu",
  },
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            {
              label: "DevTools",
              accelerator: "CmdOrCtrl+Shift+j",
              click: () => mainWindow.toggleDevTools(),
            },
          ],
        },
      ]
    : []),
  {
    label: "Help", //app.name,
    submenu: [
      {
        label: "About",
        click: createAboutWindow,
      },
    ],
  },
]

// get(catch) values of vars of the subwindows
// listen to some keys(channels) ) 
ipcMain.on('image:minimize' , (e, valuesOfIndexWindow) => {
  valuesOfIndexWindow.dest = path.join(os.homedir(), 'imageshrink')
  console.log(valuesOfIndexWindow)
  shrinkImage(valuesOfIndexWindow)
})

async function shrinkImage({ imgPath, quality, dest }) {
  try {
    const pngQualtity = quality / 100

    const files = await imagemin([slash(imgPath)], {
      destination: dest,
      plugins: [
        imageminMozjpeg({ quality }),
        imageminPngquant({
          quality: [pngQualtity, pngQualtity]
        })
      ]
    })

    console.log(files)
    log.info(files)
    // open directory on hostsystem (os)
    // shell.openPath(dest)
    mainWindow.webContents.send('image:done')
  } catch (err) {
    console.log(err)
    log.error(err)
  }

}

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit()
  }
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

app.allowRendererProcessReuse = true
