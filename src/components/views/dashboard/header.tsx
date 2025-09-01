import FlowLogo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { CircleQuestionMarkIcon, BellIcon } from "lucide-react";
import AccountButton from "@/components/views/dashboard/account-button";

export default function DashboardHeader() {
  return (
    <header className="flex items-center justify-between bg-white border-b border-slate-300 px-5 lg:px-10 py-3">
      <FlowLogo className="text-indigo-700 h-8 w-auto" />
      <div className="flex items-center space-x-2">
        {/* TODO: Create docs page and replace linkd */}
        <Button variant="ghost" size="icon" className="text-slate-500 hidden sm:flex">
          <CircleQuestionMarkIcon />
        </Button>
        {/* TODO: Create notifications page and replace link */}
        <Button variant="ghost" size="icon" className="text-slate-500">
          <BellIcon />
        </Button>
        <AccountButton />
      </div>
    </header>
  );
}
