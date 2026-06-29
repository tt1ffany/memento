import { useState } from 'react'
import './App.css'

import CameraFeed from './components/CameraFeed'
import SceneManager from './webgl/SceneManager'

function App() {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  return (
      <div className="relative w-screen h-screen">
        <CameraFeed setVideoElement={setVideoElement} />
        <SceneManager videoElement={videoElement} />
      </div>
  )
}

export default App
