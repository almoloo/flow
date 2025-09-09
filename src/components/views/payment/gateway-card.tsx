import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { generateImageUrl } from "@/lib/utils";
import { Gateway } from "@/types";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

interface GatewayCardProps {
  gateway: Gateway;
  address: string;
  mode?: "vertical" | "horizontal";
}

export default function GatewayCard({ gateway, mode = "vertical", address }: GatewayCardProps) {
  return (
    <div className={`gateway-card flex items-center gap-3 ${mode === "vertical" ? "flex-col" : "flex-row"}`}>
      <Avatar className={`${mode === "vertical" ? "w-20 h-20" : "w-12 h-12"}`}>
        <AvatarImage src={generateImageUrl(address, "gateway", gateway.gatewayId)} alt={gateway.title} />
        <AvatarFallback>{gateway.title.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className={`flex flex-col space-y-2 ${mode === "vertical" ? "items-center" : "items-start"}`}>
        <h3 className="font-semibold text-sm">{gateway.title}</h3>
        <Button variant="link" size="sm" className="text-indigo-500 text-xs h-auto p-0" asChild>
          <Link href={gateway.url} target="_blank">
            <ExternalLinkIcon className="size-3" />
            {gateway.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
