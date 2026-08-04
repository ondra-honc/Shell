const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendCommand: (cmd: string) => ipcRenderer.invoke('run-command', cmd),
    getPwd: () => ipcRenderer.invoke('get-pwd')
});