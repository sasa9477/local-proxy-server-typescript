import { app, BrowserWindow, Menu } from 'electron'
import { handleIpcMain } from './ipcMainHandler'

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

// see https://www.electronjs.org/ja/docs/latest/tutorial/offscreen-rendering.
app.disableHardwareAcceleration()

// Electronの起動を早くするため、app whenReadyよりも前に呼び出す
Menu.setApplicationMenu(null)

const createWindow = (): void => {
  const win = new BrowserWindow({
    width: 640,
    height: 480,
    backgroundColor: '#222222',
    show: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  // Load the index.html of the app.
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // www.electronjs.org/docs/latest/api/browser-window/#using-the-ready-to-show-event
  win?.once('ready-to-show', () => {
    win?.show()

    if (!app.isPackaged) {
      // Open dev tools
      win?.webContents.openDevTools()

      console.log('electorn-store path: ', app.getPath('userData'))
    }
  })
}

app.on('ready', () => {
  handleIpcMain()
  createWindow()
})

app.on('activate', () => {
  // ドックアイコンがクリックされて他のウィンドウが開いていない時にウィンドウを再作成する
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('window-all-closed', () => {
  // 全てのウィンドウが閉じられた時にアプリを閉じる
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
