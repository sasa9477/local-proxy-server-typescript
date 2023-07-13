import { useState } from 'react'
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Hello world from React</h1>
      <p>with Electron Forge!</p>
      <p>You clicked {count} time(s)</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </>
  )
}

export default App
