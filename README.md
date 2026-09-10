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

## Architecture

Découpage **feature-based** : chaque domaine métier est autonome et expose la
même structure.

```
src/
├── app/            App, router (routes chargées en lazy)
├── features/
│   ├── auth/       schemas Zod, store Zustand, services, ProtectedRoute
│   ├── dashboard/  agrégation des indicateurs
│   ├── pms/        projets, tâches, Kanban
│   ├── hrm/        employés, congés, organigramme
│   ├── crm/        entreprises, équipes, clients
│   ├── erp/        catalogue DummyJSON
│   ├── bi/         analytics
│   └── settings/   apparence, préférences, alertes, profil, rôles
└── shared/
    ├── components/ AppLayout, Header, Sidebar, Tabs, Modal, ErrorBoundary…
    ├── hooks/      useDebounce, useNotifications
    └── patterns/   withAuth, DataFetcher, useToggleList, eventBus
```

Chaque `feature/` suit le même empilement : `types/` → `services/` (appels
réseau) → `hooks/` (React Query, état) → `components/` (rendu). Aucun
composant n'appelle `fetch` directement, sauf deux écrans hérités
(`erp/ProductsPage`, `dashboard/DashboardPage`) qui restent à aligner.

### Choix techniques

| Besoin | Choix | Raison |
|---|---|---|
| État global | **Zustand** + middleware `persist` | Session et préférences survivent au rechargement, sans provider à câbler |
| Données serveur | **React Query** | Cache, invalidation et *optimistic updates* (voir `useUpdateTask`) |
| Formulaires | **React Hook Form + Zod** | Un schéma unique valide le formulaire et type les données |
| Tests | **Vitest + Testing Library + MSW** | Le réseau est simulé, aucun test ne sort du process |
| Hors ligne | **vite-plugin-pwa** | Service worker, manifeste et cache des données distantes |

### Patterns mis en œuvre

- **Compound component** — `shared/components/Tabs.tsx`, état partagé par contexte, utilisé par la page Paramètres.
- **Portal** — `shared/components/Modal.tsx`, rendu hors du flux, fermeture Échap, défilement gelé.
- **Error boundary** — `shared/components/ErrorBoundary.tsx`, autour du routeur et de chaque page.
- **HOC** — `shared/patterns/withAuth.tsx` : `withAuth` et `withPermissions`.
- **Render props** — `shared/patterns/DataFetcher.tsx`.
- **State reducer** — `shared/patterns/useToggleList.ts`, l'appelant peut plafonner la sélection.
- **Observer** — `shared/patterns/eventBus.ts` + `useNotifications`.

### Performance

Routes en `lazy` + `Suspense` : le bundle initial ne contient pas les modules
métier. `React.memo` sur les composants de liste, `useCallback` pour stabiliser
les handlers qui les alimentent, `useMemo` sur les calculs dérivés.

## Vérification

```bash
npm run build          # typecheck + bundle + service worker
npm run lint           # ESLint, zéro avertissement toléré
npm run test           # suite Vitest
npm run test:coverage  # rapport de couverture
```

### Tests

`src/test/` contient le setup : polyfill `localStorage` (jsdom 29 ne
l'initialise pas sous Vitest 4), serveur MSW et helper `renderWithProviders`
qui monte React Query et le routeur.

Sont couverts : les deux stores Zustand, les hooks `useSettings`,
`useDebounce`, `useToggleList`, les schémas Zod, l'event bus, et les composants
`LoginForm`, `ProtectedRoute`, `Header`, `Sidebar`, `Tabs`, `Modal`,
`ErrorBoundary`, `AppearanceSettings`, `PreferencesSettings`,
`ProfileSettings`, `RolesSettings`.

## PWA

`npm run build` génère `dist/sw.js`. Le catalogue DummyJSON est mis en cache
en *stale-while-revalidate*, les images en *cache-first*, et JSON Server en
*network-first* avec repli sur le cache. Le service worker est désactivé en
développement pour ne pas gêner le HMR.

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
