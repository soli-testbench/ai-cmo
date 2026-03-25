import {
  Bot,
  FolderOpen,
  LayoutDashboard,
  Lightbulb,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Command Center", icon: LayoutDashboard, path: "/" },
  { label: "Projects", icon: FolderOpen, path: "/projects" },
  { label: "Opportunities", icon: Lightbulb, path: "/opportunities" },
  { label: "Agents", icon: Bot, path: "/agents" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-bg-secondary border-r border-border-default flex flex-col">
      <div className="p-4 border-b border-border-default">
        <h2 className="font-display text-sm font-bold text-accent-green tracking-tight">
          CHIEF MOG OFFICER
        </h2>
      </div>

      <nav className="flex-1 py-2 px-2">
        {navItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors",
                isActive
                  ? "bg-bg-tertiary text-text-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border-default">
        <p className="text-xs text-text-tertiary font-mono">
          Chief MOG Officer v0.1.0
        </p>
      </div>
    </aside>
  );
}
