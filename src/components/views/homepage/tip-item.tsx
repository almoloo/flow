export default function TipItem({
  number,
  title,
  description,
  icon,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center">
      <span className="text-5xl text-indigo-100 w-10 text-left lg:text-right">{number}</span>
      <div className="px-5">
        <h4 className="text-lg font-semibold mb-1">{title}</h4>
        <p className="text-slate-500 text-sm">{description}</p>
      </div>
      {icon}
    </div>
  );
}
