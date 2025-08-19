"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { redirect } from "next/navigation";
import DashboardHeader from "./components/header";
import DashboardFooter from "./components/footer";
import DashboardSidebar from "./components/sidebar";
import { useVendorInfo } from "@/hooks/useVendorInfo";
import { useEffect, useState } from "react";
import LoadingLayout from "./components/loading-layout";
import InitVendor from "./components/init-vendor";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { connected, isLoading: loadingWallet } = useWallet();
  const { loading: loadingVendor, name: vendorName } = useVendorInfo();

  const [isLoading, setIsLoading] = useState(true);
  const [isInit, setIsInit] = useState(false);

  if (!connected && !loadingWallet) {
    redirect("/");
  }

  useEffect(() => {
    setIsLoading(loadingWallet || loadingVendor);
  }, [loadingWallet, loadingVendor]);

  useEffect(() => {
    if (!isLoading && vendorName) {
      setIsInit(true);
    }
  }, [isLoading, vendorName]);

  return (
    <>
      <DashboardHeader />
      <div className="grow lg:grid lg:grid-cols-12 lg:mx-10 lg:gap-10 py-5">
        {isLoading ? (
          <LoadingLayout />
        ) : (
          <>
            <DashboardSidebar className="lg:col-span-3 bg-blue-100" disabled={!isInit} />
            <main className="lg:col-span-9 bg-red-100">{isInit ? children : <InitVendor />}</main>
          </>
        )}
      </div>
      <DashboardFooter />
    </>
  );
}
