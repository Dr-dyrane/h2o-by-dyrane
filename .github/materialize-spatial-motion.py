from pathlib import Path
import json

ROOT = Path('.')


def replace_once(source: str, old: str, new: str, label: str) -> str:
    count = source.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected exactly one match, found {count}')
    return source.replace(old, new, 1)


def replace_between(source: str, start: str, end: str, replacement: str, label: str) -> str:
    start_index = source.find(start)
    if start_index < 0:
        raise SystemExit(f'{label}: start marker not found')
    end_index = source.find(end, start_index)
    if end_index < 0:
        raise SystemExit(f'{label}: end marker not found')
    return source[:start_index] + replacement.rstrip() + '\n' + source[end_index:]


def read_fragment(name: str) -> str:
    return (ROOT / '.github' / 'spatial' / name).read_text()


portfolio_path = ROOT / 'src/components/immersive/ImmersivePortfolio.tsx'
portfolio = portfolio_path.read_text()
portfolio = replace_once(
    portfolio,
    "  useMotionValueEvent,\n  useScroll,",
    "  useMotionValueEvent,\n  useReducedMotion,\n  useScroll,",
    'portfolio import useReducedMotion',
)
portfolio = replace_once(
    portfolio,
    "import { motionSprings } from '@/motion/tokens'\n",
    "import { motionSprings } from '@/motion/tokens'\nimport { useSpatialPointer, useViewportSpatialPointer } from '@/motion/useSpatialPointer'\n",
    'portfolio import spatial pointer',
)
portfolio = replace_between(
    portfolio,
    'function ProjectChapter({',
    '\ntype PracticeStep =',
    read_fragment('project-chapter.txt'),
    'ProjectChapter',
)
portfolio = replace_between(
    portfolio,
    'function SpatialPractice()',
    '\nfunction ArchiveCurrent()',
    read_fragment('practice.txt'),
    'SpatialPractice',
)
portfolio = replace_between(
    portfolio,
    'function ArchiveCurrent()',
    '\nfunction EndCredits()',
    read_fragment('archive.txt'),
    'ArchiveCurrent',
)
portfolio = replace_once(
    portfolio,
    "  const activityRef = useRef(0)\n  const [activeIndex, setActiveIndex] = useState(0)",
    "  const activityRef = useRef(0)\n  const shouldReduceMotion = useReducedMotion()\n  const spatialEnabled = shouldReduceMotion !== true\n  const pointerField = useViewportSpatialPointer(activityRef, spatialEnabled)\n  const [activeIndex, setActiveIndex] = useState(0)",
    'portfolio pointer field hook',
)
portfolio = replace_once(
    portfolio,
    "  const heroWordSpacing = useTransform(smoothHeroProgress, [0, 0.7], ['-0.07em', '-0.035em'])\n",
    "  const heroWordSpacing = useTransform(smoothHeroProgress, [0, 0.7], ['-0.07em', '-0.035em'])\n"
    "  const heroPointerX = useTransform(pointerField.x, [-1, 1], [-12, 12])\n"
    "  const heroPointerY = useTransform(pointerField.y, [-1, 1], [-8, 8])\n"
    "  const heroPointerRotateX = useTransform(pointerField.y, [-1, 1], [1.4, -1.4])\n"
    "  const heroPointerRotateY = useTransform(pointerField.x, [-1, 1], [-2.1, 2.1])\n"
    "  const heroPointerScale = useTransform(pointerField.presence, [0, 1], [1, 1.006])\n"
    "  const heroCountX = useTransform(pointerField.x, [-1, 1], [5, -5])\n"
    "  const heroCountY = useTransform(pointerField.y, [-1, 1], [3, -3])\n"
    "  const heroLightX = useTransform(pointerField.x, [-1, 1], [-210, 210])\n"
    "  const heroLightY = useTransform(pointerField.y, [-1, 1], [-130, 130])\n"
    "  const heroLightOpacity = useTransform(pointerField.presence, [0, 1], [0, 0.86])\n",
    'portfolio hero pointer transforms',
)
portfolio = replace_once(
    portfolio,
    '    <main className="h2o-immersive" id="top">',
    "    <main className=\"h2o-immersive\" id=\"top\" data-spatial-input={spatialEnabled ? 'enabled' : 'reduced'}>",
    'portfolio spatial input marker',
)
portfolio = replace_once(
    portfolio,
    "        activityRef={activityRef as MutableRefObject<number>}\n        palette={palette}",
    "        activityRef={activityRef as MutableRefObject<number>}\n        pointerRef={pointerField.pointerRef}\n        palette={palette}",
    'portfolio canvas pointer prop',
)
portfolio = replace_between(
    portfolio,
    '      <section ref={heroRef} className="h2o-hero" aria-labelledby="h2o-hero-title">',
    '\n\n      <SpatialPractice />',
    read_fragment('hero.txt'),
    'portfolio hero block',
)
portfolio = replace_once(
    portfolio,
    '      <SpatialPractice />',
    "      <SpatialPractice\n        pointerX={pointerField.x}\n        pointerY={pointerField.y}\n        pointerPresence={pointerField.presence}\n      />",
    'portfolio practice pointer props',
)
portfolio = replace_once(
    portfolio,
    "            active={index === activeIndex}\n            register={registerChapter}",
    "            active={index === activeIndex}\n            spatialEnabled={spatialEnabled}\n            register={registerChapter}",
    'portfolio project pointer prop',
)
portfolio = replace_once(
    portfolio,
    '      <ArchiveCurrent />',
    '      <ArchiveCurrent spatialEnabled={spatialEnabled} />',
    'portfolio archive pointer prop',
)
portfolio_path.write_text(portfolio)

