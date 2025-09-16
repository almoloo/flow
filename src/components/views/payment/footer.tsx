import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import Link from "next/link";

export default function PaymentFooter() {
  return (
    <footer className="p-10 flex justify-between items-center">
      <p className="flex items-end space-x-1">
        <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-auto text-indigo-200">
          <path
            d="M7 3H5v4h2V3zm4 0H9v4h2V3zm2 0h2v4h-2V3zm8 6H3v12h14v-5h4V9zm-2 5h-2v-3h2v3zM5 11h10v8H5v-8z"
            fill="currentColor"
          />
        </svg>
        <span className="text-xs font-mono text-indigo-100">Created with love, care & lots of caffeine.</span>
      </p>
      <Button variant="secondary" size="icon" className="size-8" asChild>
        <Link href="https://github.com/almoloo/flow" target="_blank">
          <GithubIcon className="size-4" />
        </Link>
      </Button>
    </footer>
  );
}
