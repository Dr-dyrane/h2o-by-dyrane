import React from "react";
import { projects, Project } from "@/data/projects";
import { ShowcaseFeatures } from "@/components/ShowcaseFeatures";
import { ArrowUpRight } from "@/components/icons/lucide";
import { useTheme } from "@/components/ThemeProvider";

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

  const ScreenFallback = () => (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]" />
  );

  const MacBookFrame = ({ src, alt, theme: frameTheme }: { src?: string | null; alt: string; theme: "light" | "dark" }) => {
    const isDark = frameTheme === "dark";
    // In dark mode, we use a Silver/Light-Gray frame for visibility (Canon Rule 21: Depth over Color)
    // In light mode, we use a Space Gray/Dark frame for contrast.
    const frameBg = isDark ? "bg-[#d1d5db]" : "bg-[#0c0c0c]";
    const lipBg = isDark ? "bg-[#e5e7eb]" : "bg-[#1a1a1a]";
    const strokeColor = isDark ? "ring-black/10" : "ring-white/10";

    return (
      <div className="relative group/mac w-full mx-auto max-w-[900px]">
        {/* MacBook Body / Screen */}
        <div className={`relative aspect-[16/10] overflow-hidden rounded-t-[1.4rem] ${frameBg} shadow-2xl ring-1 ${strokeColor}`}>
          {src ? (
            <img 
              src={src} 
              alt={alt} 
              className="block w-full h-full object-cover transition-transform duration-700 group-hover/mac:scale-[1.03]"
              suppressHydrationWarning
            />
          ) : (
            <ScreenFallback />
          )}
          {/* Glass Sheen */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-40" />
          {/* Camera Notch Area */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 ${isDark ? 'bg-[#c1c5cb]' : 'bg-[#0c0c0c]'} rounded-b-lg flex items-center justify-center gap-1.5 opacity-80`}>
            <div className="w-1 h-1 rounded-full bg-blue-400/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
          </div>
        </div>
        {/* MacBook Bottom Lip */}
        <div className={`relative h-4 w-full rounded-b-xl ${lipBg} shadow-lg ring-1 ${isDark ? 'ring-black/5' : 'ring-white/5'}`}>
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 ${isDark ? 'bg-black/10' : 'bg-white/10'} rounded-full`} />
        </div>
      </div>
    );
  };

  const IPhoneFrame = ({ src, alt, theme: frameTheme, className = "" }: { src?: string | null; alt: string; theme: "light" | "dark"; className?: string }) => {
    const isDark = frameTheme === "dark";
    // Silver/White Titanium for dark mode, Space Black for light mode
    const frameBg = isDark ? "bg-[#e5e7eb]" : "bg-[#0c0c0c]";
    const ringColor = isDark ? "ring-[#d1d5db]" : "ring-[#1a1a1a]";

    return (
      <div className={`relative group/phone mx-auto w-full max-w-[300px] ${className}`}>
        {/* Side Buttons (Subtle) */}
        <div className={`absolute -left-[2px] top-24 w-[2px] h-10 ${isDark ? 'bg-black/10' : 'bg-white/10'} rounded-l-md`} />
        <div className={`absolute -left-[2px] top-40 w-[2px] h-10 ${isDark ? 'bg-black/10' : 'bg-white/10'} rounded-l-md`} />
        <div className={`absolute -right-[2px] top-32 w-[2px] h-14 ${isDark ? 'bg-black/10' : 'bg-white/10'} rounded-r-md`} />

        {/* Main Chassis */}
        <div className={`relative aspect-[9/19.5] overflow-hidden rounded-[2.8rem] ${frameBg} shadow-2xl ring-[6px] ${ringColor} ring-inset`}>
          {/* The Screen */}
          <div className="absolute inset-[2px] overflow-hidden rounded-[2.6rem]">
            {src ? (
              <img 
                src={src} 
                alt={alt} 
                className="block w-full h-full object-cover transition-transform duration-700 group-hover/phone:scale-[1.05]"
                suppressHydrationWarning
              />
            ) : (
              <ScreenFallback />
            )}
            {/* Glass Sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-30" />
            {/* Dynamic Island */}
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 ${isDark ? 'bg-[#c1c5cb]' : 'bg-[#0c0c0c]'} rounded-full ring-1 ${isDark ? 'ring-black/5' : 'ring-white/5'} flex items-center justify-end px-3`}>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isDual) {
    return (
      <div className="grid grid-cols-2 gap-4 md:gap-8 items-end">
        <IPhoneFrame src={mImg} alt="Primary mobile interface" theme={resolvedTheme} />
        {secondaryMobile && <IPhoneFrame src={sImg} alt="Secondary mobile interface" theme={resolvedTheme} />}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Desktop (MacBook context) */}
      {dImg && (
        <div className="hidden md:block">
          <MacBookFrame src={dImg} alt="Desktop dashboard" theme={resolvedTheme} />
        </div>
      )}
      {!dImg && hasDesktop && (
        <div className="hidden md:block">
          <MacBookFrame alt="Desktop dashboard" theme={resolvedTheme} />
        </div>
      )}
      
      {/* Mobile (iPhone context) */}
      <div className={hasDesktop ? 'md:hidden' : ''}>
        <IPhoneFrame src={mImg} alt="Mobile interface" theme={resolvedTheme} />
      </div>
    </div>
  );
};

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

  const getAccentColor = (cat: string) => {
    if (cat === "Logistics Engine") return "var(--cat-logistics)";
    if (cat === "Intelligence Bridge") return "var(--cat-intelligence)";
    return "var(--cat-ux)";
  };

  if (featuredShowcase.length === 0) return null;

  return (
    <section id="showcase" className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24 lg:py-28">
      <div className="mb-14 flex flex-col gap-4 md:mb-16">
        <div className="max-w-3xl space-y-4">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-[var(--cat-ux)] opacity-80">
            Selected Interfaces
          </p>
          <h2 className="text-5xl font-light tracking-tight text-[var(--text)] md:text-6xl lg:text-7xl">
            A closer look at shipped interfaces.
          </h2>
          <p className="max-w-2xl text-base font-light leading-relaxed text-[var(--text-muted)] md:text-lg">
            Screens from the products behind the case studies.
          </p>
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
                  <h3 className="text-4xl font-light tracking-tight text-[var(--text)] md:text-5xl">
                    {item.title}
                  </h3>
                  <p className="text-xl font-light leading-relaxed text-[var(--text-muted)] max-w-xl">
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
