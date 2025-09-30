import ChatBox from "@/components/views/payment/chat-box";
import PaymentFooter from "@/components/views/payment/footer";
import PaymentHeader from "@/components/views/payment/header";
import WalletStatus from "@/components/views/payment/wallet-status";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between payment-bg">
      <PaymentHeader />
      <section className="bg-white mx-10 rounded-2xl shadow-lg overflow-hidden">
        <aside className="p-10 border-b border-slate-200 flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <h2 className="font-semibold text-lg">Complete Your Payment</h2>
            <p className="text-slate-600">Follow the steps below to securely complete your payment.</p>
          </div>
          <div>
            <WalletStatus />
          </div>
        </aside>
        <main className="flex flex-col-reverse md:grid md:grid-cols-3 h-[60vh]">
          <section className="bg-slate-50 border-r border-slate-200 h-[60vh]">
            <ChatBox />
          </section>
          <section className="flex flex-col h-full md:col-span-2 p-10">{children}</section>
        </main>
      </section>
      <PaymentFooter />
    </div>
  );
}
