interface PrintButtonProps {
  className?: string;
  label?: string;
}

export default function PrintButton({ label, className }: PrintButtonProps) {
  return <div className={className}>{label || "PrintButton"}</div>;
}
