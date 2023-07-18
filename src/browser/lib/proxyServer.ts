import path from 'path'
import fs from 'fs'
import httpProxy from 'http-proxy'
import http from 'http'

let server: httpProxy | null = null

export const stopProxyServer = () =>
  new Promise<void>((resolve) => {
    if (server !== null) {
      server.close(() => {
        server = null
        console.log('Stopped proxy server')
        resolve()
      })
      return
    }

    resolve()
  })

export const startProxyServer = async ({ targetUrl, listenPort, enableHttps, enableWs }: StartProxyServerArgs) => {
  await stopProxyServer()

  server = httpProxy
    .createProxyServer({
      target: targetUrl,
      ssl: enableHttps
        ? {
            key: fs.readFileSync(path.resolve(__dirname, '../localhost-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, '../localhost.pem')),
          }
        : false,
      // see https://github.com/http-party/node-http-proxy/issues/1083.
      secure: false,
      ws: enableWs,
      changeOrigin: true,
      autoRewrite: true,
    })
    .on('error', (err, _, res) => {
      if (res instanceof http.ServerResponse) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify({ message: err.message }))
        res.end()
      } else {
        // WebSocket
        const socket = res
        socket.write(JSON.stringify({ message: err.message }))
      }

      console.log('Proxy server error: \n', err)
    })
    .listen(listenPort)

  console.log('Start proxy server')
}
