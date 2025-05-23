import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 rounded-lg focus-visible:ring-blue-500",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 rounded-lg focus-visible:ring-red-500",
        outline:
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-lg focus-visible:ring-blue-500",
        secondary:
          "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 rounded-lg focus-visible:ring-gray-500 border border-gray-200",
        ghost:
          "text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200 rounded-lg",
        success: 
          "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 rounded-lg focus-visible:ring-emerald-500",
        warning:
          "bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 rounded-lg focus-visible:ring-amber-500",
        info:
          "bg-cyan-600 text-white hover:bg-cyan-700 active:bg-cyan-800 rounded-lg focus-visible:ring-cyan-500",
        link: "text-blue-600 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 text-xs has-[>svg]:px-2.5",
        lg: "h-12 rounded-lg px-6 text-base has-[>svg]:px-4",
        xl: "h-14 rounded-lg px-8 text-base has-[>svg]:px-6",
        icon: "size-10 rounded-full p-2",
        "icon-sm": "size-8 rounded-full p-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
