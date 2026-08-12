import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { ArrowDown, ArrowUpRight, Github, Mail } from 'lucide-react'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
} from 'react'
import {
  archiveProjects,
  immersiveProjects,
  liquidPalette,
  type ImmersiveProject,
  type ImmersiveProjectImage,
} from '@/data/immersiveProjects'
import { motionSprings } from '@/motion/tokens'
import { LiquidCurrentCanvas } from './LiquidCurrentCanvas'

const practiceSteps = [
  {
    number: '01',
    title: 'Observe',
    headline: 'Find the break.',
    copy: 'See the system around the symptom: stakes, uncertainty, trust, and what fails under pressure.',
  },
  {
    number: '02',
    title: 'Build',
    headline: 'Make it obvious.',
    copy: 'Turn that reading into hierarchy, interaction, architecture, and working software.',
  },
  {
    number: '03',
    title: 'Operate',
    headline: 'Stay for reality.',
    copy: 'Follow the handoffs, failures, evidence, and consequences after the product ships.',
  },
] as const

function ProjectImage({
  image,
  className,
  loading = 'lazy',
}: {
  image: ImmersiveProjectImage
  className: string
  loading?: 'eager' | 'lazy'
}) {
  const sources = useMemo(() => [image.src, ...image.fallbacks], [image.src, image.fallbacks])
  const [sourceIndex, setSourceIndex] = useState(0)

  useEffect(() => {
    setSourceIndex(0)
  }, [image.src])

  const source = sources[sourceIndex]
  if (!source) {
    return (
      <div className={`${className} h2o-project-image-fallback`} role="img" aria-label={image.alt}>
        <span>Live capture refreshing</span>
      </div>
    )
  }

  return (
    <img
      className={className}
      src={source}
      alt={image.alt}
      loading={loading}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setSourceIndex((current) => current + 1)}
    />
  )
}

function ProjectChapter({
  project,
  index,
  active,
  register,
}: {
  project: ImmersiveProject
  index: number
  active: boolean
  register: (element: HTMLElement | null, index: number) => void
}) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const direction = index % 2 === 0 ? 1 : -1
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const progress = useSpring(scrollYProgress, motionSprings.gallery)
  const mediaScale = useTransform(progress, [0, 0.24, 0.74, 1], [0.87, 1, 1, 0.92])
  const mediaX = useTransform(
    progress,
    [0, 0.24, 0.74, 1],
    [`${direction * 9}%`, '0%', '0%', `${direction * -5}%`],
  )
  const mediaY = useTransform(progress, [0, 0.5, 1], ['7%', '0%', '-6%'])
  const mediaRotateY = useTransform(
    progress,
    [0, 0.24, 0.74, 1],
    [direction * -7, 0, 0, direction * 4],
  )
  const copyX = useTransform(
    progress,
    [0, 0.24, 0.74, 1],
    [`${direction * -7}%`, '0%', '0%', `${direction * 6}%`],
  )
  const copyY = useTransform(progress, [0, 0.5, 1], ['8%', '0%', '-8%'])
  const copyScale = useTransform(progress, [0, 0.25, 0.76, 1], [0.95, 1, 1, 0.96])
  const opacity = useTransform(progress, [0, 0.12, 0.84, 1], [0.08, 1, 1, 0.12])
  const style = {
    '--project-accent': project.accent,
    '--project-accent-soft': project.accentSoft,
  } as CSSProperties

  return (
    <article
      id={project.id}
      ref={(element) => {
        sectionRef.current = element
        register(element, index)
      }}
      className="h2o-project-chapter"
      style={style}
      data-project-index={index}
      data-direction={direction > 0 ? 'forward' : 'reverse'}
      data-active={active ? 'true' : 'false'}
    >
      <div className="h2o-project-sticky">
        <div className="h2o-project-glow" aria-hidden="true" />

        <motion.div
          className="h2o-project-media"
          style={{ scale: mediaScale, x: mediaX, y: mediaY, rotateY: mediaRotateY, opacity }}
        >
          <div className="h2o-project-media__wash" aria-hidden="true" />
          <ProjectImage
            image={project.desktop}
            className="h2o-project-media__desktop"
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          <div className="h2o-project-media__mobile-shell">
            <ProjectImage image={project.mobile} className="h2o-project-media__mobile" />
          </div>
          <span className="h2o-project-media__index" aria-hidden="true">
            {project.sequence}
          </span>
          <a
            className="h2o-project-media-link"
            href={project.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.title} live experience`}
          >
            <span>Open {project.title}</span>
          </a>
        </motion.div>

        <motion.div
          className="h2o-project-copy"
          style={{ x: copyX, y: copyY, scale: copyScale, opacity }}
        >
          <div className="h2o-project-kicker">
            <span>{project.sequence}</span>
            <span>{project.category}</span>
            <span>{project.period}</span>
          </div>

          <h3>{project.title}</h3>
          <p className="h2o-project-statement">{project.statement}</p>
          <p className="h2o-project-description">{project.description}</p>

          <div className="h2o-project-proof">
            <span>Proof</span>
            <p>{project.proof}</p>
          </div>

          <div className="h2o-project-actions">
            <a href={project.url} target="_blank" rel="noreferrer">
              Open live experience
              <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.7} />
            </a>
            {project.secondaryUrl && project.secondaryLabel ? (
              <a
                className="h2o-project-actions__secondary"
                href={project.secondaryUrl}
                target="_blank"
                rel="noreferrer"
              >
                {project.secondaryLabel}
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.7} />
              </a>
            ) : null}
            <div className="h2o-project-modes" aria-label="Practice modes">
              {project.modes.map((mode) => (
                <span key={mode}>{mode}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </article>
  )
}

type PracticeStep = (typeof practiceSteps)[number]

type PracticeChoreography = {
  input: [number, number, number, number]
  x: [string, string, string, string]
  y: [string, string, string, string]
  z: [number, number, number, number]
  rotateY: [number, number, number, number]
  scale: [number, number, number, number]
  opacity: [number, number, number, number]
  wordX: [string, string, string, string]
}

const practiceChoreography: PracticeChoreography[] = [
  {
    input: [0, 0.08, 0.27, 0.43],
    x: ['0vw', '0vw', '0vw', '-44vw'],
    y: ['0vh', '0vh', '0vh', '-5vh'],
    z: [0, 0, 0, -720],
    rotateY: [0, 0, 0, 15],
    scale: [1, 1, 1, 0.72],
    opacity: [1, 1, 1, 0],
    wordX: ['0vw', '0vw', '0vw', '-16vw'],
  },
  {
    input: [0.18, 0.38, 0.57, 0.73],
    x: ['46vw', '0vw', '0vw', '-42vw'],
    y: ['7vh', '0vh', '0vh', '-5vh'],
    z: [-880, 0, 0, -680],
    rotateY: [-18, 0, 0, 14],
    scale: [0.68, 1, 1, 0.74],
    opacity: [0, 1, 1, 0],
    wordX: ['18vw', '0vw', '0vw', '-16vw'],
  },
  {
    input: [0.49, 0.7, 0.9, 1],
    x: ['46vw', '0vw', '0vw', '0vw'],
    y: ['7vh', '0vh', '0vh', '0vh'],
    z: [-880, 0, 0, 0],
    rotateY: [-18, 0, 0, 0],
    scale: [0.68, 1, 1, 1],
    opacity: [0, 1, 1, 1],
    wordX: ['18vw', '0vw', '0vw', '0vw'],
  },
]

function SpatialStep({
  step,
  index,
  progress,
}: {
  step: PracticeStep
  index: number
  progress: MotionValue<number>
}) {
  const choreography = practiceChoreography[index]
  const x = useTransform(progress, choreography.input, choreography.x)
  const y = useTransform(progress, choreography.input, choreography.y)
  const z = useTransform(progress, choreography.input, choreography.z)
  const rotateY = useTransform(progress, choreography.input, choreography.rotateY)
  const scale = useTransform(progress, choreography.input, choreography.scale)
  const opacity = useTransform(progress, choreography.input, choreography.opacity)
  const wordX = useTransform(progress, choreography.input, choreography.wordX)

  return (
    <motion.article
      className="h2o-practice__stage"
      style={{ x, y, z, rotateY, scale, opacity }}
      data-stage={step.number}
    >
      <motion.span className="h2o-practice__number" style={{ x: wordX }} aria-hidden="true">
        {step.number}
      </motion.span>
      <div className="h2o-practice__copy">
        <p>
          {step.number} · {step.title}
        </p>
        <h2>{step.headline}</h2>
        <span>{step.copy}</span>
      </div>
    </motion.article>
  )
}

function SpatialPractice() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const progress = useSpring(scrollYProgress, motionSprings.spatial)
  const currentX = useTransform(progress, [0, 1], ['18vw', '-24vw'])
  const currentZ = useTransform(progress, [0, 0.5, 1], [-420, 40, -460])
  const currentOpacity = useTransform(progress, [0, 0.5, 1], [0.1, 0.22, 0.08])

  return (
    <section ref={sectionRef} className="h2o-practice" id="practice" aria-label="How the work moves">
      <div className="h2o-practice__sticky">
        <p className="h2o-section-label h2o-practice__label">How the work moves</p>
        <motion.div
          className="h2o-practice__current-word"
          style={{ x: currentX, z: currentZ, opacity: currentOpacity }}
          aria-hidden="true"
        >
          CURRENT
        </motion.div>
        {practiceSteps.map((step, index) => (
          <SpatialStep key={step.number} step={step} index={index} progress={progress} />
        ))}
      </div>
    </section>
  )
}

function ArchiveCurrent() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const progress = useSpring(scrollYProgress, motionSprings.gallery)
  const railX = useTransform(progress, [0, 0.08, 0.92, 1], ['8vw', '6vw', '-68%', '-70%'])
  const wordX = useTransform(progress, [0, 1], ['18vw', '-28vw'])
  const wordZ = useTransform(progress, [0, 0.55, 1], [-520, 40, -620])

  return (
    <section ref={sectionRef} className="h2o-archive" id="archive" aria-labelledby="h2o-archive-title">
      <div className="h2o-archive__sticky">
        <div className="h2o-archive__heading">
          <p className="h2o-section-label">The wider current</p>
          <h2 id="h2o-archive-title">Experiments that changed what came next.</h2>
        </div>
        <motion.div className="h2o-archive__word" style={{ x: wordX, z: wordZ }} aria-hidden="true">
          MORE WORK
        </motion.div>
        <motion.div className="h2o-archive__rail" style={{ x: railX }}>
          {archiveProjects.map((project, index) => {
            const cardStyle = {
              '--archive-tilt': `${index % 2 === 0 ? 5 : -6}deg`,
              '--archive-depth': `${index % 2 === 0 ? 0 : -90}px`,
            } as CSSProperties

            return (
              <article key={project.title} className="h2o-archive-card" style={cardStyle}>
                <img src={project.image} alt={`${project.title} product interface`} loading="lazy" />
                <div>
                  <span>{project.period}</span>
                  <h3>{project.title}</h3>
                  <p>{project.category}</p>
                </div>
              </article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function EndCredits() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const progress = useSpring(scrollYProgress, motionSprings.spatial)
  const contactY = useTransform(progress, [0, 0.38, 0.62], [0, 0, -170])
  const contactScale = useTransform(progress, [0, 0.38, 0.62], [1, 1, 0.84])
  const contactOpacity = useTransform(progress, [0, 0.4, 0.64], [1, 1, 0])
  const nameY = useTransform(progress, [0, 0.45, 0.8, 1], ['34vh', '24vh', '0vh', '-1vh'])
  const nameZ = useTransform(progress, [0, 0.45, 0.8, 1], [-800, -520, 0, 80])
  const nameScale = useTransform(progress, [0, 0.45, 0.8, 1], [0.58, 0.68, 1, 1.04])
  const nameOpacity = useTransform(progress, [0, 0.42, 0.76, 1], [0.05, 0.12, 0.88, 1])
  const letterSpacing = useTransform(
    progress,
    [0, 0.45, 0.8, 1],
    ['0.08em', '0.03em', '-0.08em', '-0.09em'],
  )

  return (
    <section ref={sectionRef} className="h2o-end" id="contact" aria-labelledby="h2o-contact-title">
      <div className="h2o-end__sticky">
        <motion.div
          className="h2o-end__contact"
          style={{ y: contactY, scale: contactScale, opacity: contactOpacity }}
        >
          <p className="h2o-section-label">The next current</p>
          <h2 id="h2o-contact-title">Bring me the difficult thing.</h2>
          <p>Strategy, interface, engineering—and the reality after launch.</p>
          <div className="h2o-contact__actions">
            <a href="mailto:hello@dyrane.tech">
              <Mail aria-hidden="true" size={19} strokeWidth={1.6} />
              Start a conversation
            </a>
            <a href="https://github.com/Dr-dyrane" target="_blank" rel="noreferrer">
              <Github aria-hidden="true" size={19} strokeWidth={1.6} />
              Read the code
            </a>
          </div>
        </motion.div>

        <motion.div
          className="h2o-end__name"
          style={{ y: nameY, z: nameZ, scale: nameScale, opacity: nameOpacity }}
          id="signature"
          aria-label="Dyrane, Alexander Udeogaranya"
        >
          <span>Alexander Udeogaranya</span>
          <motion.strong style={{ letterSpacing }}>DYRANE</motion.strong>
        </motion.div>

        <footer>
          <span>Doctor · Product designer · Software engineer</span>
          <span>California · Nigeria · Worldwide</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </div>
    </section>
  )
}

export default function ImmersivePortfolio() {
  const chapterRefs = useRef<Array<HTMLElement | null>>([])
  const heroRef = useRef<HTMLElement | null>(null)
  const progressRef = useRef(0)
  const activeIndexRef = useRef(0)
  const activityRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll()
  const smoothPageProgress = useSpring(scrollYProgress, motionSprings.world)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const smoothHeroProgress = useSpring(heroProgress, motionSprings.hero)
  const heroCopyX = useTransform(smoothHeroProgress, [0, 0.56, 1], ['0vw', '0vw', '-18vw'])
  const heroCopyY = useTransform(smoothHeroProgress, [0, 0.55, 1], [0, -30, -150])
  const heroCopyZ = useTransform(smoothHeroProgress, [0, 0.55, 1], [0, 0, -420])
  const heroCopyScale = useTransform(smoothHeroProgress, [0, 0.58, 1], [1, 1, 0.78])
  const heroCopyRotateY = useTransform(smoothHeroProgress, [0, 0.58, 1], [0, 0, 10])
  const heroCopyOpacity = useTransform(smoothHeroProgress, [0, 0.7, 1], [1, 1, 0])
  const heroWordSpacing = useTransform(smoothHeroProgress, [0, 0.7], ['-0.07em', '-0.035em'])

  useMotionValueEvent(smoothPageProgress, 'change', (value) => {
    progressRef.current = value
    activityRef.current = typeof performance === 'undefined' ? Date.now() : performance.now()
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!visible) return
        const nextIndex = Number((visible.target as HTMLElement).dataset.projectIndex ?? 0)
        activeIndexRef.current = nextIndex
        setActiveIndex(nextIndex)
        activityRef.current = performance.now()
      },
      {
        rootMargin: '-22% 0px -30% 0px',
        threshold: [0.2, 0.42, 0.64, 0.82],
      },
    )

    chapterRefs.current.forEach((chapter) => chapter && observer.observe(chapter))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const previous = root.style.backgroundColor
    root.style.backgroundColor = '#030506'
    return () => {
      root.style.backgroundColor = previous
    }
  }, [])

  const activeProject = immersiveProjects[activeIndex] ?? immersiveProjects[0]
  const palette = useMemo(() => liquidPalette, [])

  const registerChapter = (element: HTMLElement | null, index: number) => {
    chapterRefs.current[index] = element
  }

  return (
    <main className="h2o-immersive" id="top">
      <a className="h2o-skip-link" href="#work">
        Skip to selected work
      </a>

      <LiquidCurrentCanvas
        progressRef={progressRef as MutableRefObject<number>}
        activeIndexRef={activeIndexRef as MutableRefObject<number>}
        activityRef={activityRef as MutableRefObject<number>}
        palette={palette}
      />

      <div className="h2o-grain" aria-hidden="true" />

      <nav className="h2o-nav" aria-label="Primary navigation">
        <a className="h2o-nav__brand" href="#top" aria-label="H2O by Dyrane, back to top">
          <span>H₂O</span>
          <small>by Dyrane</small>
        </a>
        <div className="h2o-nav__links">
          <a href="#work">Work</a>
          <a href="#practice">Method</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="h2o-nav__status" aria-live="polite">
          <i style={{ background: activeProject.accent }} aria-hidden="true" />
          <span>{activeProject.title}</span>
          <b>
            {String(activeIndex + 1).padStart(2, '0')} / {String(immersiveProjects.length).padStart(2, '0')}
          </b>
        </div>
      </nav>

      <section ref={heroRef} className="h2o-hero" aria-labelledby="h2o-hero-title">
        <div className="h2o-hero__sticky">
          <motion.div
            className="h2o-hero__copy"
            style={{
              x: heroCopyX,
              y: heroCopyY,
              z: heroCopyZ,
              scale: heroCopyScale,
              rotateY: heroCopyRotateY,
              opacity: heroCopyOpacity,
            }}
          >
            <p className="h2o-eyebrow">
              Alexander Udeogaranya · Doctor · Product designer · Software engineer
            </p>
            <motion.h1 id="h2o-hero-title" style={{ letterSpacing: heroWordSpacing }}>
              <span>A body</span>
              <span>of work</span>
              <em>in motion.</em>
            </motion.h1>
            <div className="h2o-hero__footer">
              <p>I observe the system, build the product, and stay for reality.</p>
              <a href="#practice">
                Enter the current
                <ArrowDown aria-hidden="true" size={18} strokeWidth={1.7} />
              </a>
            </div>
          </motion.div>
          <div className="h2o-hero__count" aria-hidden="true">
            <strong>50+</strong>
            <span>builds, one current</span>
          </div>
        </div>
      </section>

      <SpatialPractice />

      <section className="h2o-work" id="work" aria-labelledby="h2o-work-title">
        <header className="h2o-work__intro">
          <p className="h2o-section-label">Selected current · 2024—2026</p>
          <h2 id="h2o-work-title">Six systems. Real consequences.</h2>
        </header>

        {immersiveProjects.map((project, index) => (
          <ProjectChapter
            key={project.id}
            project={project}
            index={index}
            active={index === activeIndex}
            register={registerChapter}
          />
        ))}
      </section>

      <ArchiveCurrent />
      <EndCredits />
    </main>
  )
}
