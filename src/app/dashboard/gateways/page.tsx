import PageTitle from "@/components/page-title";
import { PlusIcon } from "lucide-react";

export default function GatewaysPage() {
  return (
    <div>
      <PageTitle title="Gateways" actionIcon={<PlusIcon />} actionLabel="Create Gateway" />
    </div>
  );
}
