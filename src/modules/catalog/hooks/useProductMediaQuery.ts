import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductMedia } from "../types/media";

export function useProductMediaQuery(productId: string | undefined) {
  return useQuery({
    queryKey: ["product-media", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required");

      const { data, error } = await supabase
        .from("product_media")
        .select("*")
        .eq("product_id", productId)
        .order("sort", { ascending: true });

      if (error) throw error;

      return (data || []) as ProductMedia[];
    },
    enabled: !!productId,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
}
