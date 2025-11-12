import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import { Brand } from "../types";

export interface ProductFiltersState {
  search: string;
  categories: string[];
  brands: Brand[];
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
}

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current filters from URL
  const filters = useMemo<ProductFiltersState>(() => {
    const search = searchParams.get("search") || "";
    const categoriesParam = searchParams.get("categories");
    const categories = categoriesParam ? categoriesParam.split(",") : [];
    const brandsParam = searchParams.get("brands");
    const brands = brandsParam ? brandsParam.split(",") as Brand[] : [];
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const inStock = searchParams.get("inStock") === "true";

    return {
      search,
      categories,
      brands,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      inStock,
    };
  }, [searchParams]);

  // Update a single filter
  const updateFilter = useCallback(
    (key: keyof ProductFiltersState, value: any) => {
      const newParams = new URLSearchParams(searchParams);

      if (value === undefined || value === null || value === "" || 
          (Array.isArray(value) && value.length === 0) || 
          (typeof value === "boolean" && !value)) {
        newParams.delete(key);
      } else if (Array.isArray(value)) {
        newParams.set(key, value.join(","));
      } else {
        newParams.set(key, String(value));
      }

      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Update multiple filters at once
  const updateFilters = useCallback(
    (updates: Partial<ProductFiltersState>) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "" || 
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === "boolean" && !value)) {
          newParams.delete(key);
        } else if (Array.isArray(value)) {
          newParams.set(key, value.join(","));
        } else {
          newParams.set(key, String(value));
        }
      });

      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    const sortBy = searchParams.get("sortBy"); // Preserve sort
    const newParams = new URLSearchParams();
    if (sortBy) {
      newParams.set("sortBy", sortBy);
    }
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== "" ||
      filters.categories.length > 0 ||
      filters.brands.length > 0 ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.inStock
    );
  }, [filters]);

  return {
    filters,
    updateFilter,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  };
}
