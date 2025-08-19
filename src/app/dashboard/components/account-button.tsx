"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useVendorInfo } from "@/hooks/useVendorInfo";
import { formatAddress } from "@/lib/utils";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ChevronDownIcon, LoaderIcon } from "lucide-react";

export default function AccountButton() {
  //   const { account, isLoading } = useWallet();
  const { address, loading, name, balance } = useVendorInfo();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {loading || !address ? (
              <LoaderIcon className="size-4 animate-spin text-slate-500" />
            ) : (
              <>
                <span className="sm:hidden">Account</span>
                <span className="hidden sm:inline-flex sm:space-x-2 sm:items-center">{formatAddress(address!)}</span>
                <ChevronDownIcon className="size-4 ml-2" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <Avatar>
              <AvatarFallback>AA</AvatarFallback>
            </Avatar>
            Hi {name} {parseFloat(balance!) / Math.pow(10, 8)}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>hh</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
