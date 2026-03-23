"use client";

import {
  Github,
  Linkedin,
  Mail,
  MessageCircle,
} from "@/components/icons/lucide";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/in/dyrane" },
  { name: "GitHub", icon: Github, url: "https://github.com/Dr-dyrane" },
  { name: "X", icon: XIcon, url: "https://x.com/dr_dyrane" },
  { name: "WhatsApp", icon: MessageCircle, url: "https://wa.me/19517284218" },
  { name: "Email", icon: Mail, url: "mailto:hello@dyrane.tech" },
];

/**
 * Cinematic Parallax Footer (End Credits)
 */
const Footer = () => {
  return (
    <footer
      className="relative z-0 w-full h-[100vh] overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div 
        className="fixed bottom-0 left-0 w-full h-[100vh] flex flex-col justify-end pb-12 px-6 md:px-12 lg:px-24"
      >
        <div className="relative w-full h-full flex flex-col justify-end">
          {/* Background accent orbs */}
          <div className="pointer-events-none absolute left-10 bottom-60 h-[500px] w-[500px] rounded-full bg-[var(--cat-intelligence-bg)] blur-[120px] mix-blend-overlay opacity-30" />
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 z-10">
            <div className="max-w-md">
              <p className="text-[11px] font-mono uppercase tracking-[0.4em] text-[var(--text-ghost)] mb-4">
                (c) {new Date().getFullYear()} Alexander Dyrane
              </p>
              <p className="text-sm font-light text-[var(--text-muted)] leading-relaxed">
                Refined with discipline. Liquid glass aesthetics and cinematic pacing applied to complex workflows.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-14 w-14 items-center justify-center squircle-icon surface-card text-[var(--text-dim)] transition-all duration-300 hover:scale-110 hover:text-[var(--text)] hover:shadow-2xl"
                  aria-label={link.name}
                >
                  <link.icon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          <h2 className="text-[18vw] leading-[0.75] font-light tracking-[-0.08em] text-[var(--text)] text-center w-full select-none mix-blend-plus-lighter">
            <span className="bg-gradient-to-b from-[var(--text)] to-[var(--text-muted)] bg-clip-text text-transparent">DYRANE</span>
          </h2>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
