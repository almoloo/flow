import FlowLogo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { CircleQuestionMarkIcon, BellIcon } from "lucide-react";
import AccountButton from "@/components/views/dashboard/account-button";
import Link from "next/link";

interface DashboardHeaderProps {
  unreadNotifications?: boolean;
}

export default function DashboardHeader({ unreadNotifications }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between bg-white border-b border-slate-300 px-5 lg:px-10 py-3">
      <Link href="/dashboard">
        <FlowLogo className="text-indigo-700 h-8 w-auto" />
      </Link>
      <div className="flex items-center space-x-2 print:hidden">
        {/* TODO: Create docs page and replace linkd */}
        <Button variant="ghost" size="icon" className="text-slate-500 hidden sm:flex">
          <CircleQuestionMarkIcon />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`relative ${unreadNotifications ? "text-red-500" : "text-slate-500"}`}
          asChild
        >
          <Link href="/dashboard/notifications">
            <BellIcon />
            {unreadNotifications && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />}
          </Link>
        </Button>
        <AccountButton />
      </div>
    </header>
  );
}
