/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0f1a",
        surface: "#121a2a",
        surfaceLight: "#1a2336",
        border: "#24324a",
        text: "#e6eef8",
        muted: "#94a3b8",
        accent: "#22d3ee",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        critical: "#ff3b3b",
      },
      boxShadow: {
        glow: "0 0 20px rgba(34, 211, 238, 0.15)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
