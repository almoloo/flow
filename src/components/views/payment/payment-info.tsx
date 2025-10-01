import { Button } from "@/components/ui/button";
import { NETWORK } from "@/constants";
import { formatAddress } from "@/lib/utils";
import { Token } from "@/types";
import { BadgeCheckIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

interface PaymentInfoProps {
  amount?: number; // IN USDT
  sourceAmount?: number; // IN TARGET TOKEN
  sourceToken?: Token;
  reward?: number;
  fee?: number;
  txid?: string;
  status?: "initial" | "success" | "failed";
}

function InfoItem(props: { title?: string; value: string; isTx?: boolean }) {
  return (
    <div className="flex items-center gap-5 my-2">
      {props.title && <span className="text-slate-500 font-medium">{props.title}</span>}
      <span className="border-b border-slate-300 border-dashed grow"></span>
      <span className="font-medium">
        {props.isTx ? (
          <>
            <Button variant="link" className="text-base h-auto p-0" asChild>
              <Link
                href={`https://explorer.aptoslabs.com/txn/${props.value}/${NETWORK === "testnet" ? "?network=testnet" : "?network=mainnet"}`}
                target="_blank"
              >
                {formatAddress(props.value)} <ExternalLinkIcon className="size-4 ml-1" />
              </Link>
            </Button>
          </>
        ) : (
          props.value
        )}
      </span>
    </div>
  );
}

function InfoHeader(props: { status: "initial" | "success" | "failed"; amount?: number }) {
  if (props.status === "initial") {
    return <div className="text-lg font-bold text-center">Payment Information</div>;
  } else if (props.status === "success") {
    return (
      <div className="flex flex-col items-center gap-2">
        <BadgeCheckIcon className="text-emerald-500 size-10 stroke-1" />
        <span className="text-lg font-bold text-center text-emerald-500">Successful Transaction</span>
        <p className="text-slate-500">Your payment of {props.amount} USDT has been processed successfully.</p>
      </div>
    );
  } else {
    return <div className="text-lg font-bold text-center text-red-600">Payment Failed</div>;
  }
}

export default function PaymentInfo(props: PaymentInfoProps) {
  return (
    <div className="mb-auto">
      <InfoHeader status={props.status || "initial"} amount={props.amount} />
      <div className="my-7 border-y border-slate-300 py-5">
        {props.amount && <InfoItem title="Amount" value={`${props.amount} USDT`} />}
        {props.sourceAmount && props.sourceToken && (
          <InfoItem value={`${props.sourceAmount}  ${props.sourceToken.symbol}`} />
        )}
        {props.reward && <InfoItem title="Reward" value={`${props.reward} Points`} />}
        {props.fee && <InfoItem title="Swap Fee" value={`${props.fee} APT`} />}
        {props.txid && <InfoItem title="TXID" value={props.txid} isTx />}
      </div>
    </div>
  );
}
