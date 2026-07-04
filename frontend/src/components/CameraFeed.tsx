import { useEffect, useRef } from 'react';

interface CameraFeedProps {
    setVideoElement: (el: HTMLVideoElement | null) => void;
}

const CameraFeed = ({ setVideoElement }: CameraFeedProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

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
                    await videoRef.current.play();
                    setVideoElement(videoRef.current);
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
            setVideoElement(null);
        };
    }, [setVideoElement]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover opacity-0"
        />
    );
};

export default CameraFeed;