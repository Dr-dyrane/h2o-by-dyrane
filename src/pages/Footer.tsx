"use client";

import {
  ArrowUpRight,
  Github,
  Mail,
  MessageCircle,
} from "@/components/icons/lucide";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  { name: "GitHub", icon: Github, url: "https://github.com/Dr-dyrane" },
  { name: "X", icon: XIcon, url: "https://x.com/dr_dyrane" },
  { name: "WhatsApp", icon: MessageCircle, url: "https://wa.me/19517284218" },
  { name: "Email", icon: Mail, url: "mailto:hello@dyrane.tech" },
];

const Footer = () => {
  return (
    <footer className="relative z-10">
      <div className="mx-auto max-w-7xl px-4 py-20 text-center md:px-6 md:py-24">
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 squircle-pill surface-chip text-[11px] font-mono uppercase tracking-[0.15em] text-[var(--cat-ux)]">
          <div className="h-1.5 w-1.5 squircle-pill bg-[var(--cat-ux)]" />
          Available for Projects
        </div>

        <h2 className="mb-4 text-4xl font-light tracking-tighter text-[var(--text)] md:text-6xl">
          Bring the next version of your{" "}
          <span className="text-[var(--text-dim)]">product to life.</span>
        </h2>
        <p className="mx-auto mb-10 max-w-lg font-light leading-relaxed text-[var(--text-muted)]">
          From AI workflows to premium websites and operational platforms, I
          help teams ship products that feel clear, fast, and credible.
        </p>

        <a
          href="https://wa.me/19517284218?text=Hi%20Dr.%20Dyrane,%20I'm%20interested%20in%20working%20with%20you!"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 squircle-pill bg-[var(--cta-bg)] font-medium text-[var(--cta-text)] transition-colors duration-200 hover:bg-[var(--cta-hover)]"
        >
          Start a Project Conversation <ArrowUpRight size={18} />
        </a>
      </div>

      <div className="surface-panel">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 md:flex-row md:px-6">
          <p className="text-[13px] font-mono text-[var(--text-muted)]">
            (c) {new Date().getFullYear()} Alexander Dyrane.{" "}
            <span className="text-[var(--cat-ux)]">Built with product discipline.</span>
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center squircle-icon surface-chip text-[var(--text-dim)] transition-colors duration-200 hover:text-[var(--text)]"
                aria-label={link.name}
              >
                <link.icon className="h-[15px] w-[15px]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
