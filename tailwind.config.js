// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", ".dark"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#e67e22", // warm orange
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#2c3e50", // dark slate
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#f39c12", // golden yellow
          foreground: "#000000",
        },
        muted: {
          DEFAULT: "#ecf0f1", // light gray
          foreground: "#7f8c8d",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#2c3e50",
        },
        destructive: {
          DEFAULT: "#e74c3c",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#27ae60",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};