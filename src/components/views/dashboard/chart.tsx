"use client";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useToast } from "@/components/ui/use-toast";
import { authenticatedGet } from "@/lib/authenticatedFetch";
import { Transaction } from "@/types";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

export default function DashboardChart() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<{ month: string; amount: number }[]>([]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const txData = await authenticatedGet("/api/transaction?count=5").then((res) => res.json());
      setTransactions(txData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  function convertToChartData(transactions: Transaction[]) {
    const monthlyData: { [key: string]: number } = {};

    transactions.forEach((tx) => {
      const date = new Date(tx.createdAt);
      const month = date.toLocaleString("default", { month: "long" });
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month] += Number(tx.targetAmount);
    });

    const data = Object.keys(monthlyData).map((month) => ({
      month,
      amount: monthlyData[month],
    }));

    if (data.length > 12) {
      return data.slice(data.length - 12);
    }

    const allMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    allMonths.forEach((month) => {
      if (!monthlyData[month]) {
        data.push({ month, amount: 0 });
      }
    });

    data.sort((a, b) => new Date(`1 ${a.month} 2000`).getTime() - new Date(`1 ${b.month} 2000`).getTime());

    return data;
  }

  useEffect(() => {
    if (transactions.length === 0 && !isLoading) {
      fetchTransactions();
    }
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      const data = convertToChartData(transactions);
      setChartData(data);
    }
  }, [transactions]);

  const chartConfig = {
    amount: {
      label: "USDT",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  return (
    <div className="bg-slate-50 rounded-xl p-10">
      <h3 className="font-medium mb-10">This Month’s Overview</h3>
      {isLoading ? (
        <div className="text-sm text-slate-500 mb-4">Loading chart data...</div>
      ) : (
        <ChartContainer config={chartConfig} className="w-full h-60">
          <AreaChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="amount"
              type="natural"
              // fill="var(--primary-foreground)"
              fillOpacity={0.1}
              strokeOpacity={0.25}
            />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  );
}
