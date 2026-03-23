import { createContext, useContext, useEffect, useState, ReactNode } from "react";

/**
 * Supported UI themes for the portfolio.
 */
type Theme = "light" | "dark";

/**
 * Theme context contract exposed to the app tree.
 */
interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Applies the selected theme class to the document root.
 *
 * @param theme Theme value to apply.
 */
const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
};

/**
 * Reads the initial theme from the current document classes.
 *
 * @returns Active theme inferred from the server-rendered document.
 */
const getInitialTheme = (): Theme => {
    if (typeof document === "undefined") {
        return "dark";
    }

    const root = document.documentElement;
    if (root.classList.contains("light")) {
        return "light";
    }

    return "dark";
};

/**
 * Provides theme state and toggling to the application tree.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        applyTheme(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Accessor hook for the shared theme context.
 *
 * @returns Current theme state and toggle action.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
}
