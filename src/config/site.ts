import { SiteConfig, NavItem } from "@/types";

export const siteConfig: SiteConfig = {
  name: "LeadForge OS",
  description: "Real-time B2B sales automation, lead orchestration, and multi-vendor data enrichment engine.",
  url: "https://leadforge.os",
  ogImage: "https://leadforge.os/og.png",
  links: {
    twitter: "https://twitter.com/leadforge_os",
    github: "https://github.com/leadforge-os",
  },
};

export const marketingConfig: { mainNav: NavItem[] } = {
  mainNav: [
    {
      title: "Features",
      href: "/#features",
    },
    {
      title: "Pricing",
      href: "/pricing",
    },
    {
      title: "Docs",
      href: "/docs",
    },
  ],
};
