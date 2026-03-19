import { useEffect, useRef } from "react";
import { useUI } from "@/context/UIContext";

export const MatrixBackground = () => {
    const { isMobile, isLowPower, prefersReducedMotion, getMousePos } = useUI();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointsRef = useRef<{ x: number; y: number; baseAlpha: number; alpha: number }[]>([]);
    const animRef = useRef<number>(0);
    const resizeRef = useRef<number>(0);
    const lastFrameRef = useRef<number>(0);
    const themeRef = useRef<"dark" | "light">("dark");

    const shouldSkip = prefersReducedMotion || (isLowPower && isMobile);

    useEffect(() => {
        if (shouldSkip || typeof window === "undefined") return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const gap = isMobile ? 36 : 28;
        const dotSize = isMobile ? 1.2 : 1.5;
        const mouseRadius = isMobile ? 100 : 160;
        const fadeSpeed = 0.04;
        const targetInterval = isMobile ? 1000 / 24 : 1000 / 45;

        const syncTheme = () => {
            themeRef.current = document.documentElement.classList.contains("dark")
                ? "dark"
                : "light";
        };

        const themeObserver = new MutationObserver(syncTheme);
        syncTheme();
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        const buildGrid = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);

            const cols = Math.ceil(window.innerWidth / gap);
            const rows = Math.ceil(window.innerHeight / gap);
            const nextPoints: typeof pointsRef.current = [];

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const seed = Math.sin(row * 127.1 + col * 311.7) * 43758.5453;
                    const variation = seed - Math.floor(seed);
                    const baseAlpha =
                        variation > 0.85 ? 0.02 : variation > 0.6 ? 0.01 : 0.005;

                    nextPoints.push({
                        x: col * gap + gap / 2,
                        y: row * gap + gap / 2,
                        baseAlpha,
                        alpha: baseAlpha,
                    });
                }
            }

            pointsRef.current = nextPoints;
        };

        const draw = (timestamp: number) => {
            animRef.current = requestAnimationFrame(draw);

            if (timestamp - lastFrameRef.current < targetInterval) return;
            lastFrameRef.current = timestamp;

            const width = window.innerWidth;
            const height = window.innerHeight;
            ctx.clearRect(0, 0, width, height);

            const { x: mouseX, y: mouseY } = getMousePos();
            const isDark = themeRef.current === "dark";
            const dotColor = isDark ? "255,255,255" : "0,0,0";
            const glowColor = isDark ? "16,185,129" : "5,150,105";

            for (const point of pointsRef.current) {
                const dx = point.x - mouseX;
                const dy = point.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let targetAlpha = point.baseAlpha;
                if (dist < mouseRadius) {
                    const proximity = 1 - dist / mouseRadius;
                    targetAlpha = Math.min(0.5, point.baseAlpha + proximity * 0.45);
                }

                point.alpha += (targetAlpha - point.alpha) * fadeSpeed;

                if (point.alpha <= 0.005) continue;

                const isGlowing = dist < mouseRadius * 0.5 && dist > 0;
                const color = isGlowing ? glowColor : dotColor;

                ctx.beginPath();
                ctx.arc(point.x, point.y, dotSize, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color},${point.alpha})`;
                ctx.fill();

                if (isGlowing && point.alpha > 0.15) {
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, dotSize * 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${glowColor},${point.alpha * 0.15})`;
                    ctx.fill();
                }
            }
        };

        const handleResize = () => {
            clearTimeout(resizeRef.current);
            resizeRef.current = window.setTimeout(buildGrid, 200);
        };

        buildGrid();
        animRef.current = requestAnimationFrame(draw);
        window.addEventListener("resize", handleResize, { passive: true });

        return () => {
            cancelAnimationFrame(animRef.current);
            clearTimeout(resizeRef.current);
            window.removeEventListener("resize", handleResize);
            themeObserver.disconnect();
        };
    }, [getMousePos, isMobile, shouldSkip]);

    if (shouldSkip) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none contain-strict"
            aria-hidden="true"
        />
    );
};
