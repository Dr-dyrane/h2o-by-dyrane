import { useState, useEffect } from "react";

/**
 * NoSSR - Client-only wrapper component
 * Prevents children from rendering during SSR
 * Use for browser-only components (Canvas, WebGL, window APIs)
 */
export const NoSSR = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null during SSR, render children after client mount
  return <>{mounted ? children : null}</>;
};
