// import { useState } from 'react'
import './index.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <main className='main'>
      <form className='form'>
        <div className='input-area'>
          <label htmlFor='target-url'>Target URL :</label>
          <div className='target-url-container'>
            <input type='text' id='target-url' name='target-url' placeholder='Enter server URL...' />
            <button type='button' className='toggle-target-list-button' id='toggle-target-list-button'>
              ▼
            </button>
            <div className='target-list-container' id='target-list-container'>
              <ul className='target-list' id='target-list'></ul>
            </div>
          </div>
          <label htmlFor='listen-port'>Listen Port :</label>
          <input type='number' id='listen-port' name='listen-port' placeholder='Enter server port...' />
          <div className='input-checkbox-area'>
            <label htmlFor='https'>HTTPS :</label>
            <input type='checkbox' id='https' name='https' />
          </div>
          <p>
            プロキシサーバーの httpsを有効にする場合は true
            <br />
            (自己証明書を使用するためエラーになる可能性があります)
          </p>
          <div className='input-checkbox-area'>
            <label htmlFor='ws'>WS :</label>
            <input type='checkbox' id='ws' name='ws' />
          </div>
          <p>プロキシサーバーで WebSocketを使用する場合は true</p>
        </div>
        <div className='button-area'>
          <button type='button' id='start-button'>
            サーバーを起動
          </button>
          <button type='button' id='stop-button' disabled>
            サーバーを停止
          </button>
        </div>
      </form>
      <div className='server-status-container'>
        <p className='server-status' id='server-status'>
          Server Stopped
        </p>
        <img className='server-url-qrcode' id='server-url-qrcode' />
      </div>
    </main>
  )
}

export default App
