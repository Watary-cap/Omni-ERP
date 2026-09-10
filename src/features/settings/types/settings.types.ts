export type ThemeMode = "light" | "dark";

export type Density = "comfortable" | "compact";

export type AccentColor = "indigo" | "violet" | "emerald" | "amber" | "rose";

export type LandingPage =
  | "/dashboard"
  | "/pms"
  | "/hrm"
  | "/crm"
  | "/erp"
  | "/bi";

export type AlertKind = "leaves" | "stock" | "orders" | "projects";

export interface AppSettings {
  theme: ThemeMode;
  accent: AccentColor;
  density: Density;
  collapsedSidebar: boolean;
  landingPage: LandingPage;
  alerts: AlertKind[];
}

/* Au-delà de trois alertes, la barre du haut devient illisible. */
export const MAX_ALERTS = 3;

export const alertLabels: Record<AlertKind, string> = {
  leaves: "Congés en attente",
  stock: "Ruptures de stock",
  orders: "Commandes à traiter",
  projects: "Projets en retard",
};

export const defaultSettings: AppSettings = {
  theme: "dark",
  accent: "indigo",
  density: "comfortable",
  collapsedSidebar: false,
  landingPage: "/dashboard",
  alerts: ["leaves", "stock"],
};

export const accentLabels: Record<AccentColor, string> = {
  indigo: "Indigo",
  violet: "Violet",
  emerald: "Émeraude",
  amber: "Ambre",
  rose: "Rose",
};

export const densityLabels: Record<Density, string> = {
  comfortable: "Confortable",
  compact: "Compact",
};

export const landingPageLabels: Record<LandingPage, string> = {
  "/dashboard": "Dashboard",
  "/pms": "Projets",
  "/hrm": "Employés",
  "/crm": "Clients",
  "/erp": "Produits",
  "/bi": "Analytics",
};
