import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface StatusButtonProps {
  status: "initial" | "success" | "failed";
  callbackUrl: string | null;
}

export default function StatusButton({ status, callbackUrl }: StatusButtonProps) {
  const [remainingTime, setRemainingTime] = useState(10); // 10 seconds countdown
  const router = useRouter();

  useEffect(() => {
    if (status === "success" && callbackUrl) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push(callbackUrl);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // Cleanup on unmount
    }
  }, [status]);
  return (
    <div className="flex flex-col gap-3">
      {status === "success" ? (
        <>
          <div className="bg-slate-50 border border-rose-100 p-2 rounded-lg text-center space-y-1">
            <span className="text-rose-800 font-medium text-sm">Do not close this tab!</span>
            <p className="text-slate-500 text-xs">
              To complete this transaction, wait for the timer to run out or click on the button below.
            </p>
          </div>
          <Button variant="green" size="lg" asChild>
            <Link href={callbackUrl || "#"}>Complete Transaction ({remainingTime})</Link>
          </Button>
        </>
      ) : status === "failed" ? (
        <>
          <div className="bg-rose-50 border border-rose-100 p-3 rounded-lg text-center space-y-1">
            <span className="text-rose-800 font-medium">Transaction Failed</span>
            <p className="text-slate-500 text-sm">Something went wrong during the payment process. Please try again.</p>
          </div>
          <Button variant="destructive" size="lg" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </>
      ) : null}
    </div>
  );
}
