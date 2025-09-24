module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 2020, sourceType: "module" },
  env: { node: true, es2020: true },
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  rules: {
    "import/order": [
      "warn",
      { "newlines-between": "always", "alphabetize": { "order": "asc" } }
    ],
    "@typescript-eslint/no-misused-promises": ["error", { "checksVoidReturn": false }]
  }
};

