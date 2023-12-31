import { contextBridge, ipcRenderer } from 'electron'
import { ipcChannels } from '../common/ipcChannels'

declare global {
  interface Window {
    electronAPI: {
      loadImage: (url: string) => Promise<string>
      getHostIpAddress: () => Promise<string[]>
      loadSetting: () => Promise<Setting>
      startProxyServer: (args: StartProxyServerArgs) => Promise<void>
      stopProxyServer: () => Promise<void>
    }
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  loadImage: (url: string) => ipcRenderer.invoke(ipcChannels.IMAGE_LOAD, url),
  getHostIpAddress: () => ipcRenderer.invoke(ipcChannels.GET_HOST_IP_ADDRESS),
  loadSetting: () => ipcRenderer.invoke(ipcChannels.LOAD_SETTING),

  startProxyServer: (args: StartProxyServerArgs) => ipcRenderer.invoke(ipcChannels.START_PROXY_SERVER, args),
  stopProxyServer: () => ipcRenderer.invoke(ipcChannels.STOP_PROXY_SERVER),
})
