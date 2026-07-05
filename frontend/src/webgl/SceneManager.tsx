import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

interface SceneManagerProps {
    videoElement: HTMLVideoElement | null;
    bloomStrength: number;
    bloomThreshold: number;
}

const SceneManager = ({ videoElement, bloomStrength, bloomThreshold }: SceneManagerProps) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const bloomPassRef = useRef<UnrealBloomPass | null>(null);

    useEffect(() => {
        if (!videoElement || !mountRef.current) return;

        // Set up the Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping; // ACES Filmic tone mappping for better color grading
        renderer.toneMappingExposure = 0.8; // Darken base scene so bloom doesn't overpower
        renderer.domElement.id = 'digicam-canvas';
        mountRef.current.appendChild(renderer.domElement);

        // Map the video feed to a texture
        const texture = new THREE.VideoTexture(videoElement);
        texture.colorSpace = THREE.SRGBColorSpace; 
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Post-processing pipeline setup
        const composer = new EffectComposer(renderer);

        // First pass: Render the original video scene
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        // Second pass: Apply bloom (glow) effect
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            bloomStrength, // Strength of bloom/glow effect
            0.4, // Radius (how far glow spreads)
            bloomThreshold // Threshold (how bright a pixel needs to be to trigger the glow)
        );
        bloomPassRef.current = bloomPass;
        composer.addPass(bloomPass);

        // Render loop
        const animate = () => {
            requestAnimationFrame(animate);
            composer.render();
        };
        animate();

        // Handle window resize (e.g., for mobile devices)
        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            // Cleanup
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            composer.dispose();
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, [videoElement]);

    useEffect(() => {
        if (bloomPassRef.current) {
            bloomPassRef.current.strength = bloomStrength;
            bloomPassRef.current.threshold = bloomThreshold;
        }
    }, [bloomStrength, bloomThreshold]);

    return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

export default SceneManager;