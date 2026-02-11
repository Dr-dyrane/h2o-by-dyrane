import { useEffect, useRef } from "react";

interface Point {
    x: number;
    y: number;
    baseAlpha: number;
    alpha: number;
}

export const MatrixBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const pointsRef = useRef<Point[]>([]);
    const animRef = useRef<number>(0);
    const resizeRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const GAP = 28;
        const DOT_SIZE = 1.5;
        const MOUSE_RADIUS = 160;
        const FADE_SPEED = 0.04;

        const buildGrid = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);

            const cols = Math.ceil(window.innerWidth / GAP);
            const rows = Math.ceil(window.innerHeight / GAP);
            const points: Point[] = [];

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    // Seeded variation — some dots slightly brighter
                    const seed = Math.sin(row * 127.1 + col * 311.7) * 43758.5453;
                    const variation = (seed - Math.floor(seed));
                    const baseAlpha = variation > 0.85 ? 0.02 : variation > 0.6 ? 0.01 : 0.005;

                    points.push({
                        x: col * GAP + GAP / 2,
                        y: row * GAP + GAP / 2,
                        baseAlpha,
                        alpha: baseAlpha,
                    });
                }
            }
            pointsRef.current = points;
        };

        const draw = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            ctx.clearRect(0, 0, w, h);

            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;

            // Read CSS variable to determine theme
            const surface = getComputedStyle(document.documentElement).getPropertyValue("--surface").trim();
            const isDark = surface === "#0D0D0D";
            const dotColor = isDark ? "255,255,255" : "0,0,0";
            const glowColor = isDark ? "16,185,129" : "5,150,105"; // emerald

            for (const point of pointsRef.current) {
                const dx = point.x - mx;
                const dy = point.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Target alpha based on mouse proximity
                let targetAlpha = point.baseAlpha;
                if (dist < MOUSE_RADIUS) {
                    const proximity = 1 - dist / MOUSE_RADIUS;
                    targetAlpha = Math.min(0.5, point.baseAlpha + proximity * 0.45);
                }

                // Smooth lerp
                point.alpha += (targetAlpha - point.alpha) * FADE_SPEED;

                // Draw dot
                if (point.alpha > 0.005) {
                    const isGlowing = dist < MOUSE_RADIUS * 0.5 && dist > 0;
                    const color = isGlowing ? glowColor : dotColor;

                    ctx.beginPath();
                    ctx.arc(point.x, point.y, DOT_SIZE, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${color},${point.alpha})`;
                    ctx.fill();

                    // Subtle glow on close dots
                    if (isGlowing && point.alpha > 0.15) {
                        ctx.beginPath();
                        ctx.arc(point.x, point.y, DOT_SIZE * 2.5, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${glowColor},${point.alpha * 0.15})`;
                        ctx.fill();
                    }
                }
            }

            animRef.current = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        const handleResize = () => {
            clearTimeout(resizeRef.current);
            resizeRef.current = window.setTimeout(buildGrid, 150);
        };

        buildGrid();
        animRef.current = requestAnimationFrame(draw);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animRef.current);
            clearTimeout(resizeRef.current);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
            aria-hidden="true"
        />
    );
};
