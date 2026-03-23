import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  MeshTransmissionMaterial, 
  Float, 
  Environment, 
  ContactShadows,
  PerspectiveCamera,
} from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";
import { ArrowUpRight, ChevronDown } from "@/components/icons/lucide";

/**
 * Renders a refractive glass sphere that follows the "Liquid Glass" aesthetic
 * defined in the Alexander UI Canon.
 */
const GlassSphere = () => {
  const mesh = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Subtle rotation and float
    mesh.current.rotation.x = Math.cos(t / 4) * 0.15;
    mesh.current.rotation.y = Math.sin(t / 4) * 0.15;
    mesh.current.position.y = Math.sin(t / 2) * 0.1;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
      <mesh ref={mesh} position={[1.8, 0.2, -1.5]} scale={1.3}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.5}
          samples={16}
          thickness={1.0}
          chromaticAberration={0.06}
          anisotropy={0.2}
          distortion={0.4}
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
      <ambientLight intensity={0.4} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={1.5} 
        castShadow 
      />
      
      <GlassSphere />
      
      {/* Subtle floor shadow for depth without explicit borders */}
      <ContactShadows 
        position={[0, -2, 0]} 
        opacity={0.3} 
        scale={12} 
        blur={2.5} 
        far={4.5} 
      />
    </>
  );
};

/**
 * HeroSerious component: A high-impact, full-screen banner effect.
 * Strictly adheres to Alexander UI Canon: Premium Lightness, Depth Over Color, and Authoritative Typography.
 */
export const HeroSerious = () => {
  const { scrollY } = useScroll();
  // Parallax and fade on scroll
  const yParallax = useTransform(scrollY, [0, 600], [0, 250]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1], // Canon: Slide, fade, morph — never bounce
      },
    },
  };

  return (
    <section className="relative h-[100dvh] min-h-[720px] w-full overflow-hidden bg-[var(--surface)] font-sans">
      {/* ── Background Layer ────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,var(--cat-ux-bg),transparent_50%)] opacity-20" />
        <div className="h-full w-full opacity-60 md:opacity-100">
           <Canvas shadows dpr={[1, 2]}>
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* ── Content Layer ───────────────────────────────────────────────────── */}
      <motion.div 
        style={{ y: yParallax, opacity: contentOpacity }}
        className="relative z-10 flex h-full w-full flex-col justify-center px-6 md:px-12 lg:px-24"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl"
        >
          {/* Status Token (Rule 7: Color Has Meaning) */}
          <motion.div variants={itemVariants} className="mb-10 flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-[var(--cat-ux)] shadow-[0_0_12px_var(--cat-ux)]" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-[var(--cat-ux)]">
              System Active // Portfolio 2026
            </span>
          </motion.div>

          {/* Authoritative Headline (Rule 30: Type Is Interface) */}
          <motion.h1 
            variants={itemVariants}
            className="mb-8 text-[clamp(3.5rem,12vw,12rem)] font-light leading-[0.85] tracking-[-0.06em] text-[var(--text)]"
          >
            Complexity, <br />
            <span className="text-[var(--text-ghost)]">clarified.</span>
          </motion.h1>

          {/* Narrative (Rule 15: Respect Intelligence) */}
          <motion.p 
            variants={itemVariants} 
            className="mb-14 max-w-xl text-[clamp(1.25rem,3vw,2.25rem)] font-light leading-tight text-[var(--text-muted)]"
          >
            Design for operations, internal tools, and high-stakes AI systems.
          </motion.p>

          {/* Core Action (Rule 4: One Screen, One Action) */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-5">
            <a
              href="#featured-work"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 squircle-pill bg-[var(--cta-bg)] text-[var(--cta-text)] font-medium transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore Evidence
              <ArrowUpRight
                size={22}
                className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>
            <a
              href="mailto:hello@dyrane.tech"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 glass-regular squircle-pill text-[var(--text)] font-medium transition-all duration-500 hover:bg-[var(--surface-elevated-strong)]"
            >
              Start a Project
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Footer / Indicator ──────────────────────────────────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3 opacity-30 transition-opacity hover:opacity-100">
           <span className="font-mono text-[9px] uppercase tracking-[0.3em]">Scroll for Context</span>
           <div className="h-6 w-px bg-gradient-to-b from-[var(--text)] to-transparent" />
           <ChevronDown size={16} className="animate-bounce" />
        </div>
      </motion.div>

      {/* Edge vignette for depth */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.15))]" />
    </section>
  );
};
