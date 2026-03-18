"use client";

import { Github, Mail, MessageCircle, ArrowUpRight } from "lucide-react";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  { name: "GitHub",   icon: Github,        url: "https://github.com/Dr-dyrane" },
  { name: "X",         icon: XIcon,         url: "https://x.com/dr_dyrane" },
  { name: "WhatsApp",  icon: MessageCircle, url: "https://wa.me/19517284218" },
  { name: "Email",     icon: Mail,          url: "mailto:hello@dyrane.tech" },
];

const Footer = () => {
  return (
    <footer className="relative z-10">
      {/* Depth separator — ambient glow line, not a border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--text-ghost)]/20 to-transparent" />

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">

        {/* Available badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 squircle-pill glass-ultra-thin text-emerald-400 text-[11px] font-mono uppercase tracking-[0.15em] mb-8">
          <div className="h-1.5 w-1.5 squircle-pill bg-emerald-500 animate-pulse" />
          Available for Projects
        </div>

        <h2 className="text-4xl md:text-6xl font-light text-[var(--text)] tracking-tighter mb-4">
          Let's Build{" "}
          <span className="text-[var(--text-ghost)]">Something Intelligent.</span>
        </h2>
        <p className="text-[var(--text-muted)] max-w-lg mx-auto mb-10 leading-relaxed font-light">
          Whether it's a new product, a systems overhaul, or a conversation
          about possibilities — I'm one message away.
        </p>

        <a
          href="https://wa.me/19517284218?text=Hi%20Dr.%20Dyrane,%20I'm%20interested%20in%20working%20with%20you!"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 squircle-pill bg-[var(--cta-bg)] text-[var(--cta-text)] font-medium hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_var(--glow-color)]"
        >
          Start a Conversation <ArrowUpRight size={18} />
        </a>
      </div>

      {/* Bottom bar — depth separated, no border */}
      <div className="glass-ultra-thin">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[var(--text-ghost)] text-[13px] font-mono">
            © {new Date().getFullYear()} Dyrane Intelligence Collective.{" "}
            <span className="text-emerald-500/60">All Systems Nominal.</span>
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 squircle-icon glass-ultra-thin text-[var(--text-dim)] hover:text-emerald-400 transition-all duration-200 hover:scale-110"
                aria-label={link.name}
              >
                <link.icon className="w-[15px] h-[15px]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
