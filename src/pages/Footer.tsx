"use client";

import {
  ArrowUpRight,
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
 * Footer with contact links and a short portfolio signature.
 */
const Footer = () => {
  return (
    <footer className="relative z-10">
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
