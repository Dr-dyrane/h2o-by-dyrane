import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import * as THREE from 'three'

interface LiquidCurrentCanvasProps {
  progressRef: MutableRefObject<number>
  activeIndexRef: MutableRefObject<number>
  activityRef: MutableRefObject<number>
  palette: string[]
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vWave;

  void main() {
    float waveA = sin(position.y * 3.1 + uTime * 0.72 + uScroll * 7.0) * 0.14;
    float waveB = sin(position.x * 4.4 - uTime * 0.48) * 0.08;
    float waveC = cos(position.z * 5.2 + uTime * 0.34) * 0.055;
    float wave = waveA + waveB + waveC;

    vec3 displaced = position + normal * wave;
    vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);

    vWave = wave;
    vWorldPosition = worldPosition.xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uAccent;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vWave;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDirection), 0.0), 2.35);
    float current = 0.5 + 0.5 * sin((vWorldPosition.y + vWorldPosition.x) * 2.2 + uTime * 0.42);

    vec3 deep = vec3(0.008, 0.014, 0.020);
    vec3 color = mix(deep, uAccent, clamp(fresnel * 0.92 + current * 0.08 + vWave * 0.25, 0.0, 1.0));
    float alpha = 0.08 + fresnel * 0.58 + current * 0.035;

    gl_FragColor = vec4(color, alpha);
  }
