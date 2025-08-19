import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/toaster";
import { WrongNetworkAlert } from "@/components/WrongNetworkAlert";

import "./globals.css";
import Providers from "@/lib/providers";

export const metadata: Metadata = {
  applicationName: "Aptos Boilerplate Template",
  title: "NextJS Boilerplate Template",
  description: "Aptos Boilerplate Template",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <Providers>
        <body>
          <div id="root" className="min-h-screen flex flex-col">
            {children}
          </div>
          <WrongNetworkAlert />
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
