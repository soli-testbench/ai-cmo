import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "outline" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-blue disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-accent-green text-bg-primary hover:bg-accent-green/90": variant === "default",
            "bg-bg-tertiary text-text-primary hover:bg-bg-tertiary/80": variant === "secondary",
            "hover:bg-bg-tertiary text-text-secondary hover:text-text-primary": variant === "ghost",
            "border border-border-default bg-transparent text-text-primary hover:bg-bg-tertiary":
              variant === "outline",
            "bg-accent-red text-text-primary hover:bg-accent-red/90": variant === "destructive",
          },
          {
            "h-9 px-4 py-2 text-sm": size === "default",
            "h-8 px-3 text-xs": size === "sm",
            "h-10 px-6 text-sm": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
