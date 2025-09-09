import PageTitle from "@/components/page-title";
import { BotMessageSquareIcon } from "lucide-react";

export default function SupportAgentPage() {
  return (
    <div>
      <PageTitle title="Support Agent" />

      <div>
        <h2 className="flex items-center space-x-2 text-xl font-semibold">
          <BotMessageSquareIcon className="size-8" />
          <span>Meet Your Support Agent</span>
        </h2>
      </div>
    </div>
  );
}
