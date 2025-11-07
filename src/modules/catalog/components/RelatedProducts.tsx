import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "../types";
import { Card } from "@/components/ui/card";

interface RelatedProductsProps {
  currentProductId: string;
  categoryId: string | null;
  brand: string;
}

export function RelatedProducts({ currentProductId, categoryId, brand }: RelatedProductsProps) {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["related-products", currentProductId, categoryId, brand],
    queryFn: async () => {
      // Try to fetch by same brand and category first
      let query = supabase
        .from("products")
        .select("*")
        .neq("id", currentProductId)
        .limit(6);

      if (categoryId) {
        query = query.eq("category_id", categoryId).eq("brand", brand);
      }

      let { data } = await query;

      // If not enough products, fallback to same category only
      if (!data || data.length < 3) {
        if (categoryId) {
          query = supabase
            .from("products")
            .select("*")
            .neq("id", currentProductId)
            .eq("category_id", categoryId)
            .limit(6);

          const result = await query;
          data = result.data;
        }
      }

      return (data || []) as Product[];
    },
    staleTime: 300000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="h-[400px] animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
