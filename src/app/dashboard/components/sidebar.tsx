// props

interface DashboardSidebarProps {
  className?: string;
  disabled?: boolean;
}

export default function DashboardSidebar({ className, disabled }: DashboardSidebarProps) {
  return (
    <aside className={className}>
      <h2>Sidebar {disabled ? "(Disabled)" : "(Enabled)"}</h2>
    </aside>
  );
}
