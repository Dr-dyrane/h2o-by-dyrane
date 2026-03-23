"use client"

import * as React from "react"
import { ArrowUpRight, Equal, Github, Linkedin, Moon, Sun, X } from "@/components/icons/lucide"
import { useTheme } from "@/components/ThemeProvider"

const navItems = [
  { name: "Case Studies", href: "#featured-work" },
  { name: "Services", href: "#services" },
  { name: "Shipping", href: "#engineering-dna" },
]

/**
 * Hydration-safe theme icon that avoids mismatches between server and client render.
 */
const ThemeGlyph = ({ theme }: { theme: "light" | "dark" }) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <span className="block h-[15px] w-[15px]" />
  }

  return theme === "dark" ? <Sun size={15} /> : <Moon size={15} />
}

const utilityButtonClass =
  "flex h-10 w-10 items-center justify-center squircle-icon glass-regular-thin text-[var(--text-dim)] transition-colors duration-200 hover:text-[var(--text)]"

/**
 * Primary site navigation with theme controls, social links, and mobile sheet.
 */
export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { theme, toggleTheme } = useTheme()

  React.useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  React.useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  return (
    <nav className="fixed inset-x-0 top-0 z-[60]">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="safe-top px-4 md:px-8 relative z-20">
        <div className="mx-auto flex h-14  items-center justify-between gap-3 squircle-nav glass-regular px-4 shadow-[0_16px_48px_rgba(0,0,0,0.08)] md:h-16 md:px-6">
        <a href="#" className="min-w-0 text-[18px] font-medium tracking-tighter text-[var(--text)]">
          Dyrane
        </a>

        {/* <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="px-3 py-2 squircle-chip text-[13px] font-medium text-[var(--text-dim)] transition-colors duration-200 hover:text-[var(--text)]"
            >
              {item.name}
            </a>
          ))}
        </div> */}

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href="https://linkedin.com/in/dyrane"
            target="_blank"
            rel="noopener noreferrer"
            className={utilityButtonClass}
            aria-label="LinkedIn"
          >
            <Linkedin size={15} />
          </a>
          <a
            href="https://github.com/Dr-dyrane"
            target="_blank"
            rel="noopener noreferrer"
            className={utilityButtonClass}
            aria-label="GitHub"
          >
            <Github size={15} />
          </a>
          <button onClick={toggleTheme} className={utilityButtonClass} aria-label="Toggle theme">
            <ThemeGlyph theme={theme} />
          </button>
          <a
            href="mailto:hello@dyrane.tech?subject=Project%20Inquiry"
            className="inline-flex items-center gap-2 px-5 py-2.5 squircle-pill bg-[var(--cta-bg)] text-sm font-medium text-[var(--cta-text)] transition-colors duration-200 hover:bg-[var(--cta-hover)]"
          >
            Start a Project
            <ArrowUpRight size={16} />
          </a>
        </div>

        <button
          onClick={() => setIsOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center squircle-icon glass-regular-thin text-[var(--text-dim)] transition-colors duration-200 hover:text-[var(--text)] lg:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-nav-sheet"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={20} /> : <Equal size={20} />}
        </button>
        </div>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-10 lg:hidden" aria-hidden="true">
          <button
            className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu overlay"
          />
          <div
            id="mobile-nav-sheet"
            className="absolute inset-x-0 bottom-0 top-0 flex flex-col safe-top safe-x safe-bottom"
          >
            <div className="mt-16 flex-1 overflow-hidden squircle-panel glass-regular shadow-[0_28px_80px_rgba(0,0,0,0.18)]">
              <div className="flex h-full flex-col px-4 pb-4 pt-4">
                <div className="mb-4 space-y-1">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-4 py-4 squircle-chip text-base font-medium text-[var(--text)] transition-colors duration-200 active:bg-white/5"
                    >
                      <span>{item.name}</span>
                      <ArrowUpRight size={16} className="text-[var(--text-ghost)]" />
                    </a>
                  ))}
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex items-center gap-2">
                    <a
                      href="https://linkedin.com/in/dyrane"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={utilityButtonClass}
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={15} />
                    </a>
                    <a
                      href="https://github.com/Dr-dyrane"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={utilityButtonClass}
                      aria-label="GitHub"
                    >
                      <Github size={15} />
                    </a>
                    <button onClick={toggleTheme} className={utilityButtonClass} aria-label="Toggle theme">
                      <ThemeGlyph theme={theme} />
                    </button>
                  </div>

                  <a
                    href="mailto:hello@dyrane.tech?subject=Project%20Inquiry"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex w-full items-center justify-center gap-2 px-5 py-4 squircle-pill bg-[var(--cta-bg)] text-sm font-semibold text-[var(--cta-text)] transition-colors duration-200 hover:bg-[var(--cta-hover)]"
                  >
                    Start a Project
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
