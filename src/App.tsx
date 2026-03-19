import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UIProvider } from "@/context/UIContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const Analytics = lazy(() =>
  import("@vercel/analytics/react").then((module) => ({ default: module.Analytics }))
);

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export const AppContent = () => (
  <UIProvider>
    <ThemeProvider>
      {import.meta.env.PROD ? (
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      ) : null}
      <AppRoutes />
    </ThemeProvider>
  </UIProvider>
);

const App = () => <AppContent />;

export default App;
