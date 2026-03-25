import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "green" | "blue" | "amber" | "red" | "purple" | "muted";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium font-mono",
        {
          "bg-bg-tertiary text-text-primary": variant === "default",
          "bg-accent-green/15 text-accent-green": variant === "green",
          "bg-accent-blue/15 text-accent-blue": variant === "blue",
          "bg-accent-amber/15 text-accent-amber": variant === "amber",
          "bg-accent-red/15 text-accent-red": variant === "red",
          "bg-accent-purple/15 text-accent-purple": variant === "purple",
          "bg-bg-tertiary text-text-tertiary": variant === "muted",
        },
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
