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
  const [isUploading, setIsUploading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleCapture = () => {
    const canvas = document.getElementById('digicam-canvas') as HTMLCanvasElement;
    if (canvas) {
      // Convert current GPU frame to a high-quality JPEG
      const imageData = canvas.toDataURL('image/jpeg', 0.95); // 1.0 for maximum quality
      setCapturedImage(imageData);
    }
  };

  const handleDownload = () => {
    if (!capturedImage) return;

    // Format timestamp: YYYY-MM-DD_HH-MM-SS
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = `memento_${ts}.jpg`; // Filename

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async () => {
    if (!capturedImage) return;

    setIsUploading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photo_url: capturedImage, // Matches Pydantic model field name exactly
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        alert('Success! Backend acknowledged receipt of the photo.');
        console.log('Backend response:', data);
      } else {
        alert(`Server Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Network request failed:', error);
      alert('Failed to connect to the backend server. Is Uvicorn running?');
    } finally {
      setIsUploading(false);
    }
  };

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
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setCapturedImage(null)}
              className="px-6 py-3 bg-white text-pink-500 border-2 border-pink-400 font-mono rounded shadow-[4px_4px_0px_rgba(236,72,153,1)] active:shadow-none active:translate-y-1 active:translate-x-1"          >
              Retake
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-pink-400 text-white font-mono rounded shadow-[4px_4px_0px_rgba(244,114,182,1)] active:shadow-none active:translate-y-1 active:translate-x-1"
            >
              Save to Device
            </button>
            <button 
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full px-6 py-3 bg-pink-500 text-white font-mono rounded shadow-[4px_4px_0px_rgba(147,51,234,1)] active:shadow-none active:translate-y-1 active:translate-x-1 disabled:bg-pink-300 transition-all uppercase font-bold text-center"
            >
              {isUploading ? 'Uploading to Server...' : 'Upload to Cloud'}
            </button>
          </div>
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
