import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SceneManagerProps {
    videoElement: HTMLVideoElement | null;
}

const SceneManager = ({ videoElement }: SceneManagerProps) => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!videoElement || !mountRef.current) return;

        // Set up the Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Map the video feed to a texture
        const texture = new THREE.VideoTexture(videoElement);
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Render loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            // Cleanup
            renderer.dispose();
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, [videoElement]);

    return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

export default SceneManager;