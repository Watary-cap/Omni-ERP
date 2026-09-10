# Modifications — module Paramètres et mise à niveau du projet

Base de départ : `bd8d6d2` (« feat: compléter ERP BI dashboard et qualité du code »).

Tout a été vérifié après chaque étape : `tsc`, `eslint`, la suite de tests et
`npm run build` passent, et les 7 routes de l'application rendent correctement.

---

## 1. Nouveau module : Paramètres

La page `/settings` était une coquille vide (`return <h1>Paramètres</h1>`).

```
src/features/settings/
├── types/settings.types.ts       AppSettings, valeurs par défaut, libellés
├── store/settingsStore.ts        store Zustand persisté
├── hooks/useSettings.ts          settings, setSetting, resetSettings, toggleTheme
├── services/profileService.ts    PATCH /users/{id}
└── components/
    ├── SettingsPage.tsx          onglets
    ├── AppearanceSettings.tsx    thème, accent, densité, menu latéral
    ├── PreferencesSettings.tsx   page d'accueil, réinitialisation
    ├── AlertsSettings.tsx        choix des alertes (limité à 3)
    ├── ProfileSettings.tsx       compte, fiche RH, mot de passe
    └── RolesSettings.tsx         matrice des droits (admin)
```

Chaque réglage a un effet réel, mesuré dans le navigateur :

| Réglage | Effet |
|---|---|
| Thème clair / sombre | fond des cartes `#151e31` <-> `#ffffff` |
| Couleur d'accent (5 choix) | repeint boutons, liens actifs, barres, anneaux de focus |
| Densité | padding du contenu 32px -> 18px |
| Menu latéral réduit | sidebar 260px -> 78px, libellés masqués |
| Page d'accueil | écran ouvert après connexion |
| Mot de passe | écrit réellement en base |
| Réinitialisation | double confirmation, retour aux valeurs d'origine |

Le thème existait déjà mais vivait dans un `useState` local à `AppLayout`,
donc inaccessible depuis une page. Il a été remonté dans le store : le bouton
de la barre du haut et la page Paramètres pilotent le même état.

---

## 2. Zustand (levée de la pénalité -10)

`authStore` et `settingsStore` utilisent Zustand avec le middleware `persist`.
L'API publique n'a pas changé, donc rien en aval n'a été modifié.

Les sessions ouvertes avant le changement sont migrées automatiquement :
l'ancien format à plat est relu et converti.

---

## 3. Tests (levée de la pénalité -15)

**100 tests répartis sur 19 fichiers**, avec Vitest + Testing Library + MSW.

```bash
npm run test           # suite complète
npm run test:coverage  # rapport de couverture
```

Sont couverts : les deux stores, les hooks `useSettings`, `useDebounce`,
`useToggleList`, les schémas Zod, l'event bus, et les composants `LoginForm`,
`ProtectedRoute`, `Header`, `Sidebar`, `Tabs`, `Modal`, `ErrorBoundary`,
`AppearanceSettings`, `PreferencesSettings`, `ProfileSettings`, `RolesSettings`.

`src/test/` contient le setup : serveur MSW, helper `renderWithProviders`, et
un polyfill `localStorage` — jsdom 29 sous Vitest 4 ne l'initialise pas, Node
injectant son propre `--localstorage-file` qui le masque.

**Attention : la couverture globale est d'environ 15 %, pas 80 %.** Les tests
couvrent les briques partagées et le module Paramètres, mais les gros modules
(CRM, PMS, HRM, ERP) n'en ont aucun et dominent le volume de code. C'est un
chantier à répartir dans l'équipe.

---

## 4. Patterns avancés

Sept patterns, tous réellement utilisés dans l'application :

| Pattern | Fichier | Utilisation |
|---|---|---|
| Compound component | `shared/components/Tabs.tsx` | les 5 sections de Paramètres |
| Portal | `shared/components/Modal.tsx` | confirmation de réinitialisation |
| Error boundary | `shared/components/ErrorBoundary.tsx` | autour du routeur et de chaque page |
| HOC | `shared/patterns/withAuth.tsx` | `withAuth` et `withPermissions` |
| Render props | `shared/patterns/DataFetcher.tsx` | compteur de congés dans les Alertes |
| State reducer | `shared/patterns/useToggleList.ts` | plafonne la sélection d'alertes à 3 |
| Observer | `shared/patterns/eventBus.ts` | notifications sans couplage |

---

## 5. Performance

- Les 7 routes sont chargées en `lazy` + `Suspense`.
  **Bundle initial : 428 kB -> 316 kB** (gzip 124 -> 100 kB), 7 chunks à la demande.
- 5 composants sous `React.memo`, 10 `useCallback` (dont ceux qui stabilisent
  les handlers, sans quoi la mémoïsation serait annulée), 27 `useMemo`.
