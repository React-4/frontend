/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0045B0",
          1: "#F6F7F9",
          2: "#949494",
          3: "#F04452",
          4: "#3182F6",
        },
      },
      width: {
        "94%": "94%",
        "3%": "3%",
        "1/20": "2%",
      },
      borderWidth: {
        1: "1.5px",
      },
      maxHeight: {
        18: "70px",
      },
    },
  },
  plugins: [],
};
