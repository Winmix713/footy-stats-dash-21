import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a12",
        "background-lighter": "#0c0f16",
      },
      blur: {
        '3xl': '64px',
      }
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        dividerWeight: "1px", 
        disabledOpacity: 0.45, 
        fontSize: {
          tiny: "0.75rem",   // 12px
          small: "0.875rem", // 14px
          medium: "0.9375rem", // 15px
          large: "1.125rem", // 18px
        },
        lineHeight: {
          tiny: "1rem", 
          small: "1.25rem", 
          medium: "1.5rem", 
          large: "1.75rem", 
        },
        radius: {
          small: "6px", 
          medium: "8px", 
          large: "12px", 
        },
        borderWidth: {
          small: "1px", 
          medium: "1px", 
          large: "2px", 
        },
      },
      themes: {
        light: {
          colors: {
            background: {
              DEFAULT: "#0a0a12"
            },
            content1: {
              DEFAULT: "#0c0f16",
              foreground: "#f9fafb"
            },
            content2: {
              DEFAULT: "#161a24",
              foreground: "#f3f4f6"
            },
            content3: {
              DEFAULT: "#1f2937",
              foreground: "#e5e7eb"
            },
            content4: {
              DEFAULT: "#374151",
              foreground: "#d1d5db"
            },
            divider: {
              DEFAULT: "rgba(255, 255, 255, 0.1)"
            },
            focus: {
              DEFAULT: "#8b5cf6"
            },
            foreground: {
              DEFAULT: "#f9fafb",
              50: "#f9fafb",
              100: "#f3f4f6",
              200: "#e5e7eb",
              300: "#d1d5db",
              400: "#9ca3af",
              500: "#6b7280",
              600: "#4b5563",
              700: "#374151",
              800: "#1f2937",
              900: "#111827"
            },
            primary: {
              50: "#f5f3ff",
              100: "#ede9fe",
              200: "#ddd6fe",
              300: "#c4b5fd",
              400: "#a78bfa",
              500: "#8b5cf6",
              600: "#7c3aed",
              700: "#6d28d9",
              800: "#5b21b6",
              900: "#4c1d95",
              DEFAULT: "#8b5cf6",
              foreground: "#ffffff"
            }
          }
        },
        dark: {
          colors: {
            background: {
              DEFAULT: "#0a0a12"
            },
            content1: {
              DEFAULT: "#0c0f16",
              foreground: "#f9fafb"
            },
            content2: {
              DEFAULT: "#161a24",
              foreground: "#f3f4f6"
            },
            content3: {
              DEFAULT: "#1f2937",
              foreground: "#e5e7eb"
            },
            content4: {
              DEFAULT: "#374151",
              foreground: "#d1d5db"
            },
            divider: {
              DEFAULT: "rgba(255, 255, 255, 0.1)"
            },
            focus: {
              DEFAULT: "#8b5cf6"
            },
            foreground: {
              DEFAULT: "#f9fafb",
              50: "#f9fafb",
              100: "#f3f4f6",
              200: "#e5e7eb",
              300: "#d1d5db",
              400: "#9ca3af",
              500: "#6b7280",
              600: "#4b5563",
              700: "#374151",
              800: "#1f2937",
              900: "#111827"
            },
            primary: {
              50: "#f5f3ff",
              100: "#ede9fe",
              200: "#ddd6fe",
              300: "#c4b5fd",
              400: "#a78bfa",
              500: "#8b5cf6",
              600: "#7c3aed",
              700: "#6d28d9",
              800: "#5b21b6",
              900: "#4c1d95",
              DEFAULT: "#8b5cf6",
              foreground: "#ffffff"
            }
          }
        }
      }
    })
  ]
}