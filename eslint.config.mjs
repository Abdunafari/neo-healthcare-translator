import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = {
  rules: {
    "rule-name": "off",
    "no-console": "off", // Disable console warnings
    "no-unused-vars": "off", // Allow unused variables
    "no-undef": "off", // Disable undefined variable errors
    "no-empty": "off", // Allow empty blocks
    "no-redeclare": "off", // Allow variable redeclaration
    "no-prototype-builtins": "off", // Disable built-in prototype rule
    "no-unreachable": "off", // Allow unreachable code
    "no-debugger": "off", // Allow debugger usage
    "@typescript-eslint/no-explicit-any": "off", // Allow 'any' type in TypeScript
    "@typescript-eslint/ban-ts-comment": "off", // Allow TS ignore comments
    "@typescript-eslint/no-non-null-assertion": "off", // Allow non-null assertions
  },
  ignorePatterns: ["node_modules/", "dist/", "build/"], // Ignore common build folders
};

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off", // Disable Next.js link warnings
    },
  },
];

export default eslintConfig;
