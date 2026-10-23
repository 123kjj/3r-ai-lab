import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

// Restrained, editorial button styling: sharp corners, a thin border
// or solid fill, and a simple color shift on hover rather than lift
// shadows or glow — matches the field-journal/lab design direction.
const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-forest-800 text-paper hover:bg-forest-900",
  secondary: "bg-transparent text-forest-800 border border-forest-800 hover:bg-forest-50",
  ghost: "bg-transparent text-charcoal-600 hover:text-forest-800 underline decoration-charcoal-300 underline-offset-4",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-3.5 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

function classes({ variant = "primary", size = "md", className = "" }: BaseProps) {
  return `inline-flex items-center justify-center gap-2 font-sans font-medium tracking-wide transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 disabled:opacity-50 disabled:pointer-events-none ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;
}

export const Button = forwardRef<
  HTMLButtonElement,
  BaseProps & ButtonHTMLAttributes<HTMLButtonElement>
>(({ variant, size, className, ...props }, ref) => (
  <button ref={ref} className={classes({ variant, size, className })} {...props} />
));
Button.displayName = "Button";

export function LinkButton({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: BaseProps & { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={classes({ variant, size, className })} {...rest}>
      {children}
    </Link>
  );
}
