import { useState, useEffect, useRef } from "react";
import { CommandCenter } from "@/components/CommandCenter";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ProjectOverlay } from "@/components/ProjectOverlay";
import { ContributionGraph } from "@/components/ContributionGraph";
import { SocialSidebar } from "@/components/social-sidebar";
import { MatrixBackground } from "@/components/MatrixBackground";
import Footer from "@/pages/Footer";
import { Project } from "@/data/projects";
import { ArrowUpRight, ChevronDown } from "lucide-react";

const TypewriterEffect = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (index >= words.length) {
      setIndex(0);
      return;
    }

    // Pause at full word before reversing
    if (subIndex === words[index].length && !reverse) {
      const hold = setTimeout(() => setReverse(true), 2000);
      return () => clearTimeout(hold);
    }

    // Switch word after deleting
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    // Consistent timing — no jitter
    const speed = reverse ? 60 : 100;
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <span className="inline-flex items-baseline">
      <span>{words[index].substring(0, subIndex)}</span>
      <span className="ml-0.5 w-[2px] h-[0.85em] bg-current inline-block animate-pulse" />
    </span>
  );
};

// Fade-in on scroll hook
const useFadeIn = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, className: `transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}` };
};

const Index = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  const aboutFade = useFadeIn();
  const graphFade = useFadeIn();

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setTimeout(() => setSelectedProject(null), 500);
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] font-sans text-[var(--text)] overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200 transition-colors duration-300">

      {/* Interactive Matrix Background */}
      <MatrixBackground />

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full animate-pulse-slow delay-1000" />
      </div>

      <CommandCenter />
      <SocialSidebar />

      <main className="relative z-10 pt-32 pb-20 md:pb-20 pb-24">
        {/* Hero Section */}
        <div className={`max-w-7xl mx-auto px-6 mb-20 transition-all duration-1000 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          {/*
            Fixed-height hero text block prevents Y-axis glitch.
            The h1 reserves 2 lines so the typewriter never causes layout shift.
          */}
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-6 font-mono min-h-[7rem] md:min-h-[10rem]">
            Architecting{" "}
            <span className="text-[var(--text-dim)] inline-block">
              <TypewriterEffect words={["Digital Intelligence.", "Logistics Engines.", "Neural Layers.", "Future Systems."]} />
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-[var(--text-muted)] max-w-2xl font-light leading-relaxed font-sans mb-12">
            A collective of proprietary infrastructure, logistics engines, and high-fidelity interfaces built for the next generation of the web.
          </p>

          {/* Hero CTAs */}
          <div className={`flex flex-col sm:flex-row items-start gap-4 transition-all duration-1000 delay-300 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <a
              href="mailto:hello@dyrane.tech?subject=Project%20Inquiry"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[var(--cta-bg)] text-[var(--cta-text)] font-medium rounded-full hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_var(--glow-color)]"
            >
              Start a Project <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href="#logistics-engine"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[var(--cta-secondary-bg)] text-[var(--cta-secondary-text)] font-medium rounded-full hover:bg-[var(--cta-secondary-hover)] hover:text-[var(--text)] transition-all duration-300"
            >
              View My Work <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* About Section */}
        <div ref={aboutFade.ref} className={`max-w-7xl mx-auto px-6 mb-20 ${aboutFade.className}`}>
          <div className="relative rounded-2xl bg-[var(--surface-card)] p-8 md:p-12 overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative flex flex-col md:flex-row gap-10 items-start">
              {/* Identity */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-[var(--surface-card-hover)] flex items-center justify-center text-3xl font-light text-[var(--text-muted)] font-mono">
                  AD
                </div>
              </div>

              {/* Bio */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl text-[var(--text)] font-medium tracking-tight mb-1">
                    Alexander Dyrane
                  </h2>
                  <p className="text-emerald-400/80 text-sm font-mono uppercase tracking-widest">
                    Systems Architect · Full-Stack Engineer
                  </p>
                </div>
                <p className="text-[var(--text-muted)] leading-relaxed max-w-2xl text-lg font-light">
                  I design and build production-grade software systems — from emergency logistics platforms processing real-time dispatch, to AI-powered educational tools, to fintech infrastructure for emerging markets. Every project below is live, maintained, and serving real users.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  {["TypeScript", "React", "Next.js", "Node.js", "Python", "PostgreSQL", "Supabase"].map(tech => (
                    <span key={tech} className="px-3 py-1 rounded-full bg-[var(--surface-card)] text-[var(--text-dim)] text-xs font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Graph */}
        <div ref={graphFade.ref} className={graphFade.className}>
          <ContributionGraph />
        </div>

        <ProjectGrid onProjectSelect={handleProjectSelect} />
      </main>

      <Footer />

      <ProjectOverlay
        project={selectedProject}
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
      />
    </div>
  );
};

export default Index;
