"use client"

import { Github, Mail, Twitter, MessageCircle } from "lucide-react"

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/Dr-dyrane",
  },
  {
    name: "Twitter",
    icon: Twitter,
    url: "https://twitter.com/dr_dyrane",
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
  return (
    <>
      {/* Desktop: fixed sidebar */}
      <div
        className="hidden md:flex fixed left-4 top-1/3 z-50 flex-col gap-3 p-3 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md"
      >
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:bg-emerald-500/20 hover:text-emerald-400 text-white/40 hover:scale-110"
          >
            <link.icon className="h-4 w-4" />
            <span className="absolute left-14 hidden whitespace-nowrap rounded-lg bg-[#0D0D0D] border border-white/10 px-3 py-1.5 text-xs text-white/80 font-medium group-hover:block">
              {link.name}
            </span>
          </a>
        ))}
      </div>

      {/* Mobile: bottom bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-6 py-3 bg-[#0D0D0D]/90 backdrop-blur-md border-t border-white/5"
      >
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/40 transition-all duration-300 active:scale-95 hover:bg-emerald-500/20 hover:text-emerald-400"
            aria-label={link.name}
          >
            <link.icon className="h-4 w-4" />
          </a>
        ))}
      </div>
    </>
  )
}
