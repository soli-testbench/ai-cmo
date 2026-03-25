import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";

const statusVariantMap: Record<string, BadgeProps["variant"]> = {
  new: "green",
  active: "green",
  completed: "green",
  reviewed: "blue",
  running: "blue",
  acted: "amber",
  pending: "amber",
  paused: "amber",
  draft: "muted",
  dismissed: "muted",
  archived: "muted",
  failed: "red",
  error: "red",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = statusVariantMap[status] ?? "default";
  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}
