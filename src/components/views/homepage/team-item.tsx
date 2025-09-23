import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TeamItemProps {
  name: string;
  role: string;
  imageUrl: string;
  githubUrl: string;
}

export default function TeamItem({ name, role, imageUrl, githubUrl }: TeamItemProps) {
  return (
    <div className="rounded-full p-2 bg-indigo-100 flex items-center gap-3 shrink-0">
      <Image src={imageUrl} alt={name} width={60} height={60} className="rounded-full" />
      <div>
        <h3 className="font-semibold text-lg">{name}</h3>
        <span className="text-xs text-slate-600">{role}</span>
      </div>
      <Button variant="link" size="icon" className="mx-3" asChild>
        <Link href={githubUrl} target="_blank">
          <GithubIcon className="size-5" />
        </Link>
      </Button>
    </div>
  );
}
