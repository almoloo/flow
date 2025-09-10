"use client";

import { notFound, useSearchParams } from "next/navigation";
import { useGatewayInfo } from "@/hooks/useGatewayInfo";
import { useEffect, useState } from "react";
import GatewayCard from "./gateway-card";

export default function ChatBox() {
  const searchParams = useSearchParams();
  const va = searchParams.get("va");
  const gid = searchParams.get("gid");
  const { gateway, loading, error, done } = useGatewayInfo(va!, gid!);

  const [cardMode] = useState<"horizontal" | "vertical">("vertical");

  useEffect(() => {
    if (error) {
      notFound();
    }
  }, [loading, error, done]);

  return (
    <div>
      {/* ChatBox */}
      {/* <div>
        Vendor Address: {va}, Gateway ID: {gid}
      </div> */}
      <div>{gateway && <GatewayCard gateway={gateway} address={va!} mode={cardMode} />}</div>
    </div>
  );
}
