import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { frameBlend, webglMotionBudget } from '@/motion/tokens'
import type { SpatialPointerSnapshot } from '@/motion/useSpatialPointer'

interface LiquidCurrentSceneProps {
  progressRef: MutableRefObject<number>
  activeIndexRef: MutableRefObject<number>
  activityRef: MutableRefObject<number>
  pointerRef: MutableRefObject<SpatialPointerSnapshot>
  palette: string[]
  compact: boolean
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
    float alpha = 0.07 + fresnel * 0.56 + current * 0.035;

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
    side: THREE.FrontSide,
  })
}

function ActivityDriver({ activityRef }: { activityRef: MutableRefObject<number> }) {
  const invalidate = useThree((state) => state.invalidate)

  useEffect(() => {
    let frame = 0
    let running = false

    const loop = () => {
      invalidate()
      if (performance.now() - activityRef.current < webglMotionBudget.idleWindowMs) {
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

    const events: Array<keyof WindowEventMap> = ['scroll', 'resize', 'pointermove']
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
  pointerRef,
  palette,
  compact,
}: LiquidCurrentSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const primaryRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null)
  const secondaryRef = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>>(null)
  const pointsRef = useRef<THREE.Points>(null)
  const nodesRef = useRef<THREE.Group>(null)
  const filamentsRef = useRef<THREE.Group>(null)
  const accent = useMemo(() => new THREE.Color(palette[0] ?? '#ff4b3e'), [palette])
  const targetAccent = useMemo(() => new THREE.Color(palette[0] ?? '#ff4b3e'), [palette])
  const primaryMaterial = useMemo(() => createLiquidMaterial(accent), [accent])
  const secondaryMaterial = useMemo(() => createLiquidMaterial(accent), [accent])
  const cameraTarget = useMemo(() => new THREE.Vector3(), [])
  const cameraPosition = useMemo(() => new THREE.Vector3(), [])
  const pointerPosition = useMemo(() => new THREE.Vector2(), [])

  const quality = compact ? webglMotionBudget.compact : webglMotionBudget.full

  const particles = useMemo(() => {
    const count = quality.particleCount
    const positions = new Float32Array(count * 3)

    for (let index = 0; index < count; index += 1) {
      const progress = index / count
      const angle = progress * Math.PI * 11
      const radius = 2.1 + Math.sin(progress * Math.PI * 8) * 0.38
      positions[index * 3] = Math.cos(angle) * radius
      positions[index * 3 + 1] = (progress - 0.5) * 7.1
      positions[index * 3 + 2] = Math.sin(angle) * radius * 0.5
    }

    return positions
  }, [quality.particleCount])

  const filamentGeometries = useMemo(
    () =>
      Array.from({ length: quality.filamentCount }, (_, filamentIndex) => {
        const points = Array.from({ length: 9 }, (_, pointIndex) => {
          const progress = pointIndex / 8
          const angle = progress * Math.PI * 3.4 + filamentIndex * 0.72
          const radius = 1.7 + filamentIndex * 0.12 + Math.sin(progress * Math.PI * 4) * 0.3
          return new THREE.Vector3(
            Math.cos(angle) * radius,
            (progress - 0.5) * 7.8 + Math.sin(filamentIndex) * 0.28,
            Math.sin(angle) * radius * 0.58 - filamentIndex * 0.08,
          )
        })
        const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.42)
        return new THREE.TubeGeometry(
          curve,
          quality.filamentSegments,
          0.008 + filamentIndex * 0.0015,
          quality.filamentRadialSegments,
          false,
        )
      }),
    [quality.filamentCount, quality.filamentRadialSegments, quality.filamentSegments],
  )

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
      filamentGeometries.forEach((geometry) => geometry.dispose())
    },
    [filamentGeometries, primaryMaterial, secondaryMaterial],
  )

  useFrame((state, delta) => {
    const progress = progressRef.current
    const activeIndex = Math.max(0, Math.min(palette.length - 1, activeIndexRef.current))
    const phase = progress * Math.PI * 3.6
    const pointer = pointerRef.current
    pointerPosition.x = THREE.MathUtils.damp(
      pointerPosition.x,
      pointer.x * pointer.presence,
      10.5,
      delta,
    )
    pointerPosition.y = THREE.MathUtils.damp(
      pointerPosition.y,
      pointer.y * pointer.presence,
      10.5,
      delta,
    )
    targetAccent.set(palette[activeIndex] ?? palette[0] ?? '#ff4b3e')
    accent.lerp(targetAccent, frameBlend(10, delta))

    if (groupRef.current) {
      const activeDirection = activeIndex % 2 === 0 ? 1 : -1
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        progress * Math.PI * 2.15 + Math.sin(phase) * 0.22 + pointerPosition.x * 0.18,
        9.5,
        delta,
      )
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        -0.13 + Math.cos(phase * 0.72) * 0.12 + pointerPosition.y * 0.12,
        9,
        delta,
      )
      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        1.1 + Math.sin(phase * 0.82) * 0.95 + activeDirection * 0.16 + pointerPosition.x * 0.32,
        8.8,
        delta,
      )
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        0.2 + Math.cos(phase * 0.64) * 0.38 - progress * 0.46 - pointerPosition.y * 0.24,
        8.2,
        delta,
      )
      groupRef.current.position.z = THREE.MathUtils.damp(
        groupRef.current.position.z,
        -0.18 + Math.sin(phase * 0.48) * 0.72 + pointerPosition.y * 0.12,
        8.4,
        delta,
      )
    }

    cameraPosition.set(
      Math.sin(phase * 0.42) * 0.62 + pointerPosition.x * 0.28,
      Math.cos(phase * 0.35) * 0.26 - pointerPosition.y * 0.18,
      6.1 + Math.sin(phase * 0.26) * 0.38 + Math.abs(pointerPosition.x) * 0.08,
    )
    state.camera.position.lerp(cameraPosition, frameBlend(9.2, delta))
    cameraTarget.set(
      Math.sin(phase * 0.5) * 0.22 + pointerPosition.x * 0.18,
      -progress * 0.38 - pointerPosition.y * 0.13,
      -0.35,
    )
    state.camera.lookAt(cameraTarget)

    const elapsed = state.clock.elapsedTime
    const updateMaterial = (material: THREE.ShaderMaterial, speed = 1) => {
      material.uniforms.uTime.value = elapsed * speed
      material.uniforms.uScroll.value = progress
      material.uniforms.uAccent.value.copy(accent)
    }

    updateMaterial(primaryMaterial)
    updateMaterial(secondaryMaterial, 0.76)

    if (primaryRef.current) {
      primaryRef.current.rotation.z += delta * 0.04
      primaryRef.current.scale.setScalar(1 + Math.sin(elapsed * 0.38) * 0.022)
    }

    if (secondaryRef.current) {
      secondaryRef.current.rotation.x -= delta * 0.06
      secondaryRef.current.rotation.y += delta * 0.032
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.032
      pointsRef.current.rotation.z = -0.65 + Math.sin(phase * 0.35) * 0.16 + pointerPosition.x * 0.08
      pointsRef.current.position.y = -progress * 1.05
      const pointsMaterial = pointsRef.current.material as THREE.PointsMaterial
      pointsMaterial.color.lerp(accent, frameBlend(8.5, delta))
    }

    if (filamentsRef.current) {
      filamentsRef.current.rotation.y = -progress * Math.PI * 1.2
      filamentsRef.current.rotation.z = 0.5 + Math.sin(phase * 0.32) * 0.22 + pointerPosition.y * 0.08
      filamentsRef.current.children.forEach((child, index) => {
        const mesh = child as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>
        mesh.material.color.lerp(accent, frameBlend(7 + index * 0.24, delta))
        mesh.material.opacity = 0.035 + index * 0.009 + Math.sin(elapsed * 0.3 + index) * 0.008
      })
    }

    if (nodesRef.current) {
      nodesRef.current.children.forEach((node, index) => {
        const mesh = node as THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>
        const selected = index === activeIndex
        const targetScale = selected ? 1.9 : 0.7
        const nextScale = THREE.MathUtils.damp(mesh.scale.x, targetScale, 12, delta)
        mesh.scale.setScalar(nextScale)
        mesh.material.opacity = THREE.MathUtils.damp(
          mesh.material.opacity,
          selected ? 0.94 : 0.24,
          11,
          delta,
        )
      })
    }
  })

  return (
    <>
      <ActivityDriver activityRef={activityRef} />
      <group ref={groupRef} position={[1.1, 0.2, -0.18]}>
        <group ref={filamentsRef} rotation={[0.25, 0.15, 0.5]}>
          {filamentGeometries.map((geometry, index) => (
            <mesh key={index} geometry={geometry}>
              <meshBasicMaterial
                color={palette[0] ?? '#ff4b3e'}
                transparent
                opacity={0.04 + index * 0.009}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
        <mesh ref={primaryRef} material={primaryMaterial} rotation={[0.2, -0.4, 0.18]}>
          <icosahedronGeometry args={[1.58, quality.primaryDetail]} />
        </mesh>
        {compact ? null : (
          <mesh
            ref={secondaryRef}
            material={secondaryMaterial}
            position={[-1.65, -1.05, -0.72]}
            scale={0.5}
            rotation={[-0.4, 0.55, 0.3]}
          >
            <icosahedronGeometry args={[1.2, quality.secondaryDetail]} />
          </mesh>
        )}
        <points ref={pointsRef} rotation={[0.35, 0.15, -0.65]}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[particles, 3]} />
          </bufferGeometry>
          <pointsMaterial
            color={palette[0] ?? '#ff4b3e'}
            size={0.022}
            sizeAttenuation
            transparent
            opacity={0.5}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
        <group ref={nodesRef} rotation={[0.35, 0.15, -0.65]}>
          {nodePositions.map((position, index) => (
            <mesh key={`${palette[index]}-${index}`} position={position}>
              <sphereGeometry
                args={[
                  0.055,
                  quality.nodeSegments,
                  quality.nodeSegments,
                ]}
              />
              <meshBasicMaterial
                color={palette[index]}
                transparent
                opacity={index === 0 ? 0.92 : 0.24}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      </group>
    </>
  )
}

export default function LiquidCurrentScene(props: LiquidCurrentSceneProps) {
  return (
    <div className="h2o-current-canvas" aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={props.compact ? webglMotionBudget.compact.dpr : webglMotionBudget.full.dpr}
        camera={{ position: [0, 0, 6.1], fov: 42, near: 0.1, far: 30 }}
        flat
        gl={{
          alpha: true,
          antialias: false,
          depth: false,
          stencil: false,
          precision: 'mediump',
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <CurrentScene {...props} />
      </Canvas>
    </div>
  )
}
