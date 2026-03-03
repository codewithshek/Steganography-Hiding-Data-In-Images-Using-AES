import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const useThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const styleId = "theme-transition-styles";

  const updateStyles = useCallback((css: string) => {
    if (typeof window === "undefined") return;

    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(!isDark);

    // Pixel matrix hacking animation
    const gifUrl =
      "https://media.giphy.com/media/5PncuvcXbBuIZcSiQo/giphy.gif?cid=ecf05e47j7vdjtytp3fu84rslaivdun4zvfhej6wlvl6qqsz&ep=v1_stickers_search&rid=giphy.gif&ct=s";

    const css = `
      ::view-transition-group(root) {
        animation-timing-function: cubic-bezier(0.87, 0, 0.13, 1);
        animation-duration: 1.5s;
      }

      ::view-transition-new(root) {
        mask: url('${gifUrl}') center / 0 no-repeat;
        mask-origin: content-box;
        animation: scale-hacking 1.5s forwards;
      }

      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: scale-hacking 1.5s forwards;
        z-index: -1;
      }

      @keyframes scale-hacking {
        0% {
          mask-size: 0;
        }
        10% {
          mask-size: 50vmax;
        }
        90% {
          mask-size: 50vmax;
        }
        100% {
          mask-size: 2000vmax;
        }
      }
    `;

    updateStyles(css);

    if (typeof window === "undefined") return;

    const switchTheme = () => {
      setTheme(theme === "light" ? "dark" : "light");
    };

    if (!document.startViewTransition) {
      switchTheme();
      return;
    }

    document.startViewTransition(switchTheme);
  }, [theme, setTheme, updateStyles, isDark, setIsDark]);

  return { isDark, toggleTheme };
};

export const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { isDark, toggleTheme } = useThemeToggle();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  return (
    <button
      type="button"
      className={cn(
        "group relative flex size-10 items-center justify-center cursor-pointer rounded-md border p-0 transition-all duration-300 active:scale-95 shadow-sm overflow-hidden",
        "bg-noir-800 border-noir-700",
        isDark
          ? "hover:border-accent-gold hover:shadow-[0_0_15px_rgba(195,163,67,0.3)]"
          : "hover:border-accent-crimson hover:shadow-[0_0_15px_rgba(139,0,0,0.3)]",
        className,
      )}
      onClick={toggleTheme}
      title="Toggle Dark/Light Hacking Mode"
    >
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-accent-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity translate-y-full group-hover:translate-y-0 duration-300" />

      <span className="sr-only">Toggle theme</span>

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <motion.div
          initial={false}
          animate={{
            rotate: isDark ? 0 : 180,
            scale: isDark ? 1 : 0.8,
            opacity: isDark ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center text-accent-gold drop-shadow-[0_0_8px_rgba(195,163,67,0.5)]"
        >
          <VisibilityIcon isDark={true} />
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            rotate: !isDark ? 0 : -180,
            scale: !isDark ? 1 : 0.8,
            opacity: !isDark ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center text-zinc-900 drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]"
        >
          <VisibilityIcon isDark={false} />
        </motion.div>
      </div>
    </button>
  );
};

function VisibilityIcon({ isDark }: { isDark: boolean }) {
  if (isDark) {
    return <Eye className="w-5 h-5" strokeWidth={1.5} />;
  }
  return <EyeOff className="w-5 h-5 text-paper-100" strokeWidth={1.5} />;
}
