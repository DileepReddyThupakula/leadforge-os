import {
  LayoutDashboard,
  Users,
  Cpu,
  Mail,
  Layers,
  CreditCard,
  Settings,
  HelpCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Check,
  AlertTriangle,
  Info,
  Globe,
  LucideProps
} from "lucide-react";

export const icons = {
  LayoutDashboard,
  Users,
  Cpu,
  Mail,
  Layers,
  CreditCard,
  Settings,
  HelpCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Check,
  AlertTriangle,
  Info,
  Globe,
};

export type IconName = keyof typeof icons;

interface IconProps extends Omit<LucideProps, "ref"> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  const IconComponent = icons[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
}
