import { Profiler } from "react";

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
          5: "#FFE4E4",
        },
        good: {
          DEFAULT: "#FFE4E4",
          1: "#FF5959",
        },
        bad: {
          DEFAULT: "#E8F2FF",
          1: "#2372EB",
        },
        profile: {
          DEFAULT: "#0045B0",
          0: "#F5AAAA",
          1: "#F8BA84",
          2: "#F0EA96",
          3: "#9CDFAA",
          4: "#B3DAFF",
          5: "#596AA2",
          6: "#C2B4F2",
          7: "#656872",
          8: "#907267",
          9: "#FFCDDC",
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
