import { Banknote, BanknoteArrowDown, ChartBarIcon, CircleHelpIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, FolderIcon, HistoryIcon, LayoutDashboardIcon, ListIcon, Outdent, SearchIcon, Settings, Settings2Icon, UsersIcon } from "lucide-react";

export const menu = {

  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Tableau de bord",
      url: "/",
      icon: LayoutDashboardIcon
    },
    {
      title: "Inventaire",
      url: "/inventory",
      icon: ListIcon
    },
    {
      title: "Analyse",
      url: "#",
      icon: ChartBarIcon
       
    },
    {
      title: "Historique",
      url: "/historic",
      icon: HistoryIcon
       
    },
    {
      title: "Personnels",
      url: "/personals",
      icon: UsersIcon
        
    },
  ],


  navSecondary: [
    {
      title: "Paramètres",
      url: "/settings",
      icon: Settings
        
    },
    {
      title: "Help",
      url: "/help",
      icon: CircleHelpIcon
        
    },
  ],


  documents: [
  
    {
      title: "Rapports",
      url: "/repports",
      icon: FileChartColumnIcon
        
    },
    {
      title: "Assistance",
      url: "/assistance",
      icon: FileIcon
        
    },

    {
        title: "Crédit et dépenses",
        url: "/assistance",
        icon: BanknoteArrowDown
          
      },
  ],
}