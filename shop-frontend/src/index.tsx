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
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: { borderRadius: 8, textTransform: "none" },
            },
          },
          MuiChip: {
            styleOverrides: { root: { borderRadius: 6 } },
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
