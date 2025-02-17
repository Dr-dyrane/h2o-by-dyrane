"use client"

import { Github, Linkedin, Mail, Twitter } from "lucide-react"
import { motion } from "framer-motion"

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/yourusername",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com/in/yourusername",
  },
  {
    name: "Twitter",
    icon: Twitter,
    url: "https://twitter.com/yourusername",
  },
  {
    name: "Email",
    icon: Mail,
    url: "mailto:your@email.com",
  },
]

export function SocialSidebar() {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-4 top-1/2 z-50 -translate-y-1/2 flex flex-col gap-4 border p-4 rounded-full border-black/5 hover:border-black/50 bg-white/50"
    >
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-black/5 transition-all hover:bg-black hover:text-white"
        >
          <link.icon className="h-5 w-5" />
          <span className="absolute left-12 hidden rounded-md bg-black px-2 py-1 text-sm text-white group-hover:block">
            {link.name}
          </span>
        </a>
      ))}
    </motion.div>
  )
}

