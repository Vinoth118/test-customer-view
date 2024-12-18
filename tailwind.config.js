/** @type {import('tailwindcss').Config} */
module.exports = {
  webpack: (config) => {
    config.resolve.alias["@"] = __dirname;
    return config;
  },
  plugins: [
    function ({ addComponents }) {
      const components = {
        'input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button':
        {
          "@apply appearance-none": {},
          margin: "0",
        },
        'input[type="number"]': {
          "@apply appearance-none": {},
        },
      };
      addComponents(components, ["responsive", "hover"]);
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography')
    },
    require('tailwind-scrollbar'),
  ],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
};
