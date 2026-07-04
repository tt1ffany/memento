import { useState } from 'react'
import './App.css'

import CameraFeed from './components/CameraFeed'
import SceneManager from './webgl/SceneManager'
import FilterSlider from './components/FilterSlider'

function App() {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [bloomStrength, setBloomStrength] = useState(1.5);
  const [bloomThreshold, setBloomThreshold] = useState(0.8);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      <CameraFeed setVideoElement={setVideoElement} />

      {/* Pass the state to the SceneManager */}
      <SceneManager
        videoElement={videoElement}
        bloomStrength={bloomStrength}
        bloomThreshold={bloomThreshold}
      />

      {/* UI Overlay */}
      <div className="absolute bottom-10 left-0 w-full z-10 flex flex-col gap-4 px-4">
        <FilterSlider
          label="Glow Strength"
          value={bloomStrength}
          min={0}
          max={1}
          step={0.05}
          onChange={setBloomStrength}
        />
        <FilterSlider
          label="Light Threshold"
          value={bloomThreshold}
          min={0.5}
          max={1}
          step={0.01}
          onChange={setBloomThreshold}
        />
      </div>
    </div>
  )
}

export default App
