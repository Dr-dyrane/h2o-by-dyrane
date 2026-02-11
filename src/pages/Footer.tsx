"use client";

import { Github, Mail, MessageCircle, ArrowUpRight } from "lucide-react";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/Dr-dyrane",
  },
  {
    name: "X",
    icon: XIcon,
    url: "https://x.com/dr_dyrane",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    url: "https://wa.me/19517284218",
  },
  {
    name: "Email",
    icon: Mail,
    url: "mailto:hello@dyrane.tech",
  },
];

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-[var(--border-subtle)]">
      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-8">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Available for Projects
        </div>

        <h2 className="text-4xl md:text-5xl font-light text-[var(--text)] tracking-tighter mb-4">
          Let's Build{" "}
          <span className="text-[var(--text-ghost)]">Something Intelligent.</span>
        </h2>
        <p className="text-[var(--text-muted)] max-w-lg mx-auto mb-10 leading-relaxed">
          Whether it's a new product, a systems overhaul, or a conversation
          about possibilities — I'm one message away.
        </p>

        <a
          href="https://wa.me/19517284218?text=Hi%20Dr.%20Dyrane,%20I'm%20interested%20in%20working%20with%20you!"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--cta-bg)] text-[var(--cta-text)] font-medium rounded-full hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_var(--glow-color)]"
        >
          Start a Conversation <ArrowUpRight size={18} />
        </a>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--border-subtle)] bg-[var(--surface-card)]">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[var(--text-ghost)] text-sm">
            &copy; {new Date().getFullYear()} Dyrane Intelligence Collective. All Systems Nominal.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--surface-card)] text-[var(--text-dim)] hover:bg-[var(--surface-card-hover)] hover:text-[var(--text)] transition-all duration-300"
                aria-label={link.name}
              >
                <link.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
