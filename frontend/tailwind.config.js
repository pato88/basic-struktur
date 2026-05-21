/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Menggunakan strategi class untuk theme dark mode
  theme: {
    extend: {
      // Kita bisa menambahkan custom colors/desain premium di sini nanti
    },
  },
  plugins: [],
}
