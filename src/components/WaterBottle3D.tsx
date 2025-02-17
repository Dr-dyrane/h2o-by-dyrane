
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const Bottle = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} scale={[1, 1, 1]} position={[0, 0, 0]}>
      <cylinderGeometry args={[1, 1, 4, 32]} />
      <meshPhysicalMaterial
        color="#000000"
        transmission={0.9}
        thickness={0.5}
        roughness={0}
        metalness={0}
      />
    </mesh>
  );
};

const WaterBottle3D = () => {
  return (
    <Canvas className="h-[500px] p-4 w-full">
      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls enableZoom={false} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Bottle />
    </Canvas>
  );
};

export default WaterBottle3D;
