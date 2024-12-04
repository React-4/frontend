/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
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
        // profile: {
        //   DEFAULT: "#0045B0",
        //   0: "#F5AAAA",
        //   1: "#F8BA84",
        //   2: "#F0EA96",
        //   3: "#9CDFAA",
        //   4: "#B3DAFF",
        //   5: "#596AA2",
        //   6: "#C2B4F2",
        //   7: "#656872",
        //   8: "#907267",
        //   9: "#444444",
        // },
        profile: {
          DEFAULT: "#F37E7E",
          0: "#F37E7E",
          1: "#FFB26F",
          2: "#E6D700",
          3: "#71D685",
          4: "#71D685",
          5: "#596AA2",
          6: "#A793EF",
          7: "#656872",
          8: "#907267",
          9: "#FB9BB8",
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
      keyframes: {
        drop: {
          "0%": { transform: "translateY(0vh)" },
          "75%": { transform: "translateY(90vh)" },
          "100%": { transform: "translateY(90vh)" },
        },
        stem: {
          "0%": { opacity: "1" },
          "65%": { opacity: "1" },
          "75%": { opacity: "0" },
          "100%": { opacity: "0" },
        },
        splat: {
          "0%": { opacity: "1", transform: "scale(0)" },
          "80%": { opacity: "1", transform: "scale(0)" },
          "90%": { opacity: "0.5", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(1.5)" },
        },
      },
      animation: {
        drop: "drop 0.5s linear infinite",
        stem: "stem 0.5s linear infinite",
        splat: "splat 0.5s linear infinite",
      },
    },
  },
  plugins: [],
};
