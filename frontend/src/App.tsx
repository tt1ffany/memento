import { useState } from 'react'
import './App.css'

import CameraFeed from './components/CameraFeed'
import SceneManager from './webgl/SceneManager'
import FilterSlider from './components/FilterSlider'

function App() {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [bloomStrength, setBloomStrength] = useState(1.5);
  const [bloomThreshold, setBloomThreshold] = useState(0.8);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleCapture = () => {
    const canvas = document.getElementById('digicam-canvas') as HTMLCanvasElement;
    if (canvas) {
      // Convert current GPU frame to a high-quality JPEG
      const imageData = canvas.toDataURL('image/jpeg', 0.95); // 1.0 for maximum quality
      setCapturedImage(imageData);
    }
  }

  return (
    <div
      className="relative w-screen overflow-hidden bg-black"
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingTop: 'env(safe-area-inset-top)'
      }}
    >
      {/* Captured image overlay, otherwise show live camera */}
      {capturedImage ? (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-pink-50 p-4">
          <h2 className="text-pink-600 font-mono text-xl mb-4">Photo Captured!</h2>
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full max-w-md rounded-lg shadow-[8px_8px_0px_rgba(244,114,182,1)] border-4 border-pink-400 object-cover aspect-[3/4]"
          />
          <button
            onClick={() => setCapturedImage(null)}
            className="mt-8 px-6 py-3 bg-pink-400 text-white font-mono rounded shadow-[4px_4px_0px_rgba(236,72,153,1)] active:shadow-none active:translate-y-1 active:translate-x-1"
          >
            Take Another
          </button>
        </div>
      ) : (
        <>
          <CameraFeed setVideoElement={setVideoElement} />

          {/* Pass the state to the SceneManager */}
          <SceneManager
            videoElement={videoElement}
            bloomStrength={bloomStrength}
            bloomThreshold={bloomThreshold}
          />

          {/* Controls: shutter and toggleable filter menu */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div
              className="absolute left-0 w-full flex items-end justify-center pointer-events-none"
              style={{ bottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
            >
                <div className="pointer-events-auto flex flex-col items-center gap-3">
                {/* Filter toggle */}
                <button
                  onClick={() => setShowFilters((s) => !s)}
                  aria-label="Toggle filters"
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 flex items-center justify-center text-white"
                >
                  {showFilters ? '✕' : '⚙️'}
                </button>

                {showFilters && (
                  <div className="mb-2 p-3 bg-pink-100 border-4 border-pink-400 rounded-lg shadow-[4px_4px_0px_rgba(244,114,182,1)] flex gap-3 overflow-x-auto max-w-full">
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
                )}

                <button
                  onClick={handleCapture}
                  className="w-20 h-20 bg-white border-4 border-pink-400 rounded-full shadow-[0px_6px_0px_rgba(244,114,182,1)] active:shadow-[0px_0px_0px_rgba(244,114,182,1)] active:translate-y-1.5 transition-all flex items-center justify-center"
                >
                  <div className="w-16 h-16 border-2 border-pink-200 rounded-full" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App
