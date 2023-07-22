import { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Tooltip } from 'react-tooltip'
import { useQrCode } from './hooks/useQrCode'
import './index.css'

type Inputs = {
  targetUrl: string
  listenHost: string
  listenPort: number
  enableHttps: boolean
  enableWs: boolean
  isNextJs12: boolean
}

function App() {
  const [running, setRunning] = useState(false)
  const [serverStatus, setServerStatus] = useState('Server Stopped')
  const [showTargetUrls, setShowTargetUrls] = useState(false)
  const [showListenHost, setShowListenHost] = useState(false)
  const [targetUrls, setTargetUrls] = useState<string[]>([])
  const [listenHosts, setListenHosts] = useState<string[]>([])
  const { qrCode, setQrCode, convertQrCode } = useQrCode()

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: async () => {
      const setting = await window.electronAPI.loadSetting()
      setTargetUrls(setting.targetUrls)
      setListenHosts(setting.listenHosts)
      return {
        targetUrl: setting.targetUrls[0],
        listenHost: setting.listenHosts[0],
        listenPort: setting.listenPort,
        enableHttps: setting.enableHttps,
        enableWs: setting.enableWs,
        isNextJs12: setting.isNextJs12,
      }
    },
  })

  const onSubmit = useCallback<SubmitHandler<Inputs>>(async (data) => {
    console.log(data)
    console.log(errors)
    await window.electronAPI.startProxyServer(data)
    const serverUrl = `${data.enableHttps ? 'https' : 'http'}://${data.listenHost}:${data.listenPort}`
    convertQrCode(serverUrl)
    setRunning(true)
    // TODO: httpsの場合はアイコンを表示する等、分かるようにする
    setServerStatus(`Server Running at ${serverUrl}`)
  }, [])

  const onStopButtonClick = useCallback(async () => {
    await window.electronAPI.stopProxyServer()
    setRunning(false)
    setServerStatus('Server Stopped')
  }, [])

  const onToggleTargetListButtonClick = useCallback(() => {
    setShowTargetUrls((showTargetUrls) => !showTargetUrls)
    setShowListenHost(false)
  }, [])

  const onTargetUrlListClick = useCallback((event: SyntheticEvent<HTMLLIElement>) => {
    const element = event.target as HTMLLIElement
    setValue('targetUrl', element.innerText)
  }, [])

  const onToggleListenHostListButtonClick = useCallback(() => {
    setShowListenHost((showListenHost) => !showListenHost)
    setShowTargetUrls(false)
  }, [])

  const onListenHostListClick = useCallback((event: SyntheticEvent<HTMLLIElement>) => {
    const element = event.target as HTMLLIElement
    setValue('listenHost', element.innerText)
  }, [])

  useEffect(() => {
    const load = async () => {
      const ipAddress = await window.electronAPI.getHostIpAddress()
      setListenHosts((listenHosts) => [...ipAddress, ...listenHosts])

      const initialQrCodeImage = await window.electronAPI.loadImage('invalid_qr_code.png')
      setQrCode(initialQrCodeImage)
    }
    load()
  }, [])

  return (
    <main className='main'>
      <form className='form' onSubmit={handleSubmit(onSubmit)}>
        <div className='input-area'>
          <label htmlFor='targetUrl'>Target URL :</label>
          <div className='target-url-container'>
            <input type='text' placeholder='Enter server URL...' {...register('targetUrl', { required: true })} />
            <button type='button' className='toggle-target-list-button' onClick={onToggleTargetListButtonClick}>
              ▼
            </button>
            {showTargetUrls && (
              <div className='target-list-container'>
                <ul className='target-list'>
                  {targetUrls.map((url, index) => (
                    <li key={index} onClick={onTargetUrlListClick}>
                      {url}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <label htmlFor='listenHost'>Listen Host :</label>
          <div className='target-url-container'>
            <input type='text' placeholder='Enter listen host...' {...register('listenHost', { required: true })} />
            <button type='button' className='toggle-target-list-button' onClick={onToggleListenHostListButtonClick}>
              ▼
            </button>
            {showListenHost && (
              <div className='target-list-container'>
                <ul className='target-list'>
                  {listenHosts.map((url, index) => (
                    <li key={index} onClick={onListenHostListClick}>
                      {url}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <label htmlFor='listenPort'>Listen Port :</label>
          <input
            type='number'
            placeholder='Enter server port...'
            {...register('listenPort', {
              required: true,
              valueAsNumber: true,
              min: 0,
              max: 65535,
            })}
          />
          <div className='input-checkbox-area'>
            <label htmlFor='enableHttps'>HTTPS :</label>
            <input type='checkbox' {...register('enableHttps')} />
          </div>
          <p>
            プロキシサーバーの httpsを有効にする場合は true
            <br />
            (自己証明書を使用するためエラーになる可能性があります)
          </p>
          <div className='input-checkbox-area'>
            <label htmlFor='enableWs'>WS :</label>
            <input type='checkbox' {...register('enableWs')} />
          </div>
          <p>プロキシサーバーで WebSocketを使用する場合は true</p>
          <div className='input-checkbox-area'>
            <label htmlFor='isNextJs12'>WS :</label>
            <input type='checkbox' {...register('isNextJs12')} />
          </div>
          <p>
            Next12で WebSocketを使用する場合は true
            <a
              className='info-icon'
              data-tooltip-id='see-next12-issue'
              data-tooltip-content='see https://github.com/vercel/next.js/issues/30491#issuecomment-962835174'
              href='https://github.com/vercel/next.js/issues/30491#issuecomment-962835174'
              target='_blank'
            >
              i
            </a>
          </p>
          <Tooltip id='see-next12-issue' variant='info' />
        </div>
        <div className='button-area'>
          <button type='submit' disabled={running}>
            サーバーを起動
          </button>
          <button type='button' disabled={!running} onClick={onStopButtonClick}>
            サーバーを停止
          </button>
        </div>
      </form>
      <div className='server-status-container'>
        <div className='server-status'>
          <p>{serverStatus}</p>
          {errors.targetUrl && <p className='error-text'>ターゲットURLを入力してください</p>}
          {errors.listenHost && <p className='error-text'>ホスト名を入力してください</p>}
          {errors.listenPort && <p className='error-text'>ポート番号が無効な値です</p>}
        </div>
        <img className='server-url-qr-code' src={qrCode} />
      </div>
    </main>
  )
}

export default App
