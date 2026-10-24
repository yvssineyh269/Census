import {
  BanknoteArrowDown,
  ChartBarIcon,
  CircleHelpIcon,
  FileChartColumnIcon,
  FileIcon,
  FilePlusIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  ListIcon,
  PackagePlusIcon,
  Settings,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { ROLE_HOME, type Role } from "./roles";

// Remplacé par le tableau de bord du rôle connecté (ROLE_HOME) dans filterMenuByRole
export const DASHBOARD_URL = "/dashboard";

export type MenuItem = {
  title: string;
  url: string;
  icon: typeof LayoutDashboardIcon;
  visibleBy: Role[];
};

export const menu = {
  navMain: [
    {
      title: "Tableau de bord",
      url: DASHBOARD_URL,
      icon: LayoutDashboardIcon,
      visibleBy: ["admin", "saleperson", "assistant", "accountant", "manager"] as Role[],
    },
    {
      title: "Inventaire",
      url: "/pages/inventory",
      icon: ListIcon,
      visibleBy: ["admin", "assistant", "manager"] as Role[],
    },
    {
      title: "Analyse",
      url: "#",
      icon: ChartBarIcon,
      visibleBy: ["admin", "saleperson", "assistant", "accountant", "manager"] as Role[],
    },
    {
      title: "Historique",
      url: "/pages/historic",
      icon: HistoryIcon,
      visibleBy: ["admin", "accountant", "manager"] as Role[],
    },
    {
      title: "Personnels",
      url: "/pages/personnals",
      icon: UsersIcon,
      visibleBy: ["admin", "manager", "accountant"] as Role[],
    },
  ],

  navSecondary: [
    {
      title: "Paramètres",
      url: "/settings",
      icon: Settings,
      visibleBy: ["admin", "saleperson", "assistant", "accountant", "manager"] as Role[],
    },
    {
      title: "Help",
      url: "/help",
      icon: CircleHelpIcon,
      visibleBy: ["admin", "saleperson", "assistant", "accountant", "manager"] as Role[],
    },
  ],

  documents: [
    {
      title: "Rapports",
      url: "/repports",
      icon: FileChartColumnIcon,
      visibleBy: ["admin", "saleperson", "assistant", "accountant", "manager"] as Role[],
    },
    {
      title: "Assistance",
      url: "/assistance",
      icon: FileIcon,
      visibleBy: ["admin", "saleperson", "assistant", "accountant", "manager"] as Role[],
    },
    {
      title: "Crédit et dépenses",
      url: "/assistance",
      icon: BanknoteArrowDown,
      visibleBy: ["admin", "accountant", "manager"] as Role[],
    },
  ],

  // Menu "Ajout rapide" de la sidebar
  quickAdd: [
    {
      title: "Nouvelle clause",
      url: "/saleperson/dashboard?clause=1",
      icon: FilePlusIcon,
      visibleBy: ["saleperson"] as Role[],
    },
    {
      title: "Nouveau produit",
      url: "/pages/inventory/add",
      icon: PackagePlusIcon,
      visibleBy: ["admin", "assistant", "manager"] as Role[],
    },
    {
      title: "Nouvel utilisateur",
      url: "/pages/personnals/add",
      icon: UserPlusIcon,
      visibleBy: ["admin"] as Role[],
    },
  ],
} satisfies {
  quickAdd: MenuItem[];
  navMain: MenuItem[];
  navSecondary: MenuItem[];
  documents: MenuItem[];
};

export function filterMenuByRole<T extends { url: string; visibleBy: Role[] }>(
  items: T[],
  role: Role | null,
): T[] {
  if (!role) {
    return [];
  }

  return items
    .filter((item) => item.visibleBy.includes(role))
    .map((item) =>
      item.url === DASHBOARD_URL ? { ...item, url: ROLE_HOME[role] } : item,
    );
}