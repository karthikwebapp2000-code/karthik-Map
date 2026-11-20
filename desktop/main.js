// Karthik Map desktop shell: a native window around your hosted Karthik Map website.
const { app, BrowserWindow, Menu, ipcMain, session, shell } = require("electron");
const fs = require("fs");
const path = require("path");

if (!app.requestSingleInstanceLock()) app.quit();

const cfgFile = () => path.join(app.getPath("userData"), "config.json");
const readCfg = () => { try { return JSON.parse(fs.readFileSync(cfgFile(), "utf8")); } catch { return {}; } };
const writeCfg = (patch) => { try { fs.mkdirSync(path.dirname(cfgFile()), { recursive: true }); fs.writeFileSync(cfgFile(), JSON.stringify({ ...readCfg(), ...patch })); } catch { /* ignore */ } };
const bundledUrl = () => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf8")).appUrl; } catch { return ""; } };
const validUrl = (u) => /^https?:\/\/[^\s]+$/i.test(u || "") && !/REPLACE/i.test(u);
const appUrl = () => { const u = process.env.APP_URL || readCfg().appUrl || bundledUrl(); return validUrl(u) ? u : null; };
const origin = (u) => { try { return new URL(u).origin; } catch { return ""; } };

let win = null;

function load() {
  const url = appUrl();
  if (!url) return win.loadFile(path.join(__dirname, "setup.html"));
  return win.loadURL(url);
}

function createWindow() {
  const b = readCfg().bounds || { width: 1280, height: 860 };
  win = new BrowserWindow({
    ...b, minWidth: 380, minHeight: 600, show: false, title: "Karthik Map", backgroundColor: "#1c1c1e", autoHideMenuBar: true,
    icon: path.join(__dirname, "build", "icon.png"),
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, sandbox: true, nodeIntegration: false },
  });
  win.once("ready-to-show", () => win.show());
  win.on("close", () => { if (!win.isMaximized() && !win.isMinimized()) writeCfg({ bounds: win.getBounds() }); });

  const isOurs = (u) => { const url = appUrl(); return u.startsWith("file://") || (url && origin(u) === origin(url)); };
  win.webContents.setWindowOpenHandler(({ url }) => { if (isOurs(url)) return { action: "allow" }; if (/^https?:/i.test(url)) shell.openExternal(url); return { action: "deny" }; });
  win.webContents.on("will-navigate", (e, url) => { if (!isOurs(url)) { e.preventDefault(); if (/^https?:/i.test(url)) shell.openExternal(url); } });
  win.webContents.on("did-fail-load", (_e, code, _desc, url, isMain) => {
    if (isMain && code !== -3 && !url.startsWith("file://")) win.loadFile(path.join(__dirname, "offline.html"), { query: { url } });
  });

  const allowed = new Set(["geolocation", "media", "notifications", "clipboard-sanitized-write", "clipboard-read", "fullscreen", "pointerLock"]);
  const trusted = (u) => isOurs(u || "");
  session.defaultSession.setPermissionRequestHandler((_wc, permission, cb, details) => cb(allowed.has(permission) && trusted(details.requestingUrl)));
  session.defaultSession.setPermissionCheckHandler((_wc, permission, requestingOrigin) => allowed.has(permission) && trusted(requestingOrigin));

  void load();
}

ipcMain.handle("km:set-url", (_e, url) => {
  const u = String(url || "").trim().replace(/\/+$/, "");
  if (!validUrl(u)) return { ok: false, error: "Enter a full web address starting with https://" };
  writeCfg({ appUrl: u }); void win.loadURL(u); return { ok: true };
});
ipcMain.handle("km:retry", () => { void load(); });
ipcMain.handle("km:current-url", () => appUrl() || "");

app.on("second-instance", () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: "Karthik Map", submenu: [
      { label: "Reload", accelerator: "CmdOrCtrl+R", click: () => win && win.reload() },
      { label: "Full screen", accelerator: "F11", click: () => win && win.setFullScreen(!win.isFullScreen()) },
      { label: "Zoom in", accelerator: "CmdOrCtrl+Plus", click: () => win && win.webContents.setZoomLevel(win.webContents.getZoomLevel() + 0.5) },
      { label: "Zoom out", accelerator: "CmdOrCtrl+-", click: () => win && win.webContents.setZoomLevel(win.webContents.getZoomLevel() - 0.5) },
      { label: "Change site address…", click: () => win && win.loadFile(path.join(__dirname, "setup.html")) },
      { type: "separator" }, { role: "quit" } ] },
    { role: "editMenu" },
  ]));
  createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
