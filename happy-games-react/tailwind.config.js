/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gaming: {
          bg: "#0B0F19",
          card: "#171E2F",
          cardBorder: "#2B354F",
          primary: "#6366F1",
          primaryHover: "#4F46E5",
          accent: "#F59E0B",
          accentHover: "#D97706",
          textLight: "#F3F4F6",
          textMuted: "#9CA3AF",
        }
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "Orbitron", "sans-serif"],
        nunito: ["var(--font-nunito)", "Nunito", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 15px rgba(99, 102, 241, 0.4)",
        neonAmber: "0 0 15px rgba(245, 158, 11, 0.4)",
      }
    },
  },
  plugins: [],
};
