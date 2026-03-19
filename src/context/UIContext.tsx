import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    useCallback,
    ReactNode,
} from "react";

export type PointerType = "mouse" | "touch" | "pen";
export type PerfTier = "high" | "medium" | "low";

export interface UIContextValue {
    isMobile: boolean;
    isLowPower: boolean;
    canUseWebGL: boolean;
    pointerType: PointerType;
    prefersReducedMotion: boolean;
    perfTier: PerfTier;
    getMousePos: () => { x: number; y: number };
}

const SSR_DEFAULTS: Omit<UIContextValue, "getMousePos"> = {
    isMobile: false,
    isLowPower: false,
    canUseWebGL: true,
    pointerType: "mouse",
    prefersReducedMotion: false,
    perfTier: "high",
};

const UIContext = createContext<UIContextValue | undefined>(undefined);

const MOBILE_MEDIA_QUERY = "(max-width: 767px)";
const MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)";
const COARSE_POINTER_MEDIA_QUERY = "(pointer: coarse)";

function detectCapabilities(): Omit<UIContextValue, "getMousePos"> {
    const isMobile = window.matchMedia(MOBILE_MEDIA_QUERY).matches;

    let canUseWebGL = false;
    try {
        const canvas = document.createElement("canvas");
        canUseWebGL = !!(
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl")
        );
    } catch {
        canUseWebGL = false;
    }

    const prefersReducedMotion = window.matchMedia(MOTION_MEDIA_QUERY).matches;

    const pointerType: PointerType = window.matchMedia(COARSE_POINTER_MEDIA_QUERY).matches
        ? "touch"
        : "mouse";

    const isLowPower =
        prefersReducedMotion ||
        (isMobile && (window.devicePixelRatio ?? 1) < 1.5) ||
        !canUseWebGL;

    let perfTier: PerfTier = "high";
    if (prefersReducedMotion || !canUseWebGL) perfTier = "low";
    else if (isMobile) perfTier = "medium";

    return {
        isMobile,
        canUseWebGL,
        prefersReducedMotion,
        pointerType,
        isLowPower,
        perfTier,
    };
}

function applyPerfClass(tier: PerfTier) {
    const root = document.documentElement;
    root.classList.remove("perf-high", "perf-medium", "perf-low");
    root.classList.add(`perf-${tier}`);
}

export function UIProvider({ children }: { children: ReactNode }) {
    const [caps, setCaps] = useState<Omit<UIContextValue, "getMousePos">>(SSR_DEFAULTS);

    const mousePosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
    const rawMouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const syncCapabilities = () => {
            const updated = detectCapabilities();
            setCaps(updated);
            applyPerfClass(updated.perfTier);
        };

        const mobileQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
        const motionQuery = window.matchMedia(MOTION_MEDIA_QUERY);
        const pointerQuery = window.matchMedia(COARSE_POINTER_MEDIA_QUERY);

        syncCapabilities();

        mobileQuery.addEventListener("change", syncCapabilities);
        motionQuery.addEventListener("change", syncCapabilities);
        pointerQuery.addEventListener("change", syncCapabilities);
        window.addEventListener("resize", syncCapabilities, { passive: true });

        return () => {
            mobileQuery.removeEventListener("change", syncCapabilities);
            motionQuery.removeEventListener("change", syncCapabilities);
            pointerQuery.removeEventListener("change", syncCapabilities);
            window.removeEventListener("resize", syncCapabilities);
        };
    }, []);

    useEffect(() => {
        if (caps.pointerType !== "mouse") {
            mousePosRef.current = { x: -1000, y: -1000 };
            rawMouseRef.current = { x: -1000, y: -1000 };
            cancelAnimationFrame(rafRef.current);
            rafRef.current = 0;
            return;
        }

        const settleThreshold = 0.5;

        const tick = () => {
            const raw = rawMouseRef.current;
            const cur = mousePosRef.current;
            const next = {
                x: cur.x + (raw.x - cur.x) * 0.12,
                y: cur.y + (raw.y - cur.y) * 0.12,
            };

            mousePosRef.current = next;

            const settled =
                Math.abs(next.x - raw.x) <= settleThreshold &&
                Math.abs(next.y - raw.y) <= settleThreshold;

            if (settled) {
                mousePosRef.current = { ...raw };
                rafRef.current = 0;
                return;
            }

            rafRef.current = requestAnimationFrame(tick);
        };

        const scheduleTick = () => {
            if (rafRef.current !== 0) return;
            rafRef.current = requestAnimationFrame(tick);
        };

        const onMouseMove = (e: MouseEvent) => {
            rawMouseRef.current = { x: e.clientX, y: e.clientY };
            scheduleTick();
        };

        const onLeave = () => {
            rawMouseRef.current = { x: -1000, y: -1000 };
            scheduleTick();
        };

        window.addEventListener("mousemove", onMouseMove, { passive: true });
        window.addEventListener("mouseleave", onLeave, { passive: true });

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseleave", onLeave);
        };
    }, [caps.pointerType]);

    const getMousePos = useCallback(() => ({ ...mousePosRef.current }), []);

    return (
        <UIContext.Provider value={{ ...caps, getMousePos }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI(): UIContextValue {
    const ctx = useContext(UIContext);
    if (!ctx) throw new Error("useUI must be used within <UIProvider>");
    return ctx;
}
