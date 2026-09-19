/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,vue,ts}",
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue",
  ],
  theme: {
    extend: {
      colors: {
        bdo: {
          // Authentic BDO backgrounds (not pure black)
          canvas: "#17181d",
          window: "#242428",
          card: "#383535",
          cardBorder: "#4a4338",
          windowBorder: "#6b5537",
          toolbar: "#1b1c20",

          // Golden / bronze title bar with highlight
          headerFrom: "#8d7042",
          headerVia: "#7b6037",
          headerTo: "#624c2a",
          headerTopBorder: "#bfa163",
          headerBottomBorder: "#3d2e18",

          // Typography
          base: "#ffedd4",
          title: "#fff3e1",

          gold: "#f3be43",
          label: "#c2b39a",
          diamond: "#f0b232",
          dim: "#828692",

          // BDO UI buttons ("Abrir Widget", bottom toolbar buttons)
          btnBg: "#44444e",
          btnBgHover: "#52525e",
          btnBorder: "#5e606e",
          btnText: "#eaecee",

          // BDO protections & combat modifiers
          sa: "#eab308",
          fg: "#3b82f6",
          iframe: "#a855f7",
          down: "#10b981",
          air: "#06b6d4",
          back: "#f97316",
          crit: "#ef4444",
        },
      },
    },
    container: {
      center: true,
      padding: {
        default: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
  },
  plugins: [],
};
