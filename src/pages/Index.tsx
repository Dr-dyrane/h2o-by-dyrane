"use client"

import { useRef, useEffect } from "react"
import { CircleArrowDown, Droplets, Sparkles, Infinity, Waves } from "lucide-react"
import ProjectCard from "../components/ProjectCard"
import WaterBottleBackground from "@/components/WaterBottleBackground"
import MouseMoveEffect from "@/components/MouseMoveEffect"
import { motion } from "framer-motion";
import { SocialSidebar } from "@/components/social-sidebar"
import { cn } from "@/lib/utils"
import { projects } from "@/data/projects"
import Footer from "./Footer"

interface Feature {
  title: string
  description: string
  icon: JSX.Element
}

const features: Feature[] = [
  {
    title: "Premium Quality",
    description: "Crafted with precision and care",
    icon: <Sparkles className="h-8 w-8" />,
  },
  {
    title: "Sustainable",
    description: "Eco-friendly materials",
    icon: <Infinity className="h-8 w-8" />,
  },
  {
    title: "Pure Design",
    description: "Minimal and elegant",
    icon: <Waves className="h-8 w-8" />,
  },
  {
    title: "Refreshing",
    description: "Stay hydrated in style",
    icon: <Droplets className="h-8 w-8" />,
  },
]

const Index = () => {
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up")
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll(".animate-on-scroll").forEach((element) => {
      observerRef.current?.observe(element)
    })

    return () => observerRef.current?.disconnect()
  }, [])


  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }

  function FloatingBottle({
    className,
    delay = 0,
    rotate = 0,
    src,
  }: {
    className?: string;
    delay?: number;
    rotate?: number;
    src: string;
  }) {
    return (
      <motion.div
        initial={{
          opacity: 0,
          y: -150,
          rotate: rotate - 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
          rotate: rotate,
        }}
        transition={{
          duration: 2.4,
          delay,
          ease: [0.23, 0.86, 0.39, 0.96],
          opacity: { duration: 1.2 },
        }}
        className={cn("absolute", className)}
      >
        <motion.img
          src={src}
          alt="Water Bottle"
          animate={{
            y: [0, 15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="relative drop-shadow-lg max-w-none"
        />
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen geometric-bg relative text-center">
      <MouseMoveEffect />
      <SocialSidebar />
      <div className="absolute -z-10 inset-0 overflow-hidden pointer-events-none">
        {/* Two floating water bottles */}
        <FloatingBottle className="top-0 right-1/3" rotate={15} delay={1} src="hero/water-bottle-1.png" />
        <FloatingBottle className="bottom-0 right-1/5" rotate={-25} delay={1.5} src="hero/water-bottle-2.png" />
      </div>

      {/* Hero Section - Water Bottle Branding */}
      <section className="relative flex h-screen flex-col items-center justify-center px-4 text-center overflow-hidden">
        <WaterBottleBackground />
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="inline-flex z-50 items-center gap-2 px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.08] mb-8 md:mb-12"
        >
          <img src="logo.png" alt="Dyrane UI" width={20} height={20} className="border border-black/15 rounded-full" />
          <span className="text-sm text-black/60 tracking-wide">Dyrane UI</span>
        </motion.div>

        <div className="relative z-10 flex flex-col items-center justify-center p-8 group">
          {/* Glass Background */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm group-hover:backdrop-blur-none rounded-3xl"></div>

          {/* Expanding Black Overlay on Hover */}
          <div className="absolute left-0 top-0 w-full h-0 bg-black rounded-3xl transition-all duration-500 ease-in-out group-hover:h-full opacity-80"></div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Text with Hover Transition */}
            <h1 className="mb-6 text-6xl font-bold gradient-text md:text-8xl p-4 transition-all duration-300 group-hover:text-white">
              H₂O <span className="text-2xl italic">by dyrane</span>
            </h1>
            <p className="mb-8 max-w-2xl text-lg font-light tracking-wide opacity-80 transition-opacity duration-300 group-hover:text-white">
              Revolutionizing hydration through innovative design and sustainable solutions
            </p>

            {/* Bouncing Scroll Arrow */}
            <CircleArrowDown
              className="mt-8 group-hover:text-white h-12 w-12 animate-bounce cursor-pointer opacity-50 transition-opacity hover:opacity-100"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
            />
          </div>
        </div>

      </section>

      {/* Features Grid */}
      <section className="px-4 py-20">
        <h2 className="animate-on-scroll mb-16 text-center text-4xl font-bold">Why Choose Us</h2>
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="animate-on-scroll glass group cursor-pointer rounded-xl p-6 transition-all duration-300 hover:bg-black hover:text-white border border-black/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 transition-transform duration-300 group-hover:scale-110">{feature.icon}</div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-sm opacity-70">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="mb-20 px-4">
        <div className="mx-auto max-w-4xl rounded-2xl bg-black p-12 text-center text-white">
          <h2 className="mb-6 text-3xl font-bold">Ready to Transform Your Brand?</h2>
          <p className="mb-8 text-lg opacity-80">Let's create something extraordinary together</p>
          <button className="rounded-full relative group border-2 border-white px-8 py-3 text-lg font-medium transition-all hover:bg-white duration-300 hover:text-black overflow-hidden">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-full bg-black rounded-full transition-transform duration-500 ease-in-out group-hover:w-full group-hover:translate-x-full"></div>
            <span className="relative z-10">Get Started</span>
          </button>
        </div>
      </section>

      {/* Other Projects Section */}
      <section className="px-4 py-20">
        <h2 className="animate-on-scroll mb-16 text-center text-4xl font-bold">More Projects by Dr. Dyrane</h2>
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Index

