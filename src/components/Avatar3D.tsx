import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, Environment, PresentationControls } from "@react-three/drei";
import * as THREE from "three";

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle breathing/sway animation
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = Math.sin(t * 0.5) * 0.05;
      meshRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;
    }
  });

  return <primitive ref={meshRef} object={scene} scale={1.5} />;
};

export const Avatar3D = ({ 
  containerClassName = "w-full h-full",
  modelPath = "/me.glb"
}: { 
  containerClassName?: string;
  modelPath?: string;
}) => {
  return (
    <div className={`${containerClassName} pointer-events-none`} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, 0, 5]} intensity={0.5} color="#34d399" />
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <PresentationControls
              global
              config={{ mass: 2, tension: 500 }}
              snap={{ mass: 4, tension: 1500 }}
              rotation={[0, 0.3, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
              <Model url={modelPath} />
            </PresentationControls>
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
};
