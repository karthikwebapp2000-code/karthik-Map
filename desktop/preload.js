const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("kmDesktop", {
  setUrl: (u) => ipcRenderer.invoke("km:set-url", u),
  retry: () => ipcRenderer.invoke("km:retry"),
  currentUrl: () => ipcRenderer.invoke("km:current-url"),
});
