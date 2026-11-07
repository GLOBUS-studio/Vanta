import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      'legacy/**',
      'apps/demo/static/vanta2.js',
      'apps/demo/static/style.css',
      'test-results/**',
      'playwright-report/**',
      'visual-*.png',
      'pnpm-lock.yaml',
    ],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
)
