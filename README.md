# Omni-ERP

Application React de gestion d'entreprise organisée par fonctionnalités : PMS,
HRM, CRM, ERP et BI.

## Démarrage

Installer les dépendances puis lancer les deux services dans deux terminaux :

```bash
npm install
npm run server
npm run dev
```

L'application est disponible sur `http://localhost:5173` et JSON Server sur
`http://localhost:3000`.

## Fonctionnalités

- Authentification locale avec rôles `admin`, `manager`, `user`, `super_manager` et `ceo`.
- PMS : projets, tâches, formulaires CRUD et Kanban.
- HRM : employés, congés, présence et organigramme.
- CRM : entreprises, équipes, collaborateurs et clients filtrés par entreprise.
- ERP : catalogue DummyJSON, recherche, catégories, stocks et commandes.
- BI : indicateurs agrégés PMS, HRM et CRM.
- Dashboard central avec données PMS, HRM, CRM et ERP.

## Vérification

```bash
npm run build
npm run lint
```

Les données locales utilisées par JSON Server se trouvent dans `db.json`.

## Comptes de démonstration

Les comptes de test sont définis dans `db.json`. Exemples :

| Rôle | Identifiant | Mot de passe |
| --- | --- | --- |
| Admin | `Mateo` | `admin` |
| Manager | `Sophie` | `manager` |
| Utilisateur | `Julie` | `user` |

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
