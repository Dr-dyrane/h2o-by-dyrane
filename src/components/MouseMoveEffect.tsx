"use client";
import { useEffect, useRef } from "react";
import { useUI } from "@/context/UIContext";

/**
 * MouseMoveEffect — Radial gradient that follows the cursor.
 *
 * Performance: reads mouse pos from UIProvider via a RAF loop and writes
 * directly to the DOM element's style — ZERO React re-renders on mouse move.
 */
export default function MouseMoveEffect() {
    const { prefersReducedMotion, isLowPower, getMousePos } = useUI();
    const divRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        // Skip on low-power or reduced motion
        if (prefersReducedMotion || isLowPower) return;

        const el = divRef.current;
        if (!el) return;

        const tick = () => {
            const { x, y } = getMousePos();
            el.style.background = `radial-gradient(600px at ${x}px ${y}px, rgba(29, 78, 216, 0.12), transparent 80%)`;
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [prefersReducedMotion, isLowPower, getMousePos]);

    if (prefersReducedMotion || isLowPower) return null;

    return (
        <div
            ref={divRef}
            className="pointer-events-none fixed inset-0 z-30 will-gpu"
            aria-hidden="true"
        />
    );
}
