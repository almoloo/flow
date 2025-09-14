import FlowLogo from "@/components/logo";
import { Button } from "@/components/ui/button";
import ChatBox from "@/components/views/payment/chat-box";
import { GithubIcon } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between payment-bg">
      <header className="flex justify-center p-10">
        <FlowLogo className="h-6 w-auto text-indigo-500" />
      </header>
      <section className="bg-white mx-10 rounded-2xl shadow-lg overflow-hidden">
        <aside className="p-10 border-b border-slate-200 flex items-center justify-between">
          <div className="flex flex-col space-y-2">
            <h2 className="font-semibold text-lg">Complete Your Payment</h2>
            <p className="text-slate-600">Follow the steps below to securely complete your payment.</p>
          </div>
          <div>Disconnected</div>
        </aside>
        <main className="flex flex-col-reverse md:grid md:grid-cols-3 h-[60vh]">
          <section className="bg-slate-50 border-r border-slate-200 h-[60vh]">
            <ChatBox />
          </section>
          <section className="md:col-span-2 p-10">{children}</section>
        </main>
      </section>
      <footer className="p-10 flex justify-between items-center">
        <p className="flex items-end space-x-1">
          <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-5 w-auto text-indigo-200"
          >
            <path
              d="M7 3H5v4h2V3zm4 0H9v4h2V3zm2 0h2v4h-2V3zm8 6H3v12h14v-5h4V9zm-2 5h-2v-3h2v3zM5 11h10v8H5v-8z"
              fill="currentColor"
            />
          </svg>
          <span className="text-xs font-mono text-indigo-100">Created with love, care & lots of caffeine.</span>
        </p>
        <Button variant="secondary" size="icon" className="size-8" asChild>
          <Link href="https://github.com/almoloo/flow" target="_blank">
            <GithubIcon className="size-4" />
          </Link>
        </Button>
      </footer>
    </div>
  );
}
