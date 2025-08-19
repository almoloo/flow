import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  BanknoteArrowDownIcon,
  BanknoteArrowUpIcon,
  BotMessageSquareIcon,
  ChevronRightIcon,
  CircleUserIcon,
  HashIcon,
  LayoutDashboardIcon,
  MenuIcon,
  QrCodeIcon,
  ReceiptIcon,
} from "lucide-react";
import Link from "next/link";

interface DashboardSidebarProps {
  className?: string;
  disabled?: boolean;
  path: string;
}

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboardIcon /> },
  { label: "Gateways", href: "/dashboard/gateways", icon: <QrCodeIcon /> },
  { label: "Transactions", href: "/dashboard/transactions", icon: <BanknoteArrowDownIcon /> },
  { label: "Withdrawals", href: "/dashboard/withdrawals", icon: <BanknoteArrowUpIcon /> },
  { label: "Customers", href: "/dashboard/customers", icon: <CircleUserIcon /> },
  { label: "Invoices", href: "/dashboard/invoices", icon: <ReceiptIcon /> },
  { label: "Short Links", href: "/dashboard/short-links", icon: <HashIcon /> },
  { label: "Support Agent", href: "/dashboard/support-agent", icon: <BotMessageSquareIcon /> },
];

function MenuItem({ item, path, disabled }: { item: (typeof menuItems)[number]; path: string; disabled?: boolean }) {
  const isActive = path === item.href || (item.href !== "/dashboard" && path.startsWith(item.href + "/"));

  return (
    <Link href={disabled ? "" : item.href} passHref aria-disabled={disabled}>
      <Button className="w-full justify-start space-x-2" variant={isActive ? "secondary" : "ghost"} disabled={disabled}>
        {item.icon}
        <span className="text-sm font-medium">{item.label}</span>
        {isActive && (
          <div className="grow flex items-center justify-end">
            <ChevronRightIcon className="size-4" />
          </div>
        )}
      </Button>
    </Link>
  );
}

function Menu({ items, path, disabled }: { items: typeof menuItems; path: string; disabled?: boolean }) {
  return (
    <div className="flex flex-col space-y-1">
      {items.map((item) => (
        <MenuItem key={item.label} item={item} path={path} disabled={disabled} />
      ))}
    </div>
  );
}

export default function DashboardSidebar({ className, disabled, path }: DashboardSidebarProps) {
  return (
    <aside className={`${className}`}>
      <div className="hidden lg:block">
        <Menu items={menuItems} path={path} disabled={disabled} />
      </div>
      <div className="lg:hidden border rounded-lg">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button className="w-full" variant="ghost">
              <MenuIcon />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-2">
            <Menu items={menuItems} path={path} disabled={disabled} />
          </CollapsibleContent>
        </Collapsible>
      </div>
    </aside>
  );
}
