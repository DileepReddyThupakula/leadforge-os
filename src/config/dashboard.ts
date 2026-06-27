import { DashboardConfig } from "@/types";

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Help & Documentation",
      href: "/docs",
    },
    {
      title: "Support",
      href: "/support",
    },
  ],
  sidebarNav: [
    {
      title: "Overview",
      href: "/dashboard",
      icon: "LayoutDashboard",
    },
    {
      title: "Leads Orchestrator",
      href: "/dashboard/leads",
      icon: "Users",
    },
    {
      title: "Data Enrichment",
      href: "/dashboard/enrichment",
      icon: "Cpu",
    },
    {
      title: "Outreach Sequences",
      href: "/dashboard/sequences",
      icon: "Mail",
    },
    {
      title: "Integrations Hub",
      href: "/dashboard/integrations",
      icon: "Layers",
    },
    {
      title: "Billing & Usage",
      href: "/dashboard/billing",
      icon: "CreditCard",
    },
    {
      title: "Workspace Settings",
      href: "/dashboard/settings",
      icon: "Settings",
    },
  ],
};
