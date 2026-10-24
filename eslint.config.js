import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier],
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'error',
      'prefer-const': 'error',
      'no-restricted-syntax': [
        'error',
        { selector: 'VariableDeclaration[kind="let"]', message: 'No let: use const.' },
      ],
      curly: ['error', 'all'],
    },
  },
);
