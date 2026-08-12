import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
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
import { LiquidCurrentCanvas } from './LiquidCurrentCanvas'

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
  register,
}: {
  project: ImmersiveProject
  index: number
  register: (element: HTMLElement | null, index: number) => void
}) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const mediaScale = useTransform(scrollYProgress, [0, 0.24, 0.74, 1], [0.9, 1, 1, 0.94])
  const mediaY = useTransform(scrollYProgress, [0, 0.5, 1], ['8%', '0%', '-7%'])
  const copyY = useTransform(scrollYProgress, [0, 0.5, 1], ['11%', '0%', '-10%'])
  const opacity = useTransform(scrollYProgress, [0, 0.13, 0.84, 1], [0.2, 1, 1, 0.18])
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
    >
      <div className="h2o-project-sticky">
        <div className="h2o-project-glow" aria-hidden="true" />

        <motion.div className="h2o-project-media" style={{ scale: mediaScale, y: mediaY, opacity }}>
          <div className="h2o-project-media__wash" aria-hidden="true" />
          <ProjectImage
            image={project.desktop}
            className="h2o-project-media__desktop"
            loading={index < 2 ? 'eager' : 'lazy'}
          />
          <motion.div
            className="h2o-project-media__mobile-shell"
            initial={{ y: 42, rotate: 3, opacity: 0 }}
            whileInView={{ y: 0, rotate: -1.5, opacity: 1 }}
            viewport={{ amount: 0.35, once: false }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProjectImage image={project.mobile} className="h2o-project-media__mobile" />
          </motion.div>
          <span className="h2o-project-media__index" aria-hidden="true">
            {project.sequence}
          </span>
        </motion.div>

        <motion.div className="h2o-project-copy" style={{ y: copyY, opacity }}>
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

function ModeStatement({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: string
}) {
  return (
    <motion.article
      className="h2o-mode"
      initial={{ y: 34, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ amount: 0.45, once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{children}</p>
    </motion.article>
  )
}

export default function ImmersivePortfolio() {
  const chapterRefs = useRef<Array<HTMLElement | null>>([])
  const progressRef = useRef(0)
  const activeIndexRef = useRef(0)
  const activityRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll()
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.25 })
  const heroCopyY = useTransform(scrollYProgress, [0, 0.18], [0, -130])
  const heroCopyOpacity = useTransform(scrollYProgress, [0, 0.14], [1, 0])
  const heroWordSpacing = useTransform(scrollYProgress, [0, 0.12], ['-0.07em', '-0.03em'])

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
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
      <motion.div className="h2o-scroll-progress" style={{ scaleX: progressScale }} />

      <nav className="h2o-nav" aria-label="Primary navigation">
        <a className="h2o-nav__brand" href="#top" aria-label="H2O by Dyrane, back to top">
          <span>H₂O</span>
          <small>by Dyrane</small>
        </a>
        <div className="h2o-nav__links">
          <a href="#work">Work</a>
          <a href="#practice">Practice</a>
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

      <section className="h2o-hero" aria-labelledby="h2o-hero-title">
        <div className="h2o-hero__sticky">
          <motion.div className="h2o-hero__copy" style={{ y: heroCopyY, opacity: heroCopyOpacity }}>
            <p className="h2o-eyebrow">
              Alexander Udeogaranya · Doctor · Product designer · Software engineer
            </p>
            <motion.h1 id="h2o-hero-title" style={{ letterSpacing: heroWordSpacing }}>
              <span>A body</span>
              <span>of work</span>
              <em>in motion.</em>
            </motion.h1>
            <div className="h2o-hero__footer">
              <p>
                I observe complex systems, build the product, then stay for what happens in the
                real world.
              </p>
              <a href="#work">
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

      <section className="h2o-thesis" id="practice" aria-labelledby="h2o-thesis-title">
        <p className="h2o-section-label">The practice</p>
        <motion.h2
          id="h2o-thesis-title"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ amount: 0.25, once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          Most portfolios show finished screens. This one follows the judgment that moved between
          them.
        </motion.h2>
        <div className="h2o-modes">
          <ModeStatement number="01" title="Observe">
            Medicine taught me to notice the system around the symptom: stakes, uncertainty, trust,
            and what breaks under pressure.
          </ModeStatement>
          <ModeStatement number="02" title="Build">
            I turn that reading into interfaces, architecture, interaction, and working software.
          </ModeStatement>
          <ModeStatement number="03" title="Operate">
            Shipping changes the question. I stay for reliability, users, handoffs, evidence, and
            the consequences of the product.
          </ModeStatement>
        </div>
      </section>

      <section className="h2o-work" id="work" aria-labelledby="h2o-work-title">
        <header className="h2o-work__intro">
          <p className="h2o-section-label">Selected current · 2024—2026</p>
          <h2 id="h2o-work-title">Six systems. Six different kinds of consequence.</h2>
        </header>

        {immersiveProjects.map((project, index) => (
          <ProjectChapter
            key={project.id}
            project={project}
            index={index}
            register={registerChapter}
          />
        ))}
      </section>

      <section className="h2o-archive" aria-labelledby="h2o-archive-title">
        <div className="h2o-archive__heading">
          <p className="h2o-section-label">The wider current</p>
          <h2 id="h2o-archive-title">Not every experiment becomes a flagship. Every one changes the next.</h2>
        </div>
        <div className="h2o-archive__grid">
          {archiveProjects.map((project, index) => (
            <motion.article
              key={project.title}
              className="h2o-archive-card"
              initial={{ y: 32, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ amount: 0.25, once: true }}
              transition={{ duration: 0.65, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={project.image} alt={`${project.title} product interface`} loading="lazy" />
              <div>
                <span>{project.period}</span>
                <h3>{project.title}</h3>
                <p>{project.category}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="h2o-contact" id="contact" aria-labelledby="h2o-contact-title">
        <p className="h2o-section-label">The next current</p>
        <h2 id="h2o-contact-title">
          Bring me the problem that is still difficult after the meeting ends.
        </h2>
        <p>
          Product strategy, interface direction, full-stack engineering, spatial web, and the
          operational work required to make the idea survive contact with reality.
        </p>
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
        <footer>
          <span>H₂O by Dyrane</span>
          <span>California · Nigeria · Worldwide</span>
          <span>© {new Date().getFullYear()}</span>
        </footer>
      </section>
    </main>
  )
}
