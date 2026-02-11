"use client";

import { Github, Twitter, Mail, MessageCircle, ArrowUpRight } from "lucide-react";

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
];

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/5">
      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-widest mb-8">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Available for Projects
        </div>

        <h2 className="text-4xl md:text-5xl font-light text-white tracking-tighter mb-4">
          Let's Build{" "}
          <span className="text-white/30">Something Intelligent.</span>
        </h2>
        <p className="text-white/50 max-w-lg mx-auto mb-10 leading-relaxed">
          Whether it's a new product, a systems overhaul, or a conversation
          about possibilities — I'm one message away.
        </p>

        <a
          href="https://wa.me/19517284218?text=Hi%20Dr.%20Dyrane,%20I'm%20interested%20in%20working%20with%20you!"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
        >
          Start a Conversation <ArrowUpRight size={18} />
        </a>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/30 text-sm">
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
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all duration-300"
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
