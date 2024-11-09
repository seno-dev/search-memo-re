import ts from 'typescript-eslint'
import next from '@next/eslint-plugin-next'
import config from '@rs2837/eslint-config'

export default ts.config(
  {
    ignores: ['**/.next/**', '**/dist/**', 'components/ui/snippets'],
  },
  {
    ...next.configs.recommended,
    plugins: {
      '@next/next': next,
    },
  },
  ...config,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: ['zod', 'vitest-browser-react'],
          patterns: ['**/__mocks__/**'],
        },
      ],
    },
  },
)
