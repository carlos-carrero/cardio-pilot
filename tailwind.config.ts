import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ── Surfaces ──
        ink: "#141311",
        "ink-secondary": "#36342f",
        paper: "#f7f5f0",
        "warm-white": "#ffffff",
        surface: "#f0ede7",
        "surface-raised": "#f5f3ee",
        // ── Brand ──
        accent: "#2d6a4f",
        "accent-hover": "#1f5038",
        "accent-soft": "#eaf1ed",
        "accent-muted": "#d5e3db",
        // ── Neutral chrome ──
        muted: "#6b6862",
        rule: "#d8d4cc",
        "rule-light": "#e5e1da",
        // ── Authority / dark panels ──
        "trace-bg": "#111110",
        "trace-text": "#c8c8c4",
        authority: "#0c0c0b",
        "authority-surface": "#1a1918",
        "authority-text": "#b8b6b0",
        "authority-accent": "#4d9972",
        // ── Semantic (restrained) ──
        emergency: "#a62222",
        "emergency-soft": "#faf0f0",
        urgent: "#9c7a18",
        "urgent-soft": "#f8f4ea",
        caution: "#8a6018",
        routine: "#2d6a4f",
        info: "#2c5580",
        deferred: "#6b6862",
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "system-ui", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["3.5rem", { lineHeight: "0.96", letterSpacing: "-0.04em" }],
        "display-lg": ["2.75rem", { lineHeight: "1.05", letterSpacing: "-0.035em" }],
        "display": ["2rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "heading-lg": ["1.75rem", { lineHeight: "1.15", letterSpacing: "-0.025em" }],
        "heading": ["1.375rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.65" }],
        "body": ["0.9375rem", { lineHeight: "1.7" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        "caption": ["0.8125rem", { lineHeight: "1.5" }],
        "meta": ["0.75rem", { lineHeight: "1.5" }],
        "label": ["0.6875rem", { lineHeight: "1.3", letterSpacing: "0.06em" }],
        "eyebrow": ["0.625rem", { lineHeight: "1.3", letterSpacing: "0.14em" }],
      },
      letterSpacing: {
        tightest: "-0.05em",
        tighter: "-0.035em",
        eyebrow: "0.14em",
        label: "0.18em",
      },
      borderRadius: {
        card: "0.625rem",
        btn: "0.4375rem",
        badge: "0.3125rem",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.03), 0 0 0 1px rgb(0 0 0 / 0.02)",
        "card-hover": "0 3px 12px 0 rgb(0 0 0 / 0.06), 0 0 0 1px rgb(0 0 0 / 0.03)",
        panel: "0 2px 6px 0 rgb(0 0 0 / 0.04), 0 0 0 1px rgb(0 0 0 / 0.02)",
        btn: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        "authority": "inset 0 1px 0 0 rgb(255 255 255 / 0.04)",
      },
      spacing: {
        "header": "4rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
