import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductFilters, SortOption } from "../types";

interface UseProductsQueryParams {
  filters?: ProductFilters;
  sortBy?: SortOption;
  page?: number;
  pageSize?: number;
}

export function useProductsQuery({
  filters = {},
  sortBy = "created_at-desc",
  page = 1,
  pageSize = 12,
}: UseProductsQueryParams = {}) {
  return useQuery({
    queryKey: ["products", filters, sortBy, page, pageSize],
    queryFn: async () => {
      let query = supabase.from("products").select("*", { count: "exact" });

      // Apply filters
      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      if (filters.brands && filters.brands.length > 0) {
        query = query.in("brand", filters.brands);
      }

      if (filters.categories && filters.categories.length > 0) {
        query = query.in("category_id", filters.categories);
      }

      if (filters.inStock) {
        query = query.gt("stock", 0);
      }

      // Apply sorting
      const [field, direction] = sortBy.split("-") as [string, "asc" | "desc"];
      query = query.order(field, { ascending: direction === "asc" });

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        products: (data || []) as Product[],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        currentPage: page,
      };
    },
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false,
  });
}
