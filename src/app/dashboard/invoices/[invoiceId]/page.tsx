"use client";

import HrInfoLoading from "@/components/hr-info-loading";
import HrInfoRow from "@/components/hr-info-row";
import PageTitle from "@/components/page-title";
import PrintButton from "@/components/print-button";
import { Skeleton } from "@/components/ui/skeleton";
import InvoiceShareBox from "@/components/views/invoice/share-box";
import InvoiceStatusBox from "@/components/views/invoice/status-box";
import { formatAddress } from "@/lib/utils";
import { Invoice, InvoiceStatus } from "@/types";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

interface InvoicePageProps {
  params: {
    invoiceId: string;
  };
}

export default function InvoicePage({ params }: InvoicePageProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/invoice/${params.invoiceId}`);
        if (res.status === 404) {
          notFound();
          return;
        }
        const jsonInvoice = (await res.json()) as Invoice;
        setInvoice(jsonInvoice);
      } catch (error) {
        console.error("Error fetching customer info:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-10 print:space-y-5">
      <PageTitle title="Invoices" segment={formatAddress(params.invoiceId)} />
      {isLoading && (
        <>
          <Skeleton className="h-28 w-full" />
          <HrInfoLoading />
        </>
      )}
      {!isLoading && invoice && (
        <>
          <InvoiceStatusBox status={invoice?.status} />
          {invoice.status === InvoiceStatus.PENDING && <InvoiceShareBox invoiceId={invoice.id} />}
          <div className="space-y-5">
            <HrInfoRow label="Invoice Id" value={invoice.id} />
            <HrInfoRow label="Status" value={invoice.status} />
            <HrInfoRow label="Amount" value={`${invoice.amount} USDT`} />
            {invoice.customerEmail && invoice.customerEmail !== "" && (
              <HrInfoRow label="Customer Email" value={invoice.customerEmail} copyable />
            )}
            <HrInfoRow label="Create Date" value={invoice.createDate} />
            {invoice.paymentDate && <HrInfoRow label="Payment Date" value={invoice.paymentDate} />}
            {invoice.customer && invoice.customer.address && (
              <HrInfoRow
                label="Customer Address"
                value={formatAddress(invoice.customer.address)}
                copyable
                fullValue={invoice.customer.address}
              />
            )}
            {invoice.transactionId && (
              <HrInfoRow
                label="TXID"
                value={formatAddress(invoice.transactionId)}
                copyable
                fullValue={invoice.transactionId}
              />
            )}
          </div>
          <div className="print:hidden">
            <PrintButton label="Print Invoice" />
          </div>
        </>
      )}
    </div>
  );
}
