import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-8 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary dark:focus:ring-primary/30",
        "aria-invalid:ring-destructive aria-invalid:ring-offset-1 aria-invalid:ring-2 dark:aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  );
}

export { Input };
