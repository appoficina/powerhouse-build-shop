import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "../types";

export function useProductQuery(productId: string | undefined) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required");

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Product not found");

      return data as Product;
    },
    enabled: !!productId,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
}
