import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import type { LottieRefCurrentProps } from "lottie-react";

interface LottieThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
  isHovered: boolean;
  isActive: boolean;
}

const LazyLottie = lazy(() =>
  import("lottie-react").then((module) => ({
    default: module.default,
  }))
);

// Create animation data dynamically based on theme
const createLampAnimation = (theme: "light" | "dark") => ({
  "v": "5.5.7",
  "fr": 60,
  "ip": 0,
  "op": 120,
  "w": 120,
  "h": 120,
  "nm": "Lamp Theme Toggle",
  "ddd": 0,
  "assets": [],
  "layers": [
    {
      "ddd": 0,
      "ind": 1,
      "ty": 4,
      "nm": "Lamp Base",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100 },
        "r": { "a": 0, "k": 0 },
        "p": { "a": 0, "k": [60, 60] },
        "s": { "a": 0, "k": [100, 100] }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ty": "sh",
              "d": 1,
              "ks": {
                "a": 0,
                "k": {
                  "i": [[0, 0], [0, 0]],
                  "o": [[0, 0], [0, 0]],
                  "v": [[0, 0], [0, 0]],
                  "c": true
                }
              },
              "fill": {
                "c": [
                  theme === 'dark' ? [0.95, 0.95, 0.95, 1] : [0.1, 0.1, 0.1, 1]
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "ddd": 0,
      "ind": 2,
      "ty": 4,
      "nm": "Lamp Head",
      "sr": 1,
      "ks": {
        "o": { "a": 0, "k": 100 },
        "r": {
          "a": 1,
          "k": [
            { "t": 0, "s": [0] },
            { "t": 30, "s": [15] },
            { "t": 60, "s": [0] },
            { "t": 90, "s": [-15] },
            { "t": 120, "s": [0] }
          ]
        },
        "p": { "a": 0, "k": [60, 40] },
        "s": { "a": 0, "k": [100, 100] }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ty": "sh",
              "d": 1,
              "ks": {
                "a": 0,
                "k": {
                  "i": [[0, 0], [0, 0]],
                  "o": [[0, 0], [0, 0]],
                  "v": [[0, 0], [0, 0]],
                  "c": true
                }
              },
              "fill": {
                "c": [
                  theme === 'dark' ? [1, 1, 1, 1] : [0.2, 0.2, 0.2, 1]
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "ddd": 0,
      "ind": 3,
      "ty": 4,
      "nm": "Light Beam",
      "sr": 1,
      "ks": {
        "o": {
          "a": 1,
          "k": [
            { "t": 0, "s": [0] },
            { "t": 20, "s": [60] },
            { "t": 40, "s": [80] },
            { "t": 60, "s": [60] },
            { "t": 80, "s": [80] },
            { "t": 100, "s": [60] },
            { "t": 120, "s": [0] }
          ]
        },
        "r": { "a": 0, "k": 0 },
        "p": { "a": 0, "k": [60, 60] },
        "s": { "a": 0, "k": [200, 200] }
      },
      "ao": 0,
      "shapes": [
        {
          "ty": "gr",
          "it": [
            {
              "ty": "sh",
              "d": 1,
              "ks": {
                "a": 0,
                "k": {
                  "i": [[0, 0], [0, 0]],
                  "o": [[0, 0], [0, 0]],
                  "v": [[0, 0], [0, 0]],
                  "c": true
                }
              },
              "fill": {
                "c": [
                  theme === 'dark' ? [1, 1, 1, 0.3] : [0, 0, 0, 0.1]
                ]
              }
            }
          ]
        }
      ]
    }
  ]
});

export const LottieThemeToggle = ({ theme, onToggle, isHovered, isActive }: LottieThemeToggleProps) => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [shouldLoadPlayer, setShouldLoadPlayer] = useState(false);
  const animationData = useMemo(() => createLampAnimation(theme), [theme]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const preloadTimerId = window.setTimeout(() => {
      setShouldLoadPlayer(true);
    }, 350);

    return () => {
      window.clearTimeout(preloadTimerId);
    };
  }, [isMounted]);

  useEffect(() => {
    if (shouldLoadPlayer && lottieRef.current) {
      if (isHovered) {
        lottieRef.current.play();
      } else {
        lottieRef.current.stop();
      }
    }
  }, [isHovered, shouldLoadPlayer]);

  useEffect(() => {
    if (shouldLoadPlayer && lottieRef.current) {
      if (isActive) {
        lottieRef.current.goToAndPlay(60, true); // Jump to "light up" frame
      } else {
        lottieRef.current.goToAndStop(0, true); // Return to start
      }
    }
  }, [theme, isActive, shouldLoadPlayer]);

  if (!isMounted) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle theme"
        className="relative group perspective-1000"
      >
        <span className="relative block h-14 w-14 rounded-2xl bg-[var(--surface-elevated)] ring-1 ring-[var(--surface-stroke)]" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="relative group border-0 bg-transparent p-0 perspective-1000"
    >
      {/* Lottie Animation Container */}
      <div 
        className="relative w-14 h-14 cursor-pointer"
        onMouseEnter={() => lottieRef.current?.play()}
        onMouseLeave={() => lottieRef.current?.stop()}
      >
        {shouldLoadPlayer ? (
          <Suspense
            fallback={<span className="relative block h-14 w-14 rounded-2xl bg-[var(--surface-elevated)] ring-1 ring-[var(--surface-stroke)]" />}
          >
            <LazyLottie
              lottieRef={lottieRef}
              animationData={animationData}
              loop={false}
              autoplay={false}
              style={{
                width: "100%",
                height: "100%",
                filter:
                  theme === "dark"
                    ? "drop-shadow(0 0 20px rgba(255,255,255,0.3))"
                    : "drop-shadow(0 0 10px rgba(0,0,0,0.2))",
              }}
            />
          </Suspense>
        ) : (
          <span className="relative block h-14 w-14 rounded-2xl bg-[var(--surface-elevated)] ring-1 ring-[var(--surface-stroke)]" />
        )}
      </div>

      {/* Glow effect that responds to theme */}
      <div 
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-700"
        style={{
          boxShadow: `
            0 0 60px 30px ${theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'},
            0 0 100px 60px ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'},
            inset 0 0 30px ${theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}
          `,
          opacity: isHovered ? 1 : 0.7
        }}
      />

      {/* Floating label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-black/20 blur-sm" />
          <div className="relative px-3 py-1 rounded-full bg-[var(--surface-elevated)] border border-white/10">
            <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-[var(--text-ghost)] whitespace-nowrap">
              {theme === "dark" ? "Light Up" : "Dark Mode"}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};
