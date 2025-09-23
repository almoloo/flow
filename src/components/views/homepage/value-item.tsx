interface ValueItemProps {
  title: string;
  description: string;
}
export default function ValueItem({ title, description }: ValueItemProps) {
  return (
    <div className="space-y-2 pl-5 border-l-4 border-indigo-100">
      <strong className="font-medium">{title}</strong>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
