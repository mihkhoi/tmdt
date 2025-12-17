import { useEffect } from "react";

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description?: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl
          ? event.ctrlKey || event.metaKey
          : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          event.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);
};

// Common shortcuts
export const commonShortcuts = {
  search: (action: () => void) => ({
    key: "k",
    ctrl: true,
    action,
    description: "Focus search",
  }),
  cart: (action: () => void) => ({
    key: "c",
    ctrl: true,
    action,
    description: "Open cart",
  }),
  wishlist: (action: () => void) => ({
    key: "w",
    ctrl: true,
    action,
    description: "Open wishlist",
  }),
  comparison: (action: () => void) => ({
    key: "x",
    ctrl: true,
    action,
    description: "Open comparison",
  }),
  darkMode: (action: () => void) => ({
    key: "d",
    ctrl: true,
    shift: true,
    action,
    description: "Toggle dark mode",
  }),
};
