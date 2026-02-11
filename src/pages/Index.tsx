import { useState, useEffect } from "react";
import { CommandCenter } from "@/components/CommandCenter";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ProjectOverlay } from "@/components/ProjectOverlay";
import { ContributionGraph } from "@/components/ContributionGraph";
import { Project } from "@/data/projects";

const TypewriterEffect = ({ words }: { words: string[] }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (index >= words.length) {
      setIndex(0);
      return;
    }

    if (subIndex === words[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 75 : subIndex === words[index].length ? 1500 : 150, Math.random() * 50));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words]);

  return (
    <>
      {`${words[index].substring(0, subIndex)}${blink ? "|" : " "}`}
    </>
  );
};
const Index = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setTimeout(() => setSelectedProject(null), 500); // Clear after animation
  };

  return (
    <div className="min-h-screen bg-dyrane-black font-sans text-white overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">

      {/* Visual Texture: Grid Background */}
      <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none" />

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow delay-1000" />
      </div>

      <CommandCenter />

      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-6 font-mono">
            Architecting <span className="text-white/40">
              <TypewriterEffect words={["Digital Intelligence.", "Logistics Engines.", "Neural Layers.", "Future Systems."]} />
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 max-w-2xl font-light leading-relaxed font-sans">
            A collective of proprietary infrastructure, logistics engines, and high-fidelity interfaces built for the next generation of the web.
          </p>
        </div>

        <ContributionGraph />

        <ProjectGrid onProjectSelect={handleProjectSelect} />
      </main>

      {/* Footer / Contact */}
      <footer className="relative z-10 border-t border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white/40 text-sm">
            © {new Date().getFullYear()} Dyrane Intelligence Collective. All Systems Nominal.
          </div>
          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="https://github.com/Dr-dyrane" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors">
              GitHub
            </a>
            <a href="mailto:hello@dyrane.tech" className="text-white/60 hover:text-white transition-colors">
              Contact Protocol
            </a>
          </div>
        </div>
      </footer>

      <ProjectOverlay
        project={selectedProject}
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
      />
    </div>
  );
};

export default Index;
