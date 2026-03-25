import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-sm border border-border-default bg-bg-input px-3 py-2 text-sm text-text-primary shadow-sm placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-blue disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
