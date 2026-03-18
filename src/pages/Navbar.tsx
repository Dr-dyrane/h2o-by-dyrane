"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"

const navItems = [
  { name: "Work",          href: "#logistics-engine" },
  { name: "Architecture",  href: "#intelligence-bridge" },
  { name: "Interface",     href: "#modernized-ux" },
  { name: "Pulse",         href: "#engineering-dna" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full top-0 left-0 z-50 glass-regular"
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

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(v => !v)}
          className="md:hidden p-2.5 squircle-icon glass-ultra-thin text-[var(--text-dim)]"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="md:hidden glass-thick mx-4 mb-4 squircle-panel overflow-hidden"
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
              className="mt-2 px-5 py-3 squircle-pill bg-[var(--cta-bg)] text-[var(--cta-text)] text-sm font-medium text-center"
            >
              Hire Me
            </a>
          </nav>
        </motion.div>
      )}
    </motion.nav>
  )
}
