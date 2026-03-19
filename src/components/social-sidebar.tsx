"use client"

import { useState, useEffect } from "react"
import { Github, Mail, MessageCircle, Sun, Moon } from "lucide-react"
import { useTheme } from "./ThemeProvider"

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const socialLinks = [
  { name: "GitHub",    icon: Github,        url: "https://github.com/Dr-dyrane" },
  { name: "X",         icon: XIcon,         url: "https://x.com/dr_dyrane" },
  { name: "WhatsApp",  icon: MessageCircle, url: "https://wa.me/19517284218" },
  { name: "Email",     icon: Mail,          url: "mailto:hello@dyrane.tech" },
]

const IconButton = ({
  children,
  label,
  onClick,
  href,
}: {
  children: React.ReactNode
  label: string
  onClick?: () => void
  href?: string
}) => {
  const cls = `
    group relative flex h-9 w-9 items-center justify-center
    squircle-icon
    glass-ultra-thin
    text-[var(--text-dim)]
    transition-all duration-250
    hover:text-emerald-400
    hover:shadow-[0_0_16px_rgba(52,211,153,0.25)]
    hover:scale-110
    active:scale-95
  `
  const tooltip = (
    <span className="
      absolute left-12 hidden whitespace-nowrap
      squircle-chip px-3 py-1.5
      glass-regular shadow-lg
      text-[11px] text-[var(--text-muted)] font-medium
      group-hover:block
    ">
      {label}
    </span>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={label}>
        {children}
        {tooltip}
      </a>
    )
  }
  return (
    <button onClick={onClick} className={cls} aria-label={label}>
      {children}
      {tooltip}
    </button>
  )
}

// Separate icon component that only renders after mount to avoid SSR theme mismatch
const ThemeIcon = ({ theme, size = "h-[15px] w-[15px]" }: { theme: string; size?: string }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <span className={size} />  // same dimensions, no icon yet
  return theme === "dark"
    ? <Sun className={size} />
    : <Moon className={size} />
}

export function SocialSidebar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      {/* Desktop: fixed left sidebar */}
      <div className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-50 flex-col gap-2 p-2.5 squircle-nav glass-ultra shadow-[0_8px_48px_rgba(0,0,0,0.15)]">
        {socialLinks.map((link) => (
          <IconButton key={link.name} label={link.name} href={link.url}>
            <link.icon className="h-[15px] w-[15px]" />
          </IconButton>
        ))}

        {/* Separator */}
        <div className="h-px w-5 mx-auto bg-[var(--text-ghost)]/30 my-1" />

        {/* Theme Toggle */}
        <IconButton label={theme === "dark" ? "Light Mode" : "Dark Mode"} onClick={toggleTheme}>
          <ThemeIcon theme={theme} />
        </IconButton>
      </div>

      {/* Mobile: bottom dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-3 py-3 px-6 glass-ultra glass-tight shadow-[0_-8px_32px_rgba(0,0,0,0.10)]">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center squircle-icon glass-ultra-thin text-[var(--text-dim)] transition-all duration-200 active:scale-95 hover:text-emerald-400"
            aria-label={link.name}
          >
            <link.icon className="h-4 w-4" />
          </a>
        ))}

        <div className="w-px h-6 bg-[var(--text-ghost)]/30 mx-1" />

        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center squircle-icon glass-ultra-thin text-[var(--text-dim)] transition-all duration-200 active:scale-95 hover:text-emerald-400"
          aria-label="Toggle theme"
        >
          <ThemeIcon theme={theme} size="h-4 w-4" />
        </button>
      </div>
    </>
  )
}
