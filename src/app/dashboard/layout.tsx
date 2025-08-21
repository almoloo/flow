"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { redirect, usePathname } from "next/navigation";
import DashboardHeader from "./components/header";
import DashboardFooter from "./components/footer";
import DashboardSidebar from "./components/sidebar";
import { useVendorInfo } from "@/hooks/useVendorInfo";
import { useEffect, useState } from "react";
import LoadingLayout from "./components/loading-layout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { connected, isLoading: loadingWallet } = useWallet();
  const { loading: loadingVendor, name: vendorName } = useVendorInfo();
  const currentPath = usePathname();

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
    } else if (!isLoading && !vendorName && currentPath !== "/dashboard/profile") {
      redirect("/dashboard/profile");
    }
  }, [isLoading, vendorName]);

  return (
    <>
      <DashboardHeader />
      <div className="grow flex flex-col lg:grid lg:grid-cols-12 mx-5 lg:mx-10 gap-5 lg:gap-10 py-5">
        {isLoading ? (
          <LoadingLayout />
        ) : (
          <>
            <DashboardSidebar className="lg:col-span-3" disabled={!isInit} path={currentPath} />
            <main className="lg:col-span-9">{children}</main>
          </>
        )}
      </div>
      <DashboardFooter />
    </>
  );
}
