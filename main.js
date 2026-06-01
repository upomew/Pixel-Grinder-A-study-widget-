const { app, BrowserWindow } = require("electron")
const path = require("path")

function createWindow() {
  const win = new BrowserWindow({
  width: 220,
  height: 365,
  resizable: false,
  transparent: true,
  frame: false,
  useContentSize: true,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  
  }
})

  win.setMenu(null)
  win.loadFile("index.html")
}

app.whenReady().then(createWindow)