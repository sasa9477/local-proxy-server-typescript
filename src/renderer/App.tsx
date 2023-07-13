import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import './index.css'

type Inputs = {
  targetUrl: string
  listenHost: string
  listenPort: number
  enableHttps: boolean
  enableWs: boolean
}

function App() {
  const [running, setRunning] = useState(false)
  const [showTargetUrls, setShowTargetUrls] = useState(false)
  const [qrCodeSrc, setQrCodeSrc] = useState('')

  const [setting, setSetting] = useState<Setting>({
    targetUrls: ['https://localhost:3000/', 'http://localhost:3000/'],
    listenHosts: ['192.168.0.2', '192.168.0.3'],
    listenPort: 8888,
    enableHttps: false,
    enableWs: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit = useCallback<SubmitHandler<Inputs>>(async (data) => {
    console.log(data)
    await window.electronAPI.startProxyServer(data)
    setRunning(true)
  }, [])

  const onStopButtonClick = useCallback(async () => {
    await window.electronAPI.stopProxyServer()
    setRunning(false)
  }, [])

  const onToggleTargetListButtonClick = useCallback(() => {
    setShowTargetUrls((showTargetUrls) => !showTargetUrls)
  }, [])

  useEffect(() => {
    const initSetting = async () => {
      const setting = await window.electronAPI.loadSetting()
      setSetting(setting)
    }
    initSetting()
  }, [])

  return (
    <main className='main'>
      <form className='form' onSubmit={handleSubmit(onSubmit)}>
        <div className='input-area'>
          <label htmlFor='target-url'>Target URL :</label>
          <div className='target-url-container'>
            <input
              type='text'
              name='target-url'
              {...register('targetUrl')}
              defaultValue={setting.targetUrls[0]}
              placeholder='Enter server URL...'
            />
            <button type='button' className='toggle-target-list-button' onClick={onToggleTargetListButtonClick}>
              ▼
            </button>
            {showTargetUrls && (
              <div className='target-list-container'>
                <ul className='target-list'>
                  {setting.targetUrls.map((url, index) => (
                    <li key={index}>{url}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <label htmlFor='listen-port'>Listen Port :</label>
          <input
            type='number'
            name='listen-port'
            {...register('listenPort', {
              valueAsNumber: true,
            })}
            defaultValue={setting.listenPort}
            placeholder='Enter server port...'
          />
          <div className='input-checkbox-area'>
            <label htmlFor='https'>HTTPS :</label>
            <input type='checkbox' name='https' defaultChecked={setting.enableHttps} {...register('enableHttps')} />
          </div>
          <p>
            プロキシサーバーの httpsを有効にする場合は true
            <br />
            (自己証明書を使用するためエラーになる可能性があります)
          </p>
          <div className='input-checkbox-area'>
            <label htmlFor='ws'>WS :</label>
            <input type='checkbox' name='ws' defaultChecked={setting.enableWs} {...register('enableWs')} />
          </div>
          <p>プロキシサーバーで WebSocketを使用する場合は true</p>
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
        <p className='server-status'>Server Stopped</p>
        {errors && <span>{errors.listenHost?.message}</span>}
        <img className='server-url-qrcode' src={qrCodeSrc} />
      </div>
    </main>
  )
}

export default App
