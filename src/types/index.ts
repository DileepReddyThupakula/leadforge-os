export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: string;
  label?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
}

export interface DashboardConfig {
  mainNav: NavItem[];
  sidebarNav: SidebarNavItem[];
}

export interface SidebarNavItem extends NavItem {
  items?: NavItem[];
}

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code: string; validationErrors?: Record<string, string[]> };

export interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  uptime: number;
  services: {
    database: "connected" | "disconnected";
    cache: "connected" | "disconnected";
  };
}
