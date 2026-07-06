import { useState } from "react";

/**
 * Low-friction contact affordance, borrowed from AU Mosaic's WhatsAppFloat:
 * a calm, thumb-reachable floating capsule that opens a prefilled chat.
 *
 * TODO(Dyrane): set WHATSAPP_NUMBER to your number in international format
 * (digits only, no "+" or spaces) — e.g. "2348012345678". The button stays
 * hidden until a number is set, so it never renders a broken link.
 */
// Country code assumed +234 (Nigeria) from context; change if you're elsewhere.
const WHATSAPP_NUMBER = "2349517284218";
const PREFILL = "Hi Dyrane, I have a project I'd like to talk through.";

export const WhatsAppFloat = () => {
  const [hovered, setHovered] = useState(false);

  if (!WHATSAPP_NUMBER) {
    return null;
  }

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILL)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-cta="whatsapp-float"
      aria-label="Start a project on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_40px_rgba(0,0,0,0.32)] transition-transform duration-300 hover:scale-105 active:scale-95"
    >
      <span
        className={`pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-[var(--nav-surface)] px-4 py-2 text-sm text-[var(--text)] shadow-lg backdrop-blur-xl transition-all duration-300 md:inline-flex ${
          hovered ? "translate-x-0 opacity-100" : "translate-x-1 opacity-0"
        }`}
      >
        Start a project
      </span>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5v-.5c0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3Z" />
      </svg>
    </a>
  );
};

export default WhatsAppFloat;
