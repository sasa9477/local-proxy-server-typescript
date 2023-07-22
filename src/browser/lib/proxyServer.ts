import path from 'path'
import fs from 'fs'
import httpProxy from 'http-proxy'
import http from 'http'
import { Socket } from 'node:net'

let proxy: httpProxy | null = null
let proxyServer: http.Server | null = null
const connections: Record<string, Socket> = {}

export const stopProxyServer = () =>
  new Promise<void>((resolve) => {
    if (proxyServer !== null) {
      proxyServer.close(() => {
        proxyServer = null
        proxy = null
        console.log('Stopped proxy server')
        resolve()
      })
      Object.values(connections).forEach((connection) => {
        connection.destroy()
      })
      return
    }

    resolve()
  })

export const startProxyServer = async ({
  targetUrl,
  listenPort,
  enableHttps,
  enableWs,
  isNextJs12,
}: StartProxyServerArgs) => {
  await stopProxyServer()

  proxy = httpProxy
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
      // ws: enableWs,
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
      stopProxyServer()
    })

  proxyServer = http
    .createServer(function (req, res) {
      proxy.web(req, res)
    })
    .on('upgrade', function (req, socket, head) {
      console.log('upgrade', req.url)
      if (enableWs) {
        if (isNextJs12 && !req.url.startsWith('/_next/webpack-hmr')) {
          return
        }
        proxy.ws(req, socket, head)
      }
    })
    .on('connection', (connection) => {
      const key = `${connection.remoteAddress}`
      console.log('New connection: ', key)
      // connections[key] = connection
      // connection.on('close', () => {
      //   delete connections[key]
      // })
    })
    .listen(listenPort)

  console.log('Start proxy server')
}
