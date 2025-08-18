import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import { WalletProvider } from "@/components/WalletProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WalletProvider>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </WalletProvider>
    </>
  );
}
