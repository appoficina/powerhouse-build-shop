import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

interface ProductSpecsProps {
  specs: Record<string, any>;
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
  const entries = Object.entries(specs);

  if (entries.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Especificações Técnicas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {entries.map(([key, value]) => (
            <div key={key} className="border-b border-border pb-3 last:border-0">
              <dt className="text-sm font-semibold text-muted-foreground mb-1">
                {formatSpecKey(key)}
              </dt>
              <dd className="text-base font-medium">{formatSpecValue(value)}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

function formatSpecKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatSpecValue(value: any): string {
  if (typeof value === "boolean") {
    return value ? "Sim" : "Não";
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return String(value);
}