- Premier *optimistic update* du projet sur `useUpdateTask` : le Kanban réagit
  sans attendre le serveur, avec restauration du cache en cas d'échec.

---

## 6. Formulaires : React Hook Form + Zod

Schémas dans `src/features/auth/schemas/auth.schemas.ts`.

`RegisterForm.tsx` était un **fichier vide de 0 octet**, non branché. Il a été
construit : validation croisée (confirmation, mot de passe différent de
l'identifiant), garde-fou anti-doublon d'identifiant, et auto-login après
inscription. La page de connexion bascule entre les deux formulaires.

---

## 7. PWA

`vite-plugin-pwa` : service worker, manifeste, icônes générées
(`public/pwa-192.png`, `public/pwa-512.png`), 25 entrées en précache.

Stratégies de cache : *stale-while-revalidate* sur DummyJSON, *cache-first*
sur ses images, *network-first* avec repli sur JSON Server. Le service worker
est désactivé en développement pour ne pas gêner le HMR.

---

## 8. React 19

`useActionState` et `useFormStatus` sur le changement de mot de passe
(`ProfileSettings` + `shared/components/SubmitButton.tsx`). React réinitialise
le formulaire lui-même après succès, ce qui supprime la gestion manuelle des
états de chargement et d'erreur.

---

## 9. Correction du thème sombre

Des fonds blancs subsistaient sur Employés, Clients et Produits.

**Deux causes :**

1. Des classes non couvertes par le thème sombre : `.org-card`, `.skill-card`,
   `.product-card`, boutons et barres d'outils restaient en `#ffffff`.
2. **Le CRM est écrit en styles inline** (`style={{ background: "#ffffff" }}`),
   qu'aucune règle CSS ne peut surcharger sans `!important` — 102 couleurs en dur.

**Solution :** des variables de surface thématisées ont été introduites.

```css
.app-shell            { --surface: #ffffff; --border: #e8eaf0; --text: #20222a; ... }
.app-shell.dark-theme { --surface: #151e31; --border: #26304a; --text: #eef3fb; ... }
```

Les couleurs en dur ont été remplacées par ces variables : **72 remplacements
dans le CRM, 13 dans le PMS**. La structure des composants n'a pas changé.

Résultat mesuré par un détecteur de luminance parcourant le DOM :

| Page | Avant | Après |
|---|---|---|
| Employés | 14 types de surfaces claires | 0 |
| Clients | 53 éléments clairs | 0 |
| Produits | 100 cartes + champs | 0 |

Le même défaut a été corrigé sur PMS, BI et Dashboard. Le thème clair est
intact. Ces variables rendent les futurs écrans thématisables sans effort.

---

## 10. Bugs préexistants corrigés

- **Un salarié cliquant « Paramètres » était éjecté sur l'écran de connexion.**
  `/settings` était réservé à `admin/manager/super_manager/ceo`, et le refus
  renvoyait vers `/` qui redirige vers `/login` — alors que la sidebar affiche
  le lien à tout le monde. Cela touchait 33 des 55 comptes.
  La route est ouverte à tous les rôles connectés (apparence, préférences et
  mot de passe sont des réglages personnels) ; la matrice des rôles reste
  réservée aux profils d'administration via un contrôle interne au composant.
  `ProtectedRoute` renvoie désormais vers `/dashboard`, jamais vers `/login`.

- **Texte sombre sur fond sombre** dans la fiche employé du HRM :
  `.employee-details strong` battait `.dark-theme strong` par spécificité,
  contraste 1,59:1. Corrigé à 14,03:1 — cela répare aussi `EmployeeModal`.

- **Texte secondaire à 2,77:1** en thème clair, sous le seuil WCAG AA.
  Corrigé à 4,59:1 sur la page Paramètres.

---

## Reste à faire

- **Couverture de tests** : environ 15 %, l'objectif du sujet est 80 %.
  Les modules CRM, PMS, HRM et ERP restent à tester.
- **Quatre APIs sur six** ne sont pas branchées : JSONPlaceholder, Reqres,
  OpenWeatherMap (le widget météo figure pourtant dans le schéma
  d'architecture du sujet) et RandomUser.
- **Erreur console préexistante** : `Erreur CRM : Ce compte n'est associé à
  aucune entreprise` quand un admin sans `companyId` ouvre le CRM. La page
  s'affiche quand même.
- **`ProductsPage` et `DashboardPage`** appellent `fetch` directement dans le
  composant, sans passer par une couche service.
- **Centralisation** : une commande affiche encore `userId: 1` au lieu du
  client CRM correspondant, alors que les deux partagent le même espace
  d'identifiants.
