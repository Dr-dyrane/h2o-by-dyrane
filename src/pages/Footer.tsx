"use client";

import { Github, Twitter, Mail, MessageCircle } from "lucide-react";

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
    url: "https://wa.me/2348159502463",
  },
  {
    name: "Email",
    icon: Mail,
    url: "mailto:drdyrane@gmail.com",
  },
];

const Footer = () => {
  return (
    <footer className="relative flex flex-col items-center justify-center bg-black text-white py-12 px-6 rounded-t-3xl shadow-lg">
      {/* Floating CTA Section */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-6 py-3 rounded-full shadow-md flex items-center gap-2">
        <span className="text-sm font-semibold">Let’s Work Together</span>
      </div>

      <h2 className="text-3xl font-bold mb-4 text-center">
        Have an idea? <br /> Let's create something amazing!
      </h2>
      <p className="text-sm text-gray-400 max-w-md text-center mb-6">
        Whether it's a new project, collaboration, or just a chat about
        possibilities, I’m just a message away.
      </p>

      {/* Social Links */}
      <div className="flex gap-6 mb-8">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full hover:bg-white hover:text-black transition duration-300"
          >
            <link.icon className="w-6 h-6" />
          </a>
        ))}
      </div>

      {/* Copyright */}
      <p className="text-xs text-gray-500">
        &copy; {new Date().getFullYear()} H₂O by Dyrane. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
