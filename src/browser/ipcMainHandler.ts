import { ipcMain } from 'electron'
import { ipcChannels } from '../common/ipcChannels'
import { loadStore, saveStore } from './lib/store'
import { startProxyServer, stopProxyServer } from './lib/proxyServer'
import { getHostIpAddress } from './lib/ipAddress'

export const handleIpcMain = () => {
  ipcMain.handle(ipcChannels.GET_HOST_IP_ADDRESS, async () => {
    return getHostIpAddress()
  })

  ipcMain.handle(ipcChannels.LOAD_SETTING, async () => {
    return loadStore()
  })

  ipcMain.handle(ipcChannels.START_PROXY_SERVER, async (_event, args: StartProxyServerArgs) => {
    saveStore(args)
    await startProxyServer(args)
  })

  ipcMain.handle(ipcChannels.STOP_PROXY_SERVER, async () => {
    await stopProxyServer()
  })
}
