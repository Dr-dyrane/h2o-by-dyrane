import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
};

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

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
}
