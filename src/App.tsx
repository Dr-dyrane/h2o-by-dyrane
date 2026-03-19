import { Suspense, lazy, useEffect, useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const Analytics = lazy(() =>
  import("@vercel/analytics/react").then((module) => ({ default: module.Analytics }))
);

const shouldRenderHome = (path: string) => {
  const pathname = path.split("?")[0] ?? path;
  return pathname === "/" || pathname === "";
};

const shouldEnableAnalytics = () => {
  if (!import.meta.env.PROD || typeof window === "undefined") {
    return false;
  }

  return (
    (
      window as Window & {
        __ENABLE_VERCEL_ANALYTICS__?: boolean;
      }
    ).__ENABLE_VERCEL_ANALYTICS__ === true
  );
};

const AnalyticsMount = () => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldEnableAnalytics()) {
      setShouldLoad(true);
    }
  }, []);

  if (!shouldLoad) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Analytics />
    </Suspense>
  );
};

export const AppContent = ({ path = "/" }: { path?: string }) => (
  <ThemeProvider>
    <AnalyticsMount />
    {shouldRenderHome(path) ? <Index /> : <NotFound path={path} />}
  </ThemeProvider>
);

const App = () => <AppContent />;

export default App;
