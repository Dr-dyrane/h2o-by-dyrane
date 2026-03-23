import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  MeshTransmissionMaterial,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";

const GlassSphere = () => {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mesh.current.rotation.x = Math.cos(t / 4) * 0.15;
    mesh.current.rotation.y = Math.sin(t / 4) * 0.15;
    mesh.current.position.y = Math.sin(t / 2) * 0.1;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.35}>
      <mesh ref={mesh} position={[1.8, 0.2, -1.5]} scale={1.25}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.5}
          samples={8}
          thickness={1}
          chromaticAberration={0.05}
          anisotropy={0.2}
          distortion={0.35}
          distortionScale={0.4}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={1.2}
          attenuationColor="#ffffff"
          color="#ffffff"
          ior={1.15}
        />
      </mesh>
    </Float>
  );
};

const Scene = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
      <Environment preset="city" />
      <ambientLight intensity={0.38} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.2} />
      <GlassSphere />
      <ContactShadows position={[0, -2, 0]} opacity={0.28} scale={12} blur={2.2} far={4.5} />
    </>
  );
};

export const HeroThreeScene = () => {
  return (
    <Canvas dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
};
