export default function FeatureItem({
  title,
  subtitle,
  description,
}: {
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 pb-5 border-b-4 border-indigo-300">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-indigo-600 font-medium">{subtitle}</span>
        <h4 className="text-xl font-semibold">{title}</h4>
      </div>
      <p className="text-slate-700 leading-relaxed">{description}</p>
    </div>
  );
}
