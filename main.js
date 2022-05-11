const { app, BrowserWindow } = require('electron')
const url = require("url");
const path = require("path");
const { getWindowBoundSettings, saveBounds, getWindowPositionSettings, savePosition } = require('./setting.js')

let mainWindow;

function createWindow() {

    const bounds = getWindowBoundSettings();
    const position = getWindowPositionSettings();

    console.log(bounds);
    console.log(position);

    mainWindow = new BrowserWindow({
        width: bounds[0],
        height: bounds[1],
        x: position[0],
        y: position[1],
        position: position,
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/mini-srs/index.html`),
            protocol: "file:",
            slashes: true
        })
    );

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    mainWindow.on("moved", () => savePosition(mainWindow.getPosition()));
    mainWindow.on("resized", () => saveBounds(mainWindow.getSize()));

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})