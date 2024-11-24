import ts from 'typescript-eslint'
import next from '@next/eslint-plugin-next'
import config from '@seno-dev/eslint-config'

export default ts.config(
  {
    ignores: ['.next', 'dist', 'public', 'components/ui/snippets'],
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
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
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
