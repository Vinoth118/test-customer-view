module.exports = {
  parser: "@babel/eslint-parser",
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: "next/core-web-vitals",
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react"],
  rules: {
    "@next/next/no-img-element": "off",
  },
};
