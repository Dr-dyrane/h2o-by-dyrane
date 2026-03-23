import React from "react";
import { motion } from "framer-motion";
import { projects, Project } from "@/data/projects";
import { ShowcaseFeatures } from "@/components/ShowcaseFeatures";
import { ArrowUpRight } from "@/components/icons/lucide";
import { useTheme } from "@/components/ThemeProvider";

/**
 * Renders the device-framed screenshots used in the showcase section.
 */
const StaticSnapshot = ({ 
  desktop, 
  mobile, 
  secondaryMobile,
  layout,
  theme 
}: { 
  desktop?: { light: string; dark: string };
  mobile: { light: string; dark: string };
  secondaryMobile?: { light: string; dark: string };
  layout?: "single" | "dual-mobile";
  theme: "light" | "dark";
}) => {
  const [isHydrated, setIsHydrated] = React.useState(false);
  const isDual = layout === "dual-mobile";
  const hasDesktop = Boolean(desktop);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const resolvedTheme = isHydrated ? theme : "dark";
  const dImg = isHydrated && desktop ? (resolvedTheme === "dark" ? desktop.dark : desktop.light) : null;
  const mImg = isHydrated ? (resolvedTheme === "dark" ? mobile.dark : mobile.light) : null;
  const sImg = isHydrated && secondaryMobile ? (resolvedTheme === "dark" ? secondaryMobile.dark : secondaryMobile.light) : null;

  /**
   * Neutral placeholder shown until themed assets can be resolved on the client.
   */
  const ScreenFallback = () => (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]" />
  );

  /**
   * Desktop presentation frame for showcase screenshots.
   */
  const MacBookFrame = ({ 
    src, 
    alt, 
    theme: frameTheme,
    tiltDirection = "left"
  }: { 
    src?: string | null; 
    alt: string; 
    theme: "light" | "dark";
    tiltDirection?: "left" | "right" 
  }) => {
    const isDark = frameTheme === "dark";
    // Outer aluminum chassis
    const chassisBg = isDark ? "bg-[#e5e7eb]" : "bg-[#111111]";
    const chassisRing = isDark ? "ring-[#d1d5db]" : "ring-[#1a1a1a]";
    
    // Calculate resting 3D rotation based on tilt direction
    const restRotateY = tiltDirection === "left" ? 12 : -12;
    const restRotateZ = tiltDirection === "left" ? -2 : 2;

    return (
      <div className="relative group/mac w-full mx-auto max-w-[900px]" style={{ perspective: "2500px" }}>
        <motion.div
          style={{ transformStyle: "preserve-3d" }}
          initial={{ rotateX: 15, rotateY: restRotateY, rotateZ: restRotateZ, scale: 0.95, y: 20 }}
          whileInView={{ rotateX: 15, rotateY: restRotateY, rotateZ: restRotateZ, scale: 0.95, y: 20 }}
          viewport={{ once: false, margin: "-10%" }}
          whileHover={{ rotateX: 5, rotateY: restRotateY * 0.2, rotateZ: 0, scale: 1.02, y: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 20, mass: 1.5 }}
        >
          {/* Deep 3D Drop Shadow */}
          <div 
            className="absolute -inset-10 bg-black/50 blur-3xl rounded-[2rem] transition-all duration-700 pointer-events-none"
            style={{ transform: "translateZ(-100px)", opacity: 0.6 }}
          />

          {/* Aluminum Display Lid */}
          <div className={`relative p-[3px] md:p-2 overflow-hidden rounded-t-[1.4rem] ${chassisBg} ring-1 ${chassisRing} shadow-2xl`} style={{ transform: "translateZ(0px)" }}>
            
            {/* Inner Black Bezel */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl bg-black ring-1 ring-white/10 shadow-inner">
              {src ? (
                <img 
                  src={src} 
                  alt={alt} 
                  className="block w-full h-full object-cover transition-transform duration-1000 group-hover/mac:scale-[1.02] mt-[1px]"
                  style={{ borderRadius: "2px" }}
                  suppressHydrationWarning
                />
              ) : (
                <ScreenFallback />
              )}
              {/* Glass Sheen */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-40 mix-blend-overlay" />
              
              {/* True MacBook Camera Notch inside bezel */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70px] md:w-[120px] h-[10px] md:h-[16px] bg-black rounded-b-xl flex items-center justify-center gap-2">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-blue-500/20 shadow-[0_0_4px_rgba(59,130,246,0.5)]" />
                <div className="w-[2px] h-[2px] rounded-full bg-white/10" />
              </div>
            </div>
          </div>

          {/* MacBook Lower Deck (Hinge & Base) */}
          <div 
            className={`relative flex items-end h-3 md:h-5 w-[104%] -ml-[2%] rounded-b-xl md:rounded-b-2xl ${chassisBg} shadow-2xl ring-1 ${chassisRing}`}
            style={{ transform: "translateZ(4px)" }}
          >
            {/* Opening groove */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-32 h-[3px] md:h-[5px] ${isDark ? 'bg-black/10' : 'bg-white/10'} rounded-b-md shadow-inner`} />
          </div>
        </motion.div>
      </div>
    );
  };

  /**
   * Mobile presentation frame for showcase screenshots.
   */
  const IPhoneFrame = ({ 
    src, 
    alt, 
    theme: frameTheme, 
    className = "",
    tiltDirection = "center"
  }: { 
    src?: string | null; 
    alt: string; 
    theme: "light" | "dark"; 
    className?: string;
    tiltDirection?: "left" | "right" | "center"
  }) => {
    const isDark = frameTheme === "dark";
    const chassisBg = isDark ? "bg-[#e5e7eb]" : "bg-[#222222]";
    const chassisRing = isDark ? "ring-[#d1d5db]" : "ring-[#1a1a1a]";

    let restRotateY = 0;
    let restRotateZ = 0;
    if (tiltDirection === "left") { restRotateY = 20; restRotateZ = -4; }
    if (tiltDirection === "right") { restRotateY = -20; restRotateZ = 4; }
    if (tiltDirection === "center") { restRotateY = -12; restRotateZ = 2; }

    return (
      <div className={`relative group/phone mx-auto w-full w-max-[300px] ${className}`} style={{ perspective: "2000px" }}>
        <motion.div
          style={{ transformStyle: "preserve-3d" }}
          initial={{ rotateX: 10, rotateY: restRotateY, rotateZ: restRotateZ, scale: 0.9 }}
          whileInView={{ rotateX: 10, rotateY: restRotateY, rotateZ: restRotateZ, scale: 0.9 }}
          viewport={{ once: false, margin: "-10%" }}
          whileHover={{ rotateX: 0, rotateY: restRotateY * 0.3, rotateZ: 0, scale: 1.05, y: -20, z: 50 }}
          transition={{ type: "spring", stiffness: 150, damping: 20, mass: 1 }}
        >
          {/* Deep 3D Drop Shadow */}
          <div 
            className="absolute -inset-8 bg-black/60 blur-2xl rounded-[4rem] transition-all duration-700 pointer-events-none"
            style={{ transform: "translateZ(-80px)", opacity: 0.6 }}
          />

          {/* Side Buttons Outer */}
          <div className={`absolute -left-[3px] top-24 w-[3px] h-8 ${isDark ? 'bg-black/20' : 'bg-white/20'} rounded-l-md shadow-inner`} style={{ transform: "translateZ(-1px)" }} />
          <div className={`absolute -left-[3px] top-40 w-[3px] h-12 ${isDark ? 'bg-black/20' : 'bg-white/20'} rounded-l-md shadow-inner`} style={{ transform: "translateZ(-1px)" }} />
          <div className={`absolute -right-[3px] top-32 w-[3px] h-16 ${isDark ? 'bg-black/20' : 'bg-white/20'} rounded-r-md shadow-inner`} style={{ transform: "translateZ(-1px)" }} />

          {/* Main Aluminum Chassis */}
          <div className={`relative p-[4px] overflow-hidden rounded-[2.8rem] md:rounded-[3rem] ${chassisBg} shadow-2xl ring-[2px] ${chassisRing} ring-inset`} style={{ transform: "translateZ(0px)" }}>
            
            {/* Inner Black Bezel */}
            <div className={`relative aspect-[9/19.5] overflow-hidden rounded-[2.6rem] md:rounded-[2.8rem] bg-black ring-4 ring-black shadow-inner`}>
              {src ? (
                <img 
                  src={src} 
                  alt={alt} 
                  className="block w-full h-full object-cover transition-transform duration-1000 group-hover/phone:scale-[1.03]"
                  suppressHydrationWarning
                />
              ) : (
                <ScreenFallback />
              )}
              {/* Glass Sheen */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-40 mix-blend-overlay" />
              
              {/* Dynamic Island inside screen */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 md:w-24 h-[22px] md:h-7 bg-black rounded-full flex items-center justify-end px-3 shadow-[0_4px_10px_rgba(0,0,0,0.5)] border border-white/5">
                <div className="w-2 h-2 rounded-full bg-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.3)] ring-1 ring-white/10" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  if (isDual) {
    return (
      <div className="relative flex w-full justify-center md:gap-8 items-center h-[500px] md:h-[700px]">
        {/* Replace absolutely positioned 0-width collapse with robust flex layout */}
        <div className="w-[50%] md:w-[40%] max-w-[280px] z-10 translate-y-4 md:translate-y-12 translate-x-4 md:translate-x-0">
          <IPhoneFrame src={mImg} alt="Primary mobile interface" theme={resolvedTheme} tiltDirection="left" />
        </div>
        {secondaryMobile && (
          <div className="w-[50%] md:w-[40%] max-w-[280px] z-0 -translate-y-4 md:-translate-y-12 -translate-x-4 md:translate-x-0">
            <IPhoneFrame src={sImg} alt="Secondary mobile interface" theme={resolvedTheme} tiltDirection="right" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full py-12 md:py-20">
      {/* Desktop (MacBook context) */}
      {dImg && (
        <div className="hidden md:block">
          <MacBookFrame src={dImg} alt="Desktop dashboard" theme={resolvedTheme} tiltDirection="left" />
        </div>
      )}
      {!dImg && hasDesktop && (
        <div className="hidden md:block">
          <MacBookFrame alt="Desktop dashboard" theme={resolvedTheme} tiltDirection="left" />
        </div>
      )}
      
      {/* Mobile (iPhone context) */}
      <div className={hasDesktop ? 'block md:hidden' : 'block'}>
        <IPhoneFrame src={mImg} alt="Mobile interface" theme={resolvedTheme} tiltDirection="center" />
      </div>
    </div>
  );
};

/**
 * Image-forward section that expands the featured case studies with real product surfaces.
 */
export const ShowcaseSection: React.FC<{ onProjectSelect: (p: Project) => void }> = ({ onProjectSelect }) => {
  const { theme } = useTheme();
  
  // Flatten showcase items but keep reference to parent project title and category
  const featuredShowcase = projects
    .filter((p) => p.showcase && p.showcase.length > 0)
    .map(p => ({
        ...p.showcase![0],
        parentProjectTitle: p.title,
        category: p.category
    }));

  /**
   * Maps showcase categories to the correct semantic accent token.
   */
  const getAccentColor = (cat: string) => {
    if (cat === "Logistics Engine") return "var(--cat-logistics)";
    if (cat === "Intelligence Bridge") return "var(--cat-intelligence)";
    return "var(--cat-ux)";
  };

  if (featuredShowcase.length === 0) return null;

  return (
    <section id="showcase" className="relative w-full px-6 py-20 md:px-6 md:py-24 lg:py-28">
      {/* Massive Cinematic Typography Header */}
      <div className="mb-32 flex flex-col pt-12">
        <div className="relative w-full">
          <p className="mb-6 text-[11px] font-mono uppercase tracking-[0.4em] text-[var(--cat-ux)] opacity-80 pl-6 md:pl-12 lg:pl-24">
            04 / Showcase
          </p>
          
          <div className="flex w-full flex-col pl-6 md:pl-12 lg:pl-24 overflow-hidden">
            <h2 className="flex flex-col text-[18vw] sm:text-[16vw] md:text-[14vw] font-light leading-[0.8] tracking-tighter select-none">
              <span 
                className="text-[var(--text)] mix-blend-plus-lighter"
                style={{ textShadow: "0 0 80px rgba(255,255,255,0.1)" }}
              >
                Shipped
              </span>
              <span 
                className="text-transparent ml-[8vw] md:ml-[12vw] mix-blend-plus-lighter"
                style={{ WebkitTextStroke: "1px var(--text-dim)" }}
              >
                Interfaces
              </span>
            </h2>
          </div>
        </div>
      </div>

      <div className="space-y-20 md:space-y-28">
        {featuredShowcase.map((item, idx) => {
          const accentColor = getAccentColor(item.category);

          return (
            <div
              key={item.id}
              className={`group relative grid gap-10 items-center lg:grid-cols-[1.1fr_0.9fr] lg:gap-16`}
            >
              {/* Visual Viewport */}
              <div className={`relative ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                 <StaticSnapshot 
                    desktop={item.desktopImage}
                    mobile={item.mobileImage}
                    secondaryMobile={item.secondaryMobileImage}
                    layout={item.layout}
                    theme={theme}
                 />
              </div>

              {/* Feature Content */}
              <div className={`flex flex-col justify-center gap-8 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="space-y-6">
                  <h3 className="text-4xl font-light tracking-tighter text-[var(--text)] sm:text-5xl md:text-6xl lg:text-7xl">
                    {item.title}
                  </h3>
                  <p className="text-xl font-light leading-tight text-[var(--text-muted)] max-w-xl">
                    {item.description}
                  </p>
                </div>

                <ShowcaseFeatures 
                  points={item.features} 
                  className="max-w-md"
                  accentColor={accentColor}
                />

                <div className="pt-4">
                  <button 
                    onClick={() => {
                      const parent = projects.find(p => p.title === item.parentProjectTitle);
                      if (parent) onProjectSelect(parent);
                    }}
                    className="group relative inline-flex items-center gap-3 text-sm font-medium text-[var(--text)] overflow-hidden"
                  >
                    <span className="relative z-10">View case study</span>
                    <ArrowUpRight size={20} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    <div 
                      className="absolute bottom-0 left-0 h-[1px] w-0 transition-all duration-300 group-hover:w-full" 
                      style={{ background: accentColor }}
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
