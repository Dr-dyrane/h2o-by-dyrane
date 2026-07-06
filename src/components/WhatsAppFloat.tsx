import { useState } from "react";

/**
 * Low-friction contact affordance, borrowed from AU Mosaic's WhatsAppFloat:
 * a calm, thumb-reachable floating capsule that opens a prefilled chat.
 *
 * TODO(Dyrane): set WHATSAPP_NUMBER to your number in international format
 * (digits only, no "+" or spaces) — e.g. "2348012345678". The button stays
 * hidden until a number is set, so it never renders a broken link.
 */
// +1 (USA), Hemet CA. wa.me needs the full international number, digits only.
const WHATSAPP_NUMBER = "19517284218";
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
      className="group fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-glass)] text-[var(--text)] backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition-all duration-300 hover:scale-105 hover:bg-[var(--surface-elevated-strong)] active:scale-95"
    >
      <span
        className={`pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-[var(--nav-surface)] px-4 py-2 text-sm text-[var(--text)] shadow-lg backdrop-blur-xl transition-all duration-300 md:inline-flex ${
          hovered ? "translate-x-0 opacity-100" : "translate-x-1 opacity-0"
        }`}
      >
        Start a project
      </span>
      {/* Tabler Icons brand-whatsapp (line), MIT licensed, inlined to match the house's stroked marks */}
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
        <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
      </svg>
    </a>
  );
};

export default WhatsAppFloat;
