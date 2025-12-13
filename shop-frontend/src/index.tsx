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
<<<<<<< HEAD
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
        shape: { borderRadius: 8 },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 700,
            color: mode === "light" ? "#333" : "#fff",
          },
          h5: {
            fontWeight: 700,
            color: mode === "light" ? "#333" : "#fff",
          },
          h6: {
            fontWeight: 600,
            color: mode === "light" ? "#333" : "#fff",
          },
        },
        components: {
          MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
              root: {
                borderRadius: 8,
                border:
                  mode === "light"
                    ? "1px solid #E8E8E8"
                    : "1px solid rgba(255,255,255,0.1)",
                backgroundColor: mode === "light" ? "#fff" : "#1e1e1e",
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                "& .MuiOutlinedInput-root": {
                  backgroundColor: mode === "light" ? "#fff" : "#2a2a2a",
                },
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
=======
          primary: { main: mode === "light" ? "#009688" : "#80cbc4" },
          secondary: { main: mode === "light" ? "#f50057" : "#ff4081" },
          background: {
            default: mode === "light" ? "#f7f9fb" : "#121212",
            paper: mode === "light" ? "#fff" : "#1e1e1e",
          },
        },
        shape: { borderRadius: 12 },
        components: {
          MuiPaper: {
            defaultProps: { elevation: 1 },
            styleOverrides: {
              root: {
                borderRadius: 12,
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
              },
            },
          },
          MuiButton: {
            styleOverrides: {
<<<<<<< HEAD
              root: {
                borderRadius: 8,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              },
              containedPrimary: {
                background: "linear-gradient(135deg, #1A94FF 0%, #0D7AE6 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0D7AE6 0%, #0A6BC7 100%)",
                },
              },
              containedSecondary: {
                background: "linear-gradient(135deg, #FF424E 0%, #E53935 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #E53935 0%, #D32F2F 100%)",
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 6,
                fontWeight: 600,
              },
            },
=======
              root: { borderRadius: 8, textTransform: "none" },
            },
          },
          MuiChip: {
            styleOverrides: { root: { borderRadius: 6 } },
>>>>>>> 83f9cad29c9cf4d36b6a2b706e52c807bb20e551
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
