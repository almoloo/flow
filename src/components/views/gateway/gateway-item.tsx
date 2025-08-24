import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { generateImageUrl } from "@/lib/utils";
import { Gateway } from "@/types";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

interface GatewayItemProps {
  gateway: Gateway;
  walletAddress: string;
}

export default function GatewayItem({ gateway, walletAddress }: GatewayItemProps) {
  const avatarURL = generateImageUrl(walletAddress, "gateway", gateway.gatewayId);
  return (
    <Link href={`/dashboard/gateways/${gateway.gatewayId}`} className="w-full" passHref>
      <Button
        variant={"outline"}
        size="lg"
        className={`w-full h-auto justify-start items-center space-x-1 px-3 py-2 ${!gateway.active ? "bg-slate-50" : ""}`}
      >
        <Avatar>
          <AvatarImage src={avatarURL} alt={gateway.title} className="w-10 h-10" />
          <AvatarFallback>{gateway.title.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start grow">
          <span className="font-medium">{gateway.title}</span>
          <small className="text-slate-500">{gateway.url}</small>
        </div>
        {gateway.sandbox && <small className="text-emerald-500">[Sandbox]</small>}
        {!gateway.active && <small className="text-rose-400">Disabled</small>}
        <ChevronRightIcon className="size-5 text-slate-500" />
      </Button>
    </Link>
  );
}
