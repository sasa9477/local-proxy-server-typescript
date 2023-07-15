import Store from 'electron-store'

const SAVING_TARGET_URL_LIMIT = 10

Store.initRenderer()

const schema: Store.Schema<Setting> = {
  targetUrls: {
    type: 'array',
    default: ['https://localhost:3000/', 'http://localhost:3000/'],
  },
  listenHosts: {
    type: 'array',
    default: [],
  },
  listenPort: {
    type: 'number',
    default: 8888,
  },
  enableHttps: {
    type: 'boolean',
    default: false,
  },
  enableWs: {
    type: 'boolean',
    default: false,
  },
}

const store = new Store({ schema })

export const loadStore = () => {
  return store.store
}

// 前回の値が先頭になるように配列の順序を入れ替える
const unshiftArray = (array: Array<string>, value: string) => {
  const targetArray = [...array]
  const index = targetArray.indexOf(value)
  if (index !== -1) {
    targetArray.splice(index, 1)
  }
  targetArray.unshift(value)
  return targetArray.slice(0, SAVING_TARGET_URL_LIMIT)
}

export const saveStore = ({ targetUrl, listenHost, listenPort, enableHttps, enableWs }: StartProxyServerArgs) => {
  store.set('listenPort', listenPort)
  store.set('enableHttps', enableHttps)
  store.set('enableWs', enableWs)

  const targetUrls = store.get('targetUrls')
  store.set('targetUrls', unshiftArray(targetUrls, targetUrl))

  const listenHosts = store.get('listenHosts')
  store.set('listenHosts', unshiftArray(listenHosts, listenHost))
}
