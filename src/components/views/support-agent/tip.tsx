import { BotMessageSquareIcon, InfoIcon } from "lucide-react";

function ListItem({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border-l-4 border-slate-300 pl-3 flex flex-col space-y-1">
      <h4 className="font-medium">{title}</h4>
      {description && <p className="text-sm text-slate-600">{description}</p>}
    </div>
  );
}

export default function TipBox() {
  return (
    <div className="border border-x-blue-200 bg-blue-50 rounded-2xl p-7 space-y-7">
      <div className="space-y-3">
        <h2 className="flex items-center gap-3 text-xl font-semibold">
          <BotMessageSquareIcon className="size-7 text-blue-500" />
          <span>Meet Your Support Agent</span>
        </h2>
        <p>A smart, AI-powered assistant here to help your customers complete payments smoothly and confidently.</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">What it does</h3>
        <ListItem
          title="Answers questions instantly"
          description="Handles customer inquiries about payment steps, accepted tokens, or troubleshooting."
        />
        <ListItem
          title="Guides through the process"
          description="Walks customers from order review to payment confirmation."
        />
        <ListItem
          title="Adapts to your business"
          description="You can add your own instructions and FAQs to ensure consistent answers."
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Why it's helpful</h3>
        <ListItem title="Reduces failed or abandoned payments." />
        <ListItem title="Saves you time by handling repetitive support questions." />
        <ListItem title="Improves customer trust and satisfaction." />
      </div>

      <div className="flex items-center gap-2 text-slate-500">
        <InfoIcon className="size-5" />
        <p className="text-sm">
          The more details you provide, the better the Support Agent can respond on your behalf.
        </p>
      </div>
    </div>
  );
}
