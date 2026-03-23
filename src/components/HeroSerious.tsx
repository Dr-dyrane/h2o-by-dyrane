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
import { ArrowUpRight } from "@/components/icons/lucide";

const GlassSphere = () => {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
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

interface HeadlineWord {
  text: string;
  className?: string;
  breakAfter?: boolean;
}

const WordReveal = ({
  words,
  className,
  baseDelay = 0.3,
  stagger = 0.08,
}: {
  words: HeadlineWord[];
  className?: string;
  baseDelay?: number;
  stagger?: number;
}) => {
  return (
    <span className={className} aria-label={words.map((word) => word.text).join(" ")}>
      {words.map((word, i) => (
        <React.Fragment key={`${word.text}-${i}`}>
          <span className="word-clip mr-[0.22em] last:mr-0">
            <motion.span
              className={`inline-block ${word.className ?? ""}`}
              initial={{ y: 80, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" }}
              animate={{ y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{
                duration: 0.6,
                delay: baseDelay + i * stagger,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {word.text}
            </motion.span>
          </span>
          {word.breakAfter ? <br /> : null}
        </React.Fragment>
      ))}
    </span>
  );
};

const headlineWords: HeadlineWord[] = [
  { text: "Complexity,", breakAfter: true },
  { text: "clarified.", className: "text-[var(--text-ghost)]" },
];

export const HeroSerious = () => {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 600], [0, 250]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const fadeUp = (delay: number) => ({
    initial: { y: 24, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  });

  return (
    <section
      id="hero"
      className="relative h-[100dvh] min-h-[720px] w-full overflow-hidden bg-[var(--surface)] font-sans"
    >
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

      <motion.div
        style={{ y: yParallax, opacity: contentOpacity }}
        className="relative z-10 flex h-full w-full flex-col justify-center px-6 md:px-12 lg:px-24"
      >
        <div className="max-w-6xl">
          <motion.div {...fadeUp(0.2)} className="mb-10 flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-[var(--cat-ux)] shadow-[0_0_12px_var(--cat-ux)]" />
            <span className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-[var(--cat-ux)]">
              System Active // Portfolio 2026
            </span>
          </motion.div>

          <h1 className="mb-8 text-[clamp(3.5rem,12vw,12rem)] font-light leading-[0.85] tracking-[-0.06em] text-[var(--text)]">
            <WordReveal words={headlineWords} baseDelay={0.3} stagger={0.08} />
          </h1>

          <motion.p
            {...fadeUp(0.4)}
            className="mb-14 max-w-xl text-[clamp(1.1rem,2.5vw,1.75rem)] font-light leading-snug text-[var(--text-muted)]"
          >
            Design for operations, internal tools, and high-stakes AI systems.
          </motion.p>

          <motion.div {...fadeUp(0.8)} className="flex flex-wrap gap-5">
            <a
              href="#showcase"
              className="group inline-flex items-center justify-center gap-3 px-10 py-5 squircle-pill bg-[var(--cta-bg)] text-[var(--cta-text)] font-medium transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore Evidence
              <ArrowUpRight
                size={20}
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
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.9 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <motion.span
            className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--text-ghost)]"
            animate={{ opacity: [0.45, 0.85, 0.45] }}
            transition={{
              duration: 2.4,
              ease: [0.4, 0, 0.6, 1],
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            Scroll
          </motion.span>
          <div className="breathe-line h-12 w-px bg-gradient-to-b from-[var(--text-ghost)] to-transparent" />
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.15))]" />
    </section>
  );
};
