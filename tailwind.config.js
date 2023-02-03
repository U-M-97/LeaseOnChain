/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FA13D2",
        secondary: "#FAD52D",
        third: "#2DFAEF",
        fourth: "#05ADA4",
        fifth: "#AD1F96",
      },
      fontFamily: {
        main: "Inter"
      },
      width: {
        standard: "1600px"
      }
    },
  },
  plugins: [],
}
