import { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useUI } from "@/context/UIContext";

// ─── Mouse-driven camera parallax — reads from UIProvider, no own listener ────
const MouseParallax = () => {
    const { camera } = useThree();
    const { getMousePos } = useUI();
    const target = useRef({ x: 0, y: 0 });

    useFrame(() => {
        const { x, y } = getMousePos();
        // Skip if mouse hasn't been tracked yet (off-screen position)
        if (x === -1000 && y === -1000) return;

        // Normalise to -1 → +1
        const nx = (x / window.innerWidth - 0.5) * 2;
        const ny = (y / window.innerHeight - 0.5) * 2;

        target.current.x += (nx - target.current.x) * 0.04;
        target.current.y += (ny - target.current.y) * 0.04;

        (camera as THREE.PerspectiveCamera).position.x = target.current.x * 0.6;
        (camera as THREE.PerspectiveCamera).position.y = -target.current.y * 0.4;
        (camera as THREE.PerspectiveCamera).lookAt(0, 0, 0);
    });

    return null;
};

// ─── Orb geometry — LOD driven by perf tier ──────────────────────────────────
const OrbGeometry = ({ mobile }: { mobile: boolean }) => {
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

    // LOD: mobile uses much lower polygon counts (~75% fewer triangles)
    const outerDetail = mobile ? 3 : 6;
    const innerDetail = mobile ? 1 : 3;

    return (
        <group>
            {/* Outer distort sphere */}
            <mesh ref={outerRef}>
                <icosahedronGeometry args={[1.6, outerDetail]} />
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
                <icosahedronGeometry args={[1.1, innerDetail]} />
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
                <torusGeometry args={mobile ? [2.1, 0.006, 8, 60] : [2.1, 0.006, 12, 120]} />
                <meshBasicMaterial color="#34d399" transparent opacity={0.30} />
            </mesh>

            {/* Orbital ring 2 — tilted axis */}
            <mesh ref={ring2Ref} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
                <torusGeometry args={mobile ? [2.4, 0.004, 6, 50] : [2.4, 0.004, 8, 100]} />
                <meshBasicMaterial color="#6ee7b7" transparent opacity={0.18} />
            </mesh>

            <pointLight position={[0, 0, 0]} intensity={3}   color="#34d399" distance={6} decay={2} />
            <pointLight position={[3, 2, 1]} intensity={0.8} color="#60a5fa" distance={8} decay={2} />
        </group>
    );
};

// ─── Static CSS fallback — shown on perf-low instead of WebGL ─────────────────
const OrbFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-48 h-48">
            <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-pulse" />
            <div className="absolute inset-4 rounded-full border border-emerald-400/20" />
            <div className="absolute inset-8 rounded-full bg-emerald-500/5" />
        </div>
    </div>
);

// ─── Canvas wrapper ───────────────────────────────────────────────────────────
export const HeroOrb3D = () => {
    const { isMobile, isLowPower, canUseWebGL, prefersReducedMotion } = useUI();

    // Show CSS fallback if device can't or shouldn't run WebGL
    if (!canUseWebGL || (isLowPower && isMobile)) {
        return (
            <div className="w-full h-full absolute inset-0 pointer-events-none" aria-hidden="true">
                <OrbFallback />
            </div>
        );
    }

    return (
        <div
            className="w-full h-full absolute inset-0 pointer-events-none will-gpu"
            aria-hidden="true"
        >
            <Canvas
                camera={{ position: [0, 0, 5.5], fov: 42 }}
                gl={{
                    antialias: !isMobile,
                    alpha: true,
                    powerPreference: isMobile ? "low-power" : "high-performance",
                }}
                frameloop={prefersReducedMotion ? "never" : "always"}
                style={{ background: "transparent" }}
            >
                <ambientLight intensity={0.15} />
                <directionalLight position={[5, 5, 5]} intensity={0.5} />

                <Suspense fallback={null}>
                    <OrbGeometry mobile={isMobile} />
                    {/* Mouse parallax only on desktop — pointless and costly on touch */}
                    {!isMobile && <MouseParallax />}
                </Suspense>
            </Canvas>
        </div>
    );
};
