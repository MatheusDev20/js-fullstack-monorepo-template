import { config } from '@repo/eslint-config/nest';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    ignores: ['dist/**', 'eslint.config.mjs'],
  },
];
