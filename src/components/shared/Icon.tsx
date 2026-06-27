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
  Search,
  Plus,
  Trash,
  Archive,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  Activity,
  Building,
  User,
  Phone,
  ArrowLeft,
  RefreshCw,
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
  Search,
  Plus,
  Trash,
  Archive,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  Activity,
  Building,
  User,
  Phone,
  ArrowLeft,
  RefreshCw,
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
