import PageTitle from "@/components/page-title";
import DashboardChart from "@/components/views/dashboard/chart";
import TransactionsBox from "@/components/views/dashboard/transactions";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Dashboard" />
      <DashboardChart />
      <TransactionsBox />
    </div>
  );
}
