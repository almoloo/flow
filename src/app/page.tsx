import { Button } from "@/components/ui/button";
import DashboardFooter from "@/components/views/dashboard/footer";
import HomepageAnimation from "@/components/views/homepage/animation";
import FeatureItem from "@/components/views/homepage/feature-item";
import HomepageHeader from "@/components/views/homepage/header";
import TipItem from "@/components/views/homepage/tip-item";
import {
  ArrowDownLeftIcon,
  ArrowDownRightIcon,
  ChevronRightIcon,
  FilePenLineIcon,
  LinkIcon,
  WalletIcon,
} from "lucide-react";
import Link from "next/link";

export default function IndexPage() {
  return (
    <div className="bg-slate-100 min-h-screen py-5 lg:p-10">
      <div className="container px-5">
        <section className="px-10 py-14 lg:p-20 pt-10 bg-gradient-to-r from-indigo-900 to-indigo-300 text-white rounded-t-3xl space-y-10">
          <HomepageHeader homepage />
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="flex flex-col gap-10">
              <div>
                <h2 className="text-4xl font-bold leading-42 mb-3">The Easiest Way to Get Paid in Crypto</h2>
                <p className="font-medium text-slate-300">
                  Accept payments in any token, receive USDT. No complex setup, no coding. perfect for small businesses
                  and creators.
                </p>
              </div>
              <div className="flex items-center gap-10">
                <Button variant="secondary" size="lg" className="pl-7 pr-5" asChild>
                  <Link href="/auth">
                    Get Started
                    <ChevronRightIcon className="ml-1 size-5" />
                  </Link>
                </Button>
                <span className="text-xs text-slate-200">
                  Learn How It Works <ArrowDownRightIcon className="ml-1 size-4 inline-block" />
                </span>
              </div>
            </div>
            <div>
              <HomepageAnimation />
            </div>
          </div>
        </section>
        <section className="bg-white px-10 py-14 lg:p-20 rounded-b-3xl flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-5 gap-10 lg:gap-20 items-center">
          <div className="flex flex-col gap-4 xl:col-span-3">
            <span className="font-medium text-indigo-600 text-sm">How It Works</span>
            <h3 className="text-2xl font-bold">Simple, Fast, and Secure Payments</h3>
            <p className="text-neutral-500 leading-relaxed text-balance">
              Accept crypto payments in just three steps. Your customers choose to pay in USDT or any other supported
              token. if they pay in another token, our system swaps it automatically, and the customer covers the swap
              fee. No complicated setup, no hidden surprises; just smooth transactions.
            </p>
          </div>
          <div className="flex flex-col gap-10 xl:col-span-2 w-full">
            <TipItem
              number="1"
              title="Connect your wallet"
              description="Link your Aptos wallet in seconds. no sign-up required."
              icon={<WalletIcon className="ml-auto text-indigo-300 size-10" />}
            />
            <TipItem
              number="2"
              title="Set your payment details"
              description="Choose amount, and fill in your gateway info."
              icon={<FilePenLineIcon className="ml-auto text-indigo-300 size-10" />}
            />
            <TipItem
              number="3"
              title="Share your link & get paid"
              description="No matter what, you’ll receive USDT."
              icon={<LinkIcon className="ml-auto text-indigo-300 size-10" />}
            />
          </div>
        </section>
        <section className="px-10 py-14 lg:p-20 flex flex-col gap-14">
          <div className="flex justify-between items-center">
            <ArrowDownRightIcon className="text-slate-400 size-10" />
            <h3 className="text-lg font-bold">But Wait, There's More!</h3>
            <ArrowDownLeftIcon className="text-slate-400 size-10" />
          </div>
          <div className="flex flex-col gap-20 lg:grid lg:grid-cols-2">
            <FeatureItem
              title="One-Time Invoices, No Setup Needed"
              subtitle="Invoice"
              description="Need to request payment for a specific job or product? Create a one-time invoice in seconds. We’ll email your customer a secure payment link; no gateway, no callbacks, just instant payment requests."
            />
            <FeatureItem
              title="Short Links for Social Media"
              subtitle="Short Link"
              description="Share your products on Instagram without cluttering your posts. Create a short link with your payment details pre-filled. Customers just paste your post link on our page and they’re taken directly to the payment page."
            />
          </div>
        </section>
        <section className="mb-10 px-10 py-14 lg:p-20 relative rounded-3xl bg-gradient-to-r from-white/40 via-neutral-100/0 to-white/40 border-x-4 border-white/60 overflow-hidden">
          <div className="bg-pattern absolute top-0 left-0 right-0 bottom-0 opacity-10"></div>
          <div className="flex flex-col gap-5 text-center max-w-[600px] mx-auto">
            <span className="font-medium text-indigo-600 text-sm">Why Choose Us</span>
            <h3 className="text-2xl font-bold">Get Decentralized, Get Paid.</h3>
            <p className="text-slate-600 leading-relaxed text-balance">
              We help vendors of all sizes accept payments in a way that’s effortless for them and their customers. From
              secure on-chain transactions to built-in currency swapping, every feature is designed to save you time,
              reduce friction, and keep your cash flow moving.
            </p>
          </div>
        </section>
        <DashboardFooter homepage />
      </div>
    </div>
  );
}
