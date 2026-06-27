import { useEffect, useRef } from 'react';

const CameraFeed = () => {
    const videoRef = useRef < HTMLVideoElement > (null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment', // Prioritize back camera if available
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                    },
                    audio: false
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera access denied or unavailable:", err);
            }
        };

        startCamera();

        // Cleanup function to stop the camera when the component unmounts
        return () => {
            if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
        />  
    );
};

export default CameraFeed;