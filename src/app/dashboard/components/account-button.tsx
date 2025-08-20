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
import { AvatarImage } from "@radix-ui/react-avatar";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ChevronDownIcon, LoaderIcon, LogOutIcon, UserPenIcon } from "lucide-react";
import Link from "next/link";

export default function AccountButton() {
  const { disconnect } = useWallet();
  const { address, loading, name, balance, avatar } = useVendorInfo();

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
        <DropdownMenuContent className="min-w-[200px]">
          <DropdownMenuLabel className="flex items-center space-x-2">
            <Avatar className="rounded-lg">
              <AvatarImage src={avatar ?? ""} alt="Vendor Avatar" />
              <AvatarFallback>{name?.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <strong className="font-semibold text-sm">{name ?? address}</strong>
              <small className="font-mono font-normal text-slate-500">{balance ?? "0"} USDT</small>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* TODO: Create edit profle page */}
          <DropdownMenuItem asChild>
            <Link passHref href="/profile" className="cursor-pointer">
              <UserPenIcon className="size-5 mr-2" />
              Edit Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-rose-500" onSelect={disconnect}>
            <LogOutIcon className="size-5 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
