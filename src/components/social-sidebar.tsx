"use client"

import { Github, Mail, MessageCircle, Sun, Moon } from "lucide-react"

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
import { useTheme } from "./ThemeProvider"

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
]

export function SocialSidebar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      {/* Desktop: fixed sidebar */}
      <div
        className="hidden md:flex fixed left-4 top-1/3 z-50 flex-col gap-3 p-3 rounded-full bg-[var(--surface-card)]/50 md:bg-[var(--surface-card)] backdrop-blur-sm"
      >
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-card-hover)] transition-all duration-300 hover:bg-emerald-500/20 hover:text-emerald-400 text-[var(--text-dim)] hover:scale-110"
          >
            <link.icon className="h-4 w-4" />
            <span className="absolute left-14 hidden whitespace-nowrap rounded-lg bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--text-muted)] font-medium group-hover:block shadow-lg">
              {link.name}
            </span>
          </a>
        ))}

        {/* Separator */}
        <div className="h-px w-6 mx-auto bg-[var(--border-subtle)]" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-card-hover)] transition-all duration-300 hover:bg-emerald-500/20 hover:text-emerald-400 text-[var(--text-dim)] hover:scale-110"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="absolute left-14 hidden whitespace-nowrap rounded-lg bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--text-muted)] font-medium group-hover:block shadow-lg">
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </span>
        </button>
      </div>

      {/* Mobile: bottom bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-6 py-3 bg-[var(--surface)]/90 backdrop-blur-md"
      >
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-card)] text-[var(--text-dim)] transition-all duration-300 active:scale-95 hover:bg-emerald-500/20 hover:text-emerald-400"
            aria-label={link.name}
          >
            <link.icon className="h-4 w-4" />
          </a>
        ))}

        {/* Theme Toggle — Mobile */}
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-card)] text-[var(--text-dim)] transition-all duration-300 active:scale-95 hover:bg-emerald-500/20 hover:text-emerald-400"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </>
  )
}