canvas_path = ROOT / 'src/components/immersive/LiquidCurrentCanvas.tsx'
canvas = canvas_path.read_text()
canvas = replace_once(
    canvas,
    "import { webglMotionBudget } from '@/motion/tokens'\n",
    "import { webglMotionBudget } from '@/motion/tokens'\nimport type { SpatialPointerSnapshot } from '@/motion/useSpatialPointer'\n",
    'canvas pointer type import',
)
canvas = replace_once(
    canvas,
    "  activityRef: MutableRefObject<number>\n  palette: string[]",
    "  activityRef: MutableRefObject<number>\n  pointerRef: MutableRefObject<SpatialPointerSnapshot>\n  palette: string[]",
    'canvas pointer prop',
)
canvas_path.write_text(canvas)

scene_path = ROOT / 'src/components/immersive/LiquidCurrentScene.tsx'
scene = scene_path.read_text()
scene = replace_once(
    scene,
    "import { frameBlend, webglMotionBudget } from '@/motion/tokens'\n",
    "import { frameBlend, webglMotionBudget } from '@/motion/tokens'\nimport type { SpatialPointerSnapshot } from '@/motion/useSpatialPointer'\n",
    'scene pointer type import',
)
scene = replace_once(
    scene,
    "  activityRef: MutableRefObject<number>\n  palette: string[]",
    "  activityRef: MutableRefObject<number>\n  pointerRef: MutableRefObject<SpatialPointerSnapshot>\n  palette: string[]",
    'scene pointer interface',
)
scene = replace_once(
    scene,
    "  activityRef,\n  palette,",
    "  activityRef,\n  pointerRef,\n  palette,",
    'scene pointer destructure',
)
scene = replace_once(
    scene,
    "    const events: Array<keyof WindowEventMap> = ['scroll', 'resize']",
    "    const events: Array<keyof WindowEventMap> = ['scroll', 'resize', 'pointermove']",
    'scene activity pointer event',
)
scene = replace_once(
    scene,
    "  const cameraTarget = useMemo(() => new THREE.Vector3(), [])\n  const cameraPosition = useMemo(() => new THREE.Vector3(), [])",
    "  const cameraTarget = useMemo(() => new THREE.Vector3(), [])\n  const cameraPosition = useMemo(() => new THREE.Vector3(), [])\n  const pointerPosition = useMemo(() => new THREE.Vector2(), [])",
    'scene pointer vector',
)
scene = replace_once(
    scene,
    "    const phase = progress * Math.PI * 3.6\n    targetAccent.set(palette[activeIndex] ?? palette[0] ?? '#ff4b3e')",
    "    const phase = progress * Math.PI * 3.6\n"
    "    const pointer = pointerRef.current\n"
    "    pointerPosition.x = THREE.MathUtils.damp(\n"
    "      pointerPosition.x,\n"
    "      pointer.x * pointer.presence,\n"
    "      10.5,\n"
    "      delta,\n"
    "    )\n"
    "    pointerPosition.y = THREE.MathUtils.damp(\n"
    "      pointerPosition.y,\n"
    "      pointer.y * pointer.presence,\n"
    "      10.5,\n"
    "      delta,\n"
    "    )\n"
    "    targetAccent.set(palette[activeIndex] ?? palette[0] ?? '#ff4b3e')",
    'scene pointer damping',
)
scene = replace_once(
    scene,
    "        progress * Math.PI * 2.15 + Math.sin(phase) * 0.22,",
    "        progress * Math.PI * 2.15 + Math.sin(phase) * 0.22 + pointerPosition.x * 0.18,",
    'scene group y pointer',
)
scene = replace_once(
    scene,
    "        -0.13 + Math.cos(phase * 0.72) * 0.12,",
    "        -0.13 + Math.cos(phase * 0.72) * 0.12 + pointerPosition.y * 0.12,",
    'scene group x pointer',
)
scene = replace_once(
    scene,
    "        1.1 + Math.sin(phase * 0.82) * 0.95 + activeDirection * 0.16,",
    "        1.1 + Math.sin(phase * 0.82) * 0.95 + activeDirection * 0.16 + pointerPosition.x * 0.32,",
    'scene group position x pointer',
)
scene = replace_once(
    scene,
    "        0.2 + Math.cos(phase * 0.64) * 0.38 - progress * 0.46,",
    "        0.2 + Math.cos(phase * 0.64) * 0.38 - progress * 0.46 - pointerPosition.y * 0.24,",
    'scene group position y pointer',
)
scene = replace_once(
    scene,
    "        -0.18 + Math.sin(phase * 0.48) * 0.72,",
    "        -0.18 + Math.sin(phase * 0.48) * 0.72 + pointerPosition.y * 0.12,",
    'scene group position z pointer',
)
scene = replace_once(
    scene,
    "      Math.sin(phase * 0.42) * 0.62,\n      Math.cos(phase * 0.35) * 0.26,\n      6.1 + Math.sin(phase * 0.26) * 0.38,",
    "      Math.sin(phase * 0.42) * 0.62 + pointerPosition.x * 0.28,\n      Math.cos(phase * 0.35) * 0.26 - pointerPosition.y * 0.18,\n      6.1 + Math.sin(phase * 0.26) * 0.38 + Math.abs(pointerPosition.x) * 0.08,",
    'scene camera pointer',
)
scene = replace_once(
    scene,
    "    cameraTarget.set(Math.sin(phase * 0.5) * 0.22, -progress * 0.38, -0.35)",
    "    cameraTarget.set(\n"
    "      Math.sin(phase * 0.5) * 0.22 + pointerPosition.x * 0.18,\n"
    "      -progress * 0.38 - pointerPosition.y * 0.13,\n"
    "      -0.35,\n"
    "    )",
    'scene camera target pointer',
)
scene = replace_once(
    scene,
    "      pointsRef.current.rotation.z = -0.65 + Math.sin(phase * 0.35) * 0.16",
    "      pointsRef.current.rotation.z = -0.65 + Math.sin(phase * 0.35) * 0.16 + pointerPosition.x * 0.08",
    'scene points pointer',
)
scene = replace_once(
    scene,
    "      filamentsRef.current.rotation.z = 0.5 + Math.sin(phase * 0.32) * 0.22",
    "      filamentsRef.current.rotation.z = 0.5 + Math.sin(phase * 0.32) * 0.22 + pointerPosition.y * 0.08",
    'scene filaments pointer',
)
scene_path.write_text(scene)

