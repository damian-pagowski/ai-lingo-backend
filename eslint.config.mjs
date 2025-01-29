import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-process-exit": "error",
      "callback-return": "error",
      "handle-callback-err": "warn",
      "no-async-promise-executor": "error",
      "no-shadow": "warn",
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
      curly: "error",
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,

  // Jest-specific overrides for test files
  {
    files: ["src/tests/**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.jest, // Enables Jest globals like `describe`, `test`
      },
    },
    rules: {
      "no-undef": "off", // Avoid noise from Jest functions
      "no-console": "off", // Allow `console.log` in tests
    },
  },
];