import {
  BanknoteArrowDown,
  ChartBarIcon,
  CircleHelpIcon,
  FileChartColumnIcon,
  FileIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  ListIcon,
  Settings,
  UsersIcon,
} from "lucide-react";
import type { Role } from "./roles";

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
      url: "/",
      icon: LayoutDashboardIcon,
      visibleBy: ["admin", "saleperson", "assistant", "accountant", "manager"] as Role[],
    },
    {
      title: "Inventaire",
      url: "/inventory",
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
      url: "/historic",
      icon: HistoryIcon,
      visibleBy: ["admin", "assistant", "accountant", "manager"] as Role[],
    },
    {
      title: "Personnels",
      url: "/personals",
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
      visibleBy: ["admin", "saleperson", "assistant", "accountant", "manager"] as Role[],
    },
  ],
} satisfies {
  navMain: MenuItem[];
  navSecondary: MenuItem[];
  documents: MenuItem[];
};

export function filterMenuByRole<T extends { visibleBy: Role[] }>(
  items: T[],
  role: Role | null,
): T[] {
  if (!role) {
    return [];
  }

  return items.filter((item) => item.visibleBy.includes(role));
}