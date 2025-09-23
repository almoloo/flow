import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import Link from "next/link";

interface DashboardFooterProps {
  homepage?: boolean;
}

export default function DashboardFooter({ homepage }: DashboardFooterProps) {
  return (
    <footer
      className={`${homepage ? "pt-3" : "bg-white border-t border-slate-300 px-5 lg:px-10 py-3"} flex items-center justify-between print:hidden`}
    >
      <p className="font-mono text-xs flex items-center gap-2 text-indigo-300">
        <svg className="w-5 h-5 shrink-0 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M7 3H5v4h2V3zm4 0H9v4h2V3zm2 0h2v4h-2V3zm8 6H3v12h14v-5h4V9zm-2 5h-2v-3h2v3zM5 11h10v8H5v-8z"
            fill="currentColor"
          />
        </svg>
        <span>Created with love, care & lots of caffeine.</span>
      </p>
      <div>
        <Button variant={homepage ? "ghost" : "outline"} size="icon" asChild>
          <Link href="https://github.com/almoloo/flow" target="_blank">
            <GithubIcon />
          </Link>
        </Button>
      </div>
    </footer>
  );
}
