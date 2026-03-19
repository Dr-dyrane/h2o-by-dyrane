import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UIProvider } from "@/context/UIContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Analytics } from "@vercel/analytics/react";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export const AppContent = () => (
  <UIProvider>
    <ThemeProvider>
      <Analytics />
      <AppRoutes />
    </ThemeProvider>
  </UIProvider>
);

const App = () => <AppContent />;

export default App;
