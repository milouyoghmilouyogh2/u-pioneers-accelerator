import {
  LayoutDashboard,
  Swords,
  Award,
  CreditCard,
  LifeBuoy,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "لوحة القيادة", icon: LayoutDashboard },
  { href: "/dashboard/weapons", label: "مسار الأسلحة", icon: Swords },
  { href: "/dashboard/graduation", label: "التخرج والشهادة", icon: Award },
  { href: "/dashboard/billing", label: "الترقية والدفع", icon: CreditCard },
  { href: "/b2b", label: "الدعم", icon: LifeBuoy },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/admin/users", label: "المستخدمون", icon: Users },
  { href: "/admin/weapons", label: "محتوى الأسلحة", icon: Swords },
  { href: "/admin/payments", label: "طلبات الدفع", icon: CreditCard },
  { href: "/admin/tickets", label: "طلبات الدعم", icon: LifeBuoy },
  { href: "/admin/settings", label: "الإعدادات", icon: Award },
];
