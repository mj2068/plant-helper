module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ["prettier"],
  extends: [
    "eslint:recommended",
    "@vue/typescript/recommended",
    // "plugin:vue/vue3-essential",
    "plugin:vue/vue3-recommended",
    "plugin:vue-pug/vue3-recommended",
    // "plugin:prettier/recommended",
    "prettier",
    // "@ionic/eslint-config/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "vue/no-deprecated-slot-attribute": "off",
    "vue/no-unused-components": "warn",
    "prefer-const": "warn",
    // "prettier/prettier": "error",
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)",
      ],
      env: {
        jest: true,
      },
    },
  ],
};
