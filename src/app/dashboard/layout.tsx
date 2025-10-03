"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { redirect, usePathname } from "next/navigation";
import DashboardHeader from "@/components/views/dashboard/header";
import DashboardFooter from "@/components/views/dashboard/footer";
import DashboardSidebar from "@/components/views/dashboard/sidebar";
import { useVendorInfo } from "@/hooks/useVendorInfo";
import { useEffect, useState } from "react";
import LoadingLayout from "@/components/views/dashboard/loading-layout";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { FingerprintIcon } from "lucide-react";
import { authenticatedGet } from "@/lib/authenticatedFetch";
import { Notification } from "@/types";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { connected, isLoading: loadingWallet, account } = useWallet();
  const { isAuthenticated, authenticate, loading: loadingAuth } = useAuth();
  const { loading: loadingVendor, vendor, done: vendorDone } = useVendorInfo();
  const currentPath = usePathname();

  const [isLoading, setIsLoading] = useState(true);
  const [isInit, setIsInit] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(false);

  if (!connected && !loadingWallet) {
    redirect("/");
  }

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
    setIsLoading(loadingWallet || loadingVendor || !vendorDone || loadingAuth);
  }, [loadingWallet, loadingVendor, vendorDone, loadingAuth]);

  useEffect(() => {
    initAuthentication();
  }, [connected, isAuthenticated, loadingAuth, authenticate]);

  useEffect(() => {
    if (!isLoading && vendor) {
      setIsInit(true);
    }
    if (!isLoading && !vendor && vendorDone && currentPath !== "/dashboard/profile") {
      redirect("/dashboard/profile");
    }
  }, [isLoading, loadingVendor, vendor, vendorDone]);

  useEffect(() => {
    if (connected && account && isAuthenticated) {
      async function fetchNotifications() {
        try {
          const notifications = await authenticatedGet("/api/notification");
          const jsonNotifications = (await notifications.json()) as Notification[];
          const unreadCount = jsonNotifications.filter((n) => !n.read).length;
          if (unreadCount > 0) {
            setUnreadNotifications(true);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
      fetchNotifications();
    }
  }, [connected, account, isAuthenticated]);

  return (
    <>
      <DashboardHeader unreadNotifications={unreadNotifications} />
      <div className="grow flex flex-col lg:grid lg:grid-cols-12 mx-5 lg:mx-10 gap-5 lg:gap-10 py-5">
        {isLoading ? (
          <LoadingLayout />
        ) : (
          <>
            <DashboardSidebar className="lg:col-span-3" disabled={!isInit || !isAuthenticated} path={currentPath} />
            <main className="lg:col-span-9">
              {isAuthenticated ? (
                children
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    Please authenticate with your wallet to access the dashboard.
                    <Button
                      onClick={() => {
                        setAuthChecked(false);
                        initAuthentication();
                      }}
                      variant="outline"
                      className="mt-4"
                    >
                      <FingerprintIcon className="mr-2" />
                      Authenticate
                    </Button>
                  </div>
                </>
              )}
            </main>
          </>
        )}
      </div>
      <DashboardFooter />
    </>
  );
}
