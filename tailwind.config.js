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
        primary: "#026873",
        secondary: "#011526",
        black: "#01060D",
        blue: "#04D9D9",
        lblue: "#05F2DB",
        transparentBlack: "rgba(0,0,0,0.3)"
      },
      fontFamily: {
        main: "Inter"
      },
      width: {
        standard: "1600px",
        mintContainer: "600px"
      },
      scale: {
        imageIcon: "4"
      },
      screens: {
        '2xl': '1900px',
        '3xl': "2100px"
      }
    },
  },
  plugins: [],
}
