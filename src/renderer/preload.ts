import { contextBridge, ipcRenderer } from 'electron'
import { ipcChannels } from '../common/ipcChannels'

contextBridge.exposeInMainWorld('electronAPI', {
  loadSetting: () => ipcRenderer.invoke(ipcChannels.LOAD_SETTING),

  startProxyServer: (args: StartProxyServerArgs) => ipcRenderer.invoke(ipcChannels.START_PROXY_SERVER, args),
  stopProxyServer: () => ipcRenderer.invoke(ipcChannels.STOP_PROXY_SERVER),
})
