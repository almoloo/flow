import FlowLogo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { WalletIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface HomepageHeaderProps {
  className?: string;
  homepage?: boolean;
}

export default function HomepageHeader({ homepage, className }: HomepageHeaderProps) {
  return (
    <header className={`flex items-center justify-between ${className}`}>
      <Link href="/">
        <FlowLogo className="h-8 w-auto" />
      </Link>
      <nav className="flex items-center gap-2">
        {homepage && (
          <Button variant="link" size="sm" className="text-white" asChild>
            <Link href="/about">About Us</Link>
          </Button>
        )}
        <Button variant={homepage ? "secondary" : "default"} size="sm" asChild>
          <Link href="/auth">
            <WalletIcon className="mr-2 size-5" />
            Connect Wallet
          </Link>
        </Button>
      </nav>
    </header>
  );
}
