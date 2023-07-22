type Setting = {
  targetUrls: Array<string>
  listenHosts: Array<string>
  listenPort: number
  enableHttps: boolean
  enableWs: boolean
  isNextJs12: boolean
}

type StartProxyServerArgs = Omit<Setting, 'targetUrls' | 'listenHosts'> & {
  targetUrl: string
  listenHost: string
}
