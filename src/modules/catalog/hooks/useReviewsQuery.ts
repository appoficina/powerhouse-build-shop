import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Review } from "../types";

export function useReviewsQuery(productId: string | undefined) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      if (!productId) throw new Error("Product ID is required");

      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const reviews = (data || []) as Review[];
      
      // Calculate average rating
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      return {
        reviews,
        count: reviews.length,
        averageRating: avgRating,
      };
    },
    enabled: !!productId,
    staleTime: 30000,
  });
}
