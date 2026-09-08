import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  {
    ignores: [
      "front-end/**",
      "back-end/**",
      "infra/migrations/**",
      ".nuxt/**",
      ".output/**",
      "dist/**",
      "node_modules/**",
      ".vscode/**",
      "coverage/**",
      "tests/**",
      "test/**",
      "**/*.test.{js,ts}",
      "**/*.spec.{js,ts}",
    ],
  },

  {
    files: ["server/**/*.{js,mjs,ts}"],
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^(event|_)" }],
    },
  },
);
