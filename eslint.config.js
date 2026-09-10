import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Nos composants protégés sont exportés enveloppés dans un HOC :
      // le plugin doit les reconnaître comme des composants.
      'react-refresh/only-export-components': [
        'error',
        { allowConstantExport: true, extraHOCs: ['withAuth', 'withPermissions'] },
      ],
    },
  },
  {
    // Fichiers qui n'exportent volontairement pas de composant :
    // configuration de routes et utilitaires de test.
    files: [
      '**/*.test.{ts,tsx}',
      'src/test/**/*.{ts,tsx}',
      'src/app/router.tsx',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
