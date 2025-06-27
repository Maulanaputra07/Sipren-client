/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        white: "#fff",
        black: "#000",
        gray: "#bfbfbf",
        sidebar_color: "#d8dbe0",
        orange_main: "#ffbd15",
        orange_scale: "#ffa200",
        orange_fade: "#FBD798",
        greenyellow: "#00FF00",
        green: "#00AA00",
        blue: "#0085ff",
        skyblue: "#00A2FF",
        blue_scale: "#004674",
        blue_dark: "#112a42",
        blue_light: "#E0F2FE",
        red: "#FF0000",
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        urbanist: ['Urbanist', 'sans-serif'],
      }
    }
  },
  plugins: [],
};
