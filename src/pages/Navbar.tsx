"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Equal, X } from "lucide-react"

const navItems = [
  { name: "Work", href: "#logistics-engine" },
  { name: "Architecture", href: "#intelligence-bridge" },
  { name: "Interface", href: "#modernized-ux" },
  { name: "Pulse", href: "#engineering-dna" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  // mounted flag ensures the animation only fires on the client, never during SSR
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    // Plain <nav> at root — framer-motion root elements differ between SSR and client
    <nav className="fixed w-full top-0 left-0 z-50 glass-ultra">
      <motion.div
        initial={mounted ? { opacity: 0, y: -20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Wordmark */}
          <a href="#" className="text-[var(--text)] font-semibold tracking-tight text-base">
            Dr. Dyrane
            <span className="text-[var(--text-ghost)] font-light ml-1.5">Intelligence Collective</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <a
                key={item.name}
                href={item.href}
                className="px-4 py-2 squircle-chip text-[var(--text-dim)] hover:text-[var(--text)] text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <a
            href="mailto:hello@dyrane.tech?subject=Project%20Inquiry"
            className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 squircle-pill bg-[var(--cta-bg)] text-[var(--cta-text)] text-sm font-medium hover:scale-105 hover:opacity-90 transition-all duration-300"
          >
            Hire Me
          </a>

          <button
            onClick={() => setIsOpen(v => !v)}
            className="md:hidden p-2.5 squircle-icon glass-ultra-thin text-[var(--text-dim)] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Equal size={20} />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.32, 0, 0.67, 0] }}
              className="md:hidden glass-ultra glass-tight mx-4 mb-4 squircle-panel overflow-hidden shadow-2xl"
            >
              <nav className="flex flex-col p-4 gap-1">
                {navItems.map(item => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 squircle-chip text-[var(--text-muted)] hover:text-[var(--text)] text-base font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </a>
                ))}
                <a
                  href="mailto:hello@dyrane.tech?subject=Project%20Inquiry"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 px-5 py-4 squircle-pill bg-[var(--cta-bg)] text-[var(--cta-text)] text-sm font-semibold text-center hover:opacity-90 active:scale-95 transition-all"
                >
                  Hire Me
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </nav>
  )
}
