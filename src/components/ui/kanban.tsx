import { cn } from "@/lib/utils";
import type { Ref } from "react";

export function KanbanRoot({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div
      className={cn(
        "flex flex-row gap-2 h-full overflow-x-auto overflow-y-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function KanbanColumnRoot({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div
      className={cn(
        "bg-accent flex flex-col h-full rounded shrink-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function KanbanColumnHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div className={cn("p-3 shrink-0", className)} {...props}>
      {children}
    </div>
  );
}

export function KanbanColumnContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div
      className={cn("flex flex-col p-3 pt-0 gap-2 shrink-0 h-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}
