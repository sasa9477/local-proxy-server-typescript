type Setting = {
  targetUrls: Array<string>
  listenHosts: Array<string>
  listenPort: number
  enableHttps: boolean
  enableWs: boolean
}

type StartProxyServerArgs = Omit<Setting, 'targetUrls' | 'listenHosts'> & {
  targetUrl: string
  listenHost: string
}

interface Window {
  electronAPI: {
    getHostIpAddress: () => Promise<string[]>
    loadSetting: () => Promise<Setting>
    startProxyServer: (args: StartProxyServerArgs) => Promise<ServerStatus>
    stopProxyServer: () => Promise<ServerStatus>
  }
}