`

function createLiquidMaterial(color: THREE.Color) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uAccent: { value: color.clone() },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  })
}

function ActivityDriver({ activityRef }: { activityRef: MutableRefObject<number> }) {
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    let frame = 0
    let running = false

    const loop = () => {
      invalidate()
      if (performance.now() - activityRef.current < 1500) {
        frame = window.requestAnimationFrame(loop)
      } else {
        running = false
      }
    }

    const wake = () => {
      activityRef.current = performance.now()
      if (!running) {
        running = true
        frame = window.requestAnimationFrame(loop)
      }
    }

    const events: Array<keyof WindowEventMap> = ['scroll', 'pointermove', 'pointerdown', 'resize']
    events.forEach((event) => window.addEventListener(event, wake, { passive: true }))
    wake()

    return () => {
      window.cancelAnimationFrame(frame)
      events.forEach((event) => window.removeEventListener(event, wake))
    }
  }, [activityRef, invalidate])

  return null
}

function CurrentScene({
  progressRef,
  activeIndexRef,
  activityRef,
  palette,
}: LiquidCurrentCanvasProps) {
  const groupRef = useRef<THREE.Group>(null)
  const primaryRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null)
  const secondaryRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const nodesRef = useRef<THREE.Group>(null)
  const accent = useMemo(() => new THREE.Color(palette[0] ?? '#ff4b3e'), [palette])
  const targetAccent = useMemo(() => new THREE.Color(palette[0] ?? '#ff4b3e'), [palette])
  const primaryMaterial = useMemo(() => createLiquidMaterial(accent), [accent])
  const secondaryMaterial = useMemo(() => createLiquidMaterial(accent), [accent])

  const particles = useMemo(() => {
    const count = 420
    const positions = new Float32Array(count * 3)

    for (let index = 0; index < count; index += 1) {
      const progress = index / count
      const angle = progress * Math.PI * 10
      const radius = 2.1 + Math.sin(progress * Math.PI * 8) * 0.38
      positions[index * 3] = Math.cos(angle) * radius
      positions[index * 3 + 1] = (progress - 0.5) * 6.4
      positions[index * 3 + 2] = Math.sin(angle) * radius * 0.48
    }

    return positions
  }, [])

  const nodePositions = useMemo(
    () =>
      palette.map((_, index) => {
        const normalized = palette.length <= 1 ? 0.5 : index / (palette.length - 1)
        const angle = normalized * Math.PI * 4.7 - Math.PI * 0.7
        const radius = 2.25 + Math.sin(normalized * Math.PI * 4) * 0.25
        return new THREE.Vector3(
          Math.cos(angle) * radius,
          (normalized - 0.5) * 5.25,
          Math.sin(angle) * radius * 0.48,
        )
      }),
    [palette],
  )

  useEffect(
    () => () => {
      primaryMaterial.dispose()
      secondaryMaterial.dispose()
    },
    [primaryMaterial, secondaryMaterial],
  )

  useFrame((state, delta) => {
    const progress = progressRef.current
    const activeIndex = Math.max(0, Math.min(palette.length - 1, activeIndexRef.current))
    targetAccent.set(palette[activeIndex] ?? palette[0] ?? '#ff4b3e')
    accent.lerp(targetAccent, Math.min(1, delta * 2.6))

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        progress * Math.PI * 1.25,
        0.045,
      )
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -0.15, 0.04)
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        0.25 - progress * 0.7,
        0.035,
      )
    }

    const elapsed = state.clock.elapsedTime
    const updateMaterial = (material: THREE.ShaderMaterial, speed = 1) => {
      material.uniforms.uTime.value = elapsed * speed
      material.uniforms.uScroll.value = progress
      material.uniforms.uAccent.value.copy(accent)
    }

    updateMaterial(primaryMaterial)
    updateMaterial(secondaryMaterial, 0.76)

    if (primaryRef.current) {
      primaryRef.current.rotation.z += delta * 0.045
      primaryRef.current.scale.setScalar(1 + Math.sin(elapsed * 0.38) * 0.025)
    }

    if (secondaryRef.current) {
      secondaryRef.current.rotation.x -= delta * 0.065
      secondaryRef.current.rotation.y += delta * 0.035
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.035
      pointsRef.current.position.y = -progress * 1.1
      const pointsMaterial = pointsRef.current.material as THREE.PointsMaterial
      pointsMaterial.color.lerp(accent, Math.min(1, delta * 2.3))
    }

    if (nodesRef.current) {
      nodesRef.current.children.forEach((node, index) => {
        const mesh = node as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>
        const selected = index === activeIndex
        const targetScale = selected ? 1.8 : 0.72
        const nextScale = THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.09)
        mesh.scale.setScalar(nextScale)
        mesh.material.opacity = THREE.MathUtils.lerp(mesh.material.opacity, selected ? 0.92 : 0.28, 0.08)
      })
    }
  })

  return (
    <>
      <ActivityDriver activityRef={activityRef} />
      <group ref={groupRef} position={[1.5, 0.2, 0]}>
        <mesh ref={primaryRef} material={primaryMaterial} rotation={[0.2, -0.4, 0.18]}>
          <icosahedronGeometry args={[1.72, 5]} />
        </mesh>
        <mesh
          ref={secondaryRef}
          material={secondaryMaterial}
          position={[-1.75, -1.05, -0.7]}
          scale={0.52}
          rotation={[-0.4, 0.55, 0.3]}
        >
          <icosahedronGeometry args={[1.25, 4]} />
        </mesh>
        <points ref={pointsRef} rotation={[0.35, 0.15, -0.65]}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[particles, 3]} />
          </bufferGeometry>
          <pointsMaterial
            color={palette[0] ?? '#ff4b3e'}
            size={0.024}
            sizeAttenuation
            transparent
            opacity={0.55}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
        <group ref={nodesRef} rotation={[0.35, 0.15, -0.65]}>
          {nodePositions.map((position, index) => (
            <mesh key={`${palette[index]}-${index}`} position={position}>
              <sphereGeometry args={[0.055, 16, 16]} />
              <meshBasicMaterial
                color={palette[index]}
                transparent
                opacity={index === 0 ? 0.92 : 0.28}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      </group>
    </>
  )
}

export function LiquidCurrentCanvas(props: LiquidCurrentCanvasProps) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      const constrainedDevice =
        typeof navigator !== 'undefined' &&
        typeof navigator.hardwareConcurrency === 'number' &&
        navigator.hardwareConcurrency <= 2
      setEnabled(!media.matches && !constrainedDevice)
    }

    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  if (!enabled) {
    return <div className="h2o-current-fallback" aria-hidden="true" />
  }

  return (
    <div className="h2o-current-canvas" aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.55]}
        camera={{ position: [0, 0, 6.2], fov: 42, near: 0.1, far: 30 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <CurrentScene {...props} />
      </Canvas>
    </div>
  )
}
