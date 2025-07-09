import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center py-0.5 px-1 justify-center rounded-md border text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 transition-colors overflow-hidden",
  {
    variants: {
      variant: {
        solid: "border-transparent",
        soft: "border-transparent",
      },
      color: {
        blue: "",
        green: "",
        red: "",
        orange: "",
        gray: "",
        yellow: "",
      },
    },
    compoundVariants: [
      // solid variants
      {
        variant: "solid",
        color: "blue",
        className: "bg-blue-700 text-white",
      },
      {
        variant: "solid",
        color: "green",
        className: "bg-green-700 text-white",
      },
      {
        variant: "solid",
        color: "red",
        className: "bg-red-700 text-white",
      },
      {
        variant: "solid",
        color: "orange",
        className: "bg-orange-600 text-white",
      },
      {
        variant: "solid",
        color: "gray",
        className: "bg-gray-700 text-white",
      },
      {
        variant: "solid",
        color: "yellow",
        className: "bg-yellow-400 text-foreground",
      },

      // soft variants
      {
        variant: "soft",
        color: "blue",
        className: "bg-blue-100 text-blue-900",
      },
      {
        variant: "soft",
        color: "green",
        className: "bg-green-100 text-green-900",
      },
      {
        variant: "soft",
        color: "red",
        className: "bg-red-100 text-red-900",
      },
      {
        variant: "soft",
        color: "orange",
        className: "bg-orange-100 text-orange-900",
      },
      {
        variant: "soft",
        color: "gray",
        className: "bg-gray-100 text-foreground",
      },
      {
        variant: "soft",
        color: "yellow",
        className: "bg-yellow-100 text-foreground",
      },
    ],
    defaultVariants: {
      variant: "solid",
      color: "blue",
    },
  }
);

function Badge({
  className,
  variant,
  color,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, color }), className)}
      {...props}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
