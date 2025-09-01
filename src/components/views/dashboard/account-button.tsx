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
import { formatAddress, generateImageUrl } from "@/lib/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ChevronDownIcon, LoaderIcon, LogOutIcon, UserPenIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AccountButton() {
  const { disconnect, account, isLoading: isLoadingAccount } = useWallet();
  const { loading: isLoadingVendor, vendor } = useVendorInfo();

  const [vendorName, setVendorName] = useState<string>("");
  const [vendorAddress, setVendorAddress] = useState<string>("");
  const [vendorAvatar, setVendorAvatar] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(isLoadingAccount || isLoadingVendor);

  useEffect(() => {
    setIsLoading(isLoadingAccount || isLoadingVendor);
  }, [isLoadingAccount, isLoadingVendor]);

  useEffect(() => {
    if (vendor) {
      setVendorName(vendor.name);
      setVendorAddress(vendor.address);
      setVendorAvatar(vendor.avatar!);
    } else {
      setVendorName("?!");
      setVendorAddress(account?.address.toString() ?? "");
      setVendorAvatar(generateImageUrl(account?.address.toString() ?? "?!", "vendor"));
    }
  }, [vendor]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={isLoading ? "secondary" : "outline"}>
            {isLoading ? (
              <LoaderIcon className="size-4 animate-spin text-slate-500" />
            ) : (
              <>
                <span className="sm:hidden">Account</span>
                <span className="hidden sm:inline-flex sm:space-x-2 sm:items-center">
                  {formatAddress(vendorAddress)}
                </span>
                <ChevronDownIcon className="size-4 ml-2" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[200px]">
          <DropdownMenuLabel className="flex items-center space-x-2">
            <Avatar className="rounded-lg">
              <AvatarImage src={vendorAvatar} alt="Vendor Avatar" />
              <AvatarFallback>{vendorName}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <strong className="font-semibold text-sm">{vendorName}</strong>
              <small className="font-mono font-normal text-slate-500">{vendor?.balance ?? "0"} USDT</small>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link passHref href="/dashboard/profile" className="cursor-pointer">
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
