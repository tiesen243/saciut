import jseslint from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['*.config.*'] },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: { import: importPlugin },
    extends: [
      jseslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        { allowConstantLoopConditions: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'import/no-anonymous-default-export': 'warn',
    },
  },
  {
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: { parserOptions: { projectService: true } },
  },
)
