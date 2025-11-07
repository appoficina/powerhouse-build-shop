import { cn } from "@/lib/utils";

interface PriceProps {
  value: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Price({ value, size = "md", className }: PriceProps) {
  const sizeClasses = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl"
  };

  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

  return (
    <span className={cn("font-bold text-accent", sizeClasses[size], className)}>
      {formatted}
    </span>
  );
}
