"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ConnectWalletDialog from "@/components/views/homepage/connect-wallet-dialog";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { LoaderIcon, WalletIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AuthPage() {
  const { connected, account, isLoading: loadingWallet } = useWallet();
  const { isAuthenticated, authenticate, loading: loadingAuth } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(!connected);
  const [authChecked, setAuthChecked] = useState(false);

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  const redirectFunc = () => {
    closeDialog();
    redirect("/dashboard");
  };

  const initAuthentication = async () => {
    if (connected && !isAuthenticated && !loadingAuth && !authChecked) {
      try {
        setAuthChecked(true);
        await authenticate();
      } catch (error) {
        console.error("Authentication error:", error);
      }
    }
  };

  useEffect(() => {
    setIsLoading(loadingWallet || loadingAuth);
  }, [loadingWallet, loadingAuth]);

  useEffect(() => {
    initAuthentication();
  }, [connected, isAuthenticated, loadingAuth]);

  useEffect(() => {
    if (connected && account && isAuthenticated) {
      redirect("/dashboard");
    }
  }, [connected, account]);

  return (
    <div className="bg-slate-100 min-h-screen flex justify-center items-center">
      {isLoading && (
        <div className="flex items-center gap-3 text-slate-500 text-xl">
          <LoaderIcon className="size-8 animate-spin" />
          <span className="animate-pulse">Please wait...</span>
        </div>
      )}

      {!isLoading && !connected && !account && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <WalletIcon className="size-5 mr-2" />
              Connect a Wallet
            </Button>
          </DialogTrigger>
          <ConnectWalletDialog close={closeDialog} redirect={redirectFunc} />
        </Dialog>
      )}
    </div>
  );
}
