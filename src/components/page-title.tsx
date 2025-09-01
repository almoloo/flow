import { ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

interface PageTitleProps {
  title: string;
  segment?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  actionUrl?: string;
}

export default function PageTitle({ title, segment, actionLabel, actionIcon, actionUrl }: PageTitleProps) {
  return (
    <div className="flex items-center justify-between mb-7 flex-wrap gap-2">
      <div className="flex items-center space-x-1 lg:space-x-2 shrink-0">
        <h2 className={`font-bold text-xl lg:text-2xl ${segment ? "text-slate-400" : ""}`}>{title}</h2>
        {segment && (
          <>
            <ChevronRightIcon className="text-slate-400" />
            <h3 className="font-bold text-xl lg:text-2xl">{segment}</h3>
          </>
        )}
      </div>
      {actionLabel && actionUrl && (
        <Link href={actionUrl} passHref>
          <Button>
            {actionIcon &&
              (React.isValidElement(actionIcon)
                ? React.cloneElement(actionIcon, { className: `${actionIcon.props.className ?? ""} size-5 mr-2` })
                : actionIcon)}
            <span>{actionLabel}</span>
          </Button>
        </Link>
      )}
    </div>
  );
}
