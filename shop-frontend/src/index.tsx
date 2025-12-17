// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Provider } from "react-redux";
import { store } from "./store/store";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { I18nProvider } from "./i18n";

function useAppTheme() {
  const [mode, setMode] = React.useState<"light" | "dark">(
    (localStorage.getItem("theme_mode") as any) === "dark" ? "dark" : "light"
  );
  React.useEffect(() => {
    const onToggle = () => {
      setMode((m) => {
        const next = m === "light" ? "dark" : "light";
        localStorage.setItem("theme_mode", next);
        return next;
      });
    };
    const onSet = (e: any) => {
      const next = e.detail === "dark" ? "dark" : "light";
      localStorage.setItem("theme_mode", next);
      setMode(next);
    };
    window.addEventListener("app:toggle-theme", onToggle);
    window.addEventListener("app:set-theme", onSet as any);
    return () => {
      window.removeEventListener("app:toggle-theme", onToggle);
      window.removeEventListener("app:set-theme", onSet as any);
    };
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#1A94FF",
            light: "#4DB5FF",
            dark: "#0D7AE6",
            contrastText: "#fff",
          },
          secondary: {
            main: "#FF424E",
            light: "#FF6B75",
            dark: "#E53935",
            contrastText: "#fff",
          },
          error: {
            main: "#FF424E",
            light: "#FF6B75",
            dark: "#E53935",
          },
          success: {
            main: "#4CAF50",
            light: "#81C784",
            dark: "#388E3C",
          },
          warning: {
            main: "#FFC120",
            light: "#FFD54F",
            dark: "#F9A825",
          },
          background: {
            default: mode === "light" ? "#F5F5F5" : "#121212",
            paper: mode === "light" ? "#fff" : "#1e1e1e",
          },
          text: {
            primary: mode === "light" ? "#333" : "#fff",
            secondary: mode === "light" ? "#666" : "#ccc",
          },
        },
        shape: { borderRadius: 12 },
        spacing: 8,
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: 14,
          fontWeightLight: 300,
          fontWeightRegular: 400,
          fontWeightMedium: 500,
          fontWeightBold: 700,
          h1: {
            fontSize: "2.5rem",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: mode === "light" ? "#1a1a1a" : "#ffffff",
          },
          h2: {
            fontSize: "2rem",
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            color: mode === "light" ? "#1a1a1a" : "#ffffff",
          },
          h3: {
            fontSize: "1.75rem",
            fontWeight: 600,
            lineHeight: 1.4,
            color: mode === "light" ? "#1a1a1a" : "#ffffff",
          },
          h4: {
            fontSize: "1.5rem",
            fontWeight: 600,
            lineHeight: 1.4,
            color: mode === "light" ? "#1a1a1a" : "#ffffff",
          },
          h5: {
            fontSize: "1.25rem",
            fontWeight: 600,
            lineHeight: 1.5,
            color: mode === "light" ? "#1a1a1a" : "#ffffff",
          },
          h6: {
            fontSize: "1.125rem",
            fontWeight: 600,
            lineHeight: 1.5,
            color: mode === "light" ? "#1a1a1a" : "#ffffff",
          },
          body1: {
            fontSize: "1rem",
            lineHeight: 1.6,
            color: mode === "light" ? "#4a4a4a" : "#e0e0e0",
          },
          body2: {
            fontSize: "0.875rem",
            lineHeight: 1.5,
            color: mode === "light" ? "#666" : "#ccc",
          },
          button: {
            fontSize: "0.9375rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
            textTransform: "none",
          },
          caption: {
            fontSize: "0.8125rem",
            lineHeight: 1.4,
            color: mode === "light" ? "#888" : "#aaa",
          },
        },
        components: {
          MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
              root: {
                borderRadius: 12,
                border:
                  mode === "light"
                    ? "1px solid #E8E8E8"
                    : "1px solid rgba(255,255,255,0.1)",
                backgroundColor: mode === "light" ? "#fff" : "#1e1e1e",
                transition: "all 0.2s ease",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: mode === "light" ? "#fff" : "#1e1e1e",
                border:
                  mode === "light"
                    ? "1px solid #E8E8E8"
                    : "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow:
                    mode === "light"
                      ? "0 8px 24px rgba(0,0,0,0.08)"
                      : "0 8px 24px rgba(0,0,0,0.3)",
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.9375rem",
                padding: "10px 24px",
                boxShadow: "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              },
              containedPrimary: {
                background: "linear-gradient(135deg, #1A94FF 0%, #0D7AE6 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0D7AE6 0%, #0A6BC7 100%)",
                  boxShadow: "0 6px 16px rgba(26,148,255,0.3)",
                },
              },
              containedSecondary: {
                background: "linear-gradient(135deg, #FF424E 0%, #E53935 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #E53935 0%, #D32F2F 100%)",
                  boxShadow: "0 6px 16px rgba(255,66,78,0.3)",
                },
              },
              outlined: {
                borderWidth: "1.5px",
                "&:hover": {
                  borderWidth: "1.5px",
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                fontWeight: 500,
                fontSize: "0.8125rem",
                height: 28,
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: 10,
                  backgroundColor: mode === "light" ? "#fff" : "#2a2a2a",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: mode === "light" ? "#1A94FF" : "#4DB5FF",
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderWidth: "2px",
                    },
                  },
                },
                "& .MuiInputLabel-root": {
                  fontSize: "0.9375rem",
                },
              },
            },
          },
          MuiContainer: {
            styleOverrides: {
              root: {
                paddingLeft: "16px",
                paddingRight: "16px",
                "@media (min-width: 600px)": {
                  paddingLeft: "24px",
                  paddingRight: "24px",
                },
                "@media (min-width: 1200px)": {
                  paddingLeft: "32px",
                  paddingRight: "32px",
                },
              },
            },
          },
        },
      }),
    [mode]
  );
  return theme;
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

function Root() {
  const theme = useAppTheme();
  return (
    <Provider store={store}>
      <I18nProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </I18nProvider>
    </Provider>
  );
}

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
