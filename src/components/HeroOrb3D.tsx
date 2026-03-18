import { useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// ─── Mouse-driven camera parallax ────────────────────────────────────────────
const MouseParallax = () => {
    const { camera } = useThree();
    const mouse = useRef({ x: 0, y: 0 });
    const target = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            // Normalise to -1 → +1 relative to viewport
            mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
            mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    useFrame(() => {
        // Smooth lerp — camera drifts toward mouse, not snaps
        target.current.x += (mouse.current.x - target.current.x) * 0.04;
        target.current.y += (mouse.current.y - target.current.y) * 0.04;

        // Subtle offset — ±0.6 units max so the orb never leaves frame
        camera.position.x = target.current.x * 0.6;
        camera.position.y = -target.current.y * 0.4;
        camera.lookAt(0, 0, 0);
    });

    return null;
};

// ─── Orb geometry ─────────────────────────────────────────────────────────────
const OrbGeometry = () => {
    const outerRef = useRef<THREE.Mesh>(null);
    const innerRef = useRef<THREE.Mesh>(null);
    const ringRef  = useRef<THREE.Mesh>(null);
    const ring2Ref = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (outerRef.current) {
            outerRef.current.rotation.y = t * 0.18;
            outerRef.current.rotation.x = Math.sin(t * 0.12) * 0.25;
        }
        if (innerRef.current) {
            innerRef.current.rotation.y = -t * 0.22;
            innerRef.current.rotation.z = Math.cos(t * 0.15) * 0.3;
        }
        if (ringRef.current) {
            ringRef.current.rotation.x = t * 0.14;
            ringRef.current.rotation.z = t * 0.08;
        }
        if (ring2Ref.current) {
            ring2Ref.current.rotation.y = t * 0.10;
            ring2Ref.current.rotation.x = -t * 0.16;
        }
    });

    return (
        <group>
            {/* Outer distort sphere */}
            <mesh ref={outerRef}>
                <icosahedronGeometry args={[1.6, 6]} />
                <MeshDistortMaterial
                    color="#34d399"
                    roughness={0.0}
                    metalness={0.15}
                    wireframe
                    distort={0.28}
                    speed={1.4}
                    transparent
                    opacity={0.55}
                />
            </mesh>

            {/* Inner denser icosahedron */}
            <mesh ref={innerRef}>
                <icosahedronGeometry args={[1.1, 3]} />
                <MeshDistortMaterial
                    color="#6ee7b7"
                    roughness={0.1}
                    metalness={0.4}
                    wireframe
                    distort={0.15}
                    speed={2.0}
                    transparent
                    opacity={0.35}
                />
            </mesh>

            {/* Orbital ring 1 */}
            <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.1, 0.006, 12, 120]} />
                <meshBasicMaterial color="#34d399" transparent opacity={0.30} />
            </mesh>

            {/* Orbital ring 2 — tilted axis */}
            <mesh ref={ring2Ref} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
                <torusGeometry args={[2.4, 0.004, 8, 100]} />
                <meshBasicMaterial color="#6ee7b7" transparent opacity={0.18} />
            </mesh>

            <pointLight position={[0, 0, 0]} intensity={3}   color="#34d399" distance={6} decay={2} />
            <pointLight position={[3, 2, 1]} intensity={0.8} color="#60a5fa" distance={8} decay={2} />
        </group>
    );
};

// ─── Canvas wrapper ───────────────────────────────────────────────────────────
export const HeroOrb3D = () => {
    return (
        <div
            className="w-full h-full absolute inset-0 pointer-events-none md:pointer-events-auto"
            aria-hidden="true"
        >
            <Canvas
                camera={{ position: [0, 0, 5.5], fov: 42 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: "transparent" }}
            >
                <ambientLight intensity={0.15} />
                <directionalLight position={[5, 5, 5]} intensity={0.5} />

                <Suspense fallback={null}>
                    <OrbGeometry />
                    {/* Parallax driven by mouse — smooth lerp, no snapping */}
                    <MouseParallax />
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.4}
                        maxPolarAngle={Math.PI}
                        minPolarAngle={0}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};
