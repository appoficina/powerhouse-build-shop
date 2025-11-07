import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface StockBadgeProps {
  stock: number;
  variant?: "default" | "compact";
}

export function StockBadge({ stock, variant = "default" }: StockBadgeProps) {
  if (stock === 0) {
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" />
        {variant === "default" ? "Sem Estoque" : "Esgotado"}
      </Badge>
    );
  }

  if (stock <= 3) {
    return (
      <Badge className="gap-1 bg-amber-500 hover:bg-amber-600 text-white">
        <AlertCircle className="h-3 w-3" />
        {variant === "default" ? `Últimas ${stock} unidades!` : `${stock} rest.`}
      </Badge>
    );
  }

  return (
    <Badge className="gap-1 bg-green-600 hover:bg-green-700 text-white">
      <CheckCircle className="h-3 w-3" />
      {variant === "default" ? "Em Estoque" : `${stock} disp.`}
    </Badge>
  );
}
