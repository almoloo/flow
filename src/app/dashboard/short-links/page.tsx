"use client";

import PageTitle from "@/components/page-title";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SlEmptyState from "@/components/views/short-links/sl-empty-state";
import SlRow from "@/components/views/short-links/sl-row";
import SlRowLoading from "@/components/views/short-links/sl-row-loading";
import { authenticatedGet } from "@/lib/authenticatedFetch";
import { ShortLink } from "@/types";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ShortLinksPage() {
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      const fetchData = async () => {
        const res = await authenticatedGet("/api/short-link");
        const data = (await res.json()) as ShortLink[];
        setShortLinks(data);
        setIsLoading(false);
      };
      fetchData();
    }
  }, []);

  return (
    <div>
      <PageTitle
        title="Short Links"
        actionIcon={<PlusIcon />}
        actionLabel="Create New Short Link"
        actionUrl="/dashboard/short-links/create"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Short Link</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Gateway</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <SlRowLoading />}
          {!isLoading && shortLinks.length === 0 && <SlEmptyState />}
          {shortLinks.map((link) => (
            <SlRow key={link.id} {...link} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