imports_path = ROOT / 'src/styles/immersive.css'
imports = imports_path.read_text()
imports = replace_once(
    imports,
    "@import './immersive/award-finish.css';\n",
    "@import './immersive/award-finish.css';\n@import './immersive/spatial-interaction.css';\n",
    'spatial stylesheet import',
)
imports_path.write_text(imports)

package_path = ROOT / 'package.json'
package_data = json.loads(package_path.read_text())
package_data['scripts']['verify:spatial'] = 'node scripts/verify-spatial-hover.mjs'
package_path.write_text(json.dumps(package_data, indent=2) + '\n')

visual_path = ROOT / '.github/workflows/visual-proof.yml'
visual = visual_path.read_text()
visual = replace_once(
    visual,
    "      - scripts/verify-visual.mjs\n",
    "      - scripts/verify-visual.mjs\n      - scripts/verify-spatial-hover.mjs\n",
    'visual workflow spatial path',
)
visual = replace_once(
    visual,
    "      - run: npm run verify:visual\n",
    "      - run: npm run verify:visual\n      - run: npm run verify:spatial\n",
    'visual workflow spatial proof',
)
visual = replace_once(
    visual,
    "          path: .visual-proof/\n",
    "          path: |\n            .visual-proof/\n            .spatial-proof/\n",
    'visual workflow artifact paths',
)
visual_path.write_text(visual)

print('Spatial motion patch materialized.')
