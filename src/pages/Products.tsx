import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useProductFilters } from "@/modules/catalog/hooks/useProductFilters";
import { ProductFilters } from "@/modules/catalog/components/ProductFilters";
import { ProductSort } from "@/modules/catalog/components/ProductSort";
import { Brand, SortOption } from "@/modules/catalog/types";
import { ScrollToTop } from "@/components/ScrollToTop";

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { filters, updateFilter, updateFilters, clearFilters, hasActiveFilters } = useProductFilters();
  
  const brands: Brand[] = ["Tssaper", "Buffalo", "Toyama"];
  const sortBy = (new URLSearchParams(window.location.search).get("sortBy") || "created_at-desc") as SortOption;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters, sortBy]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*");
    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from("products").select("*");

    // Apply filters
    if (filters.categories.length > 0) {
      query = query.in("category_id", filters.categories);
    }

    if (filters.brands.length > 0) {
      query = query.in("brand", filters.brands);
    }

    if (filters.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte("price", filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte("price", filters.maxPrice);
    }

    if (filters.inStock) {
      query = query.gt("stock", 0);
    }

    // Apply sorting
    const [field, direction] = sortBy.split("-") as [string, "asc" | "desc"];
    query = query.order(field, { ascending: direction === "asc" });

    const { data } = await query;
    if (data) setProducts(data);
    setLoading(false);
  };

  const handleSortChange = (value: SortOption) => {
    const newParams = new URLSearchParams(window.location.search);
    newParams.set("sortBy", value);
    window.history.replaceState({}, "", `?${newParams.toString()}`);
    fetchProducts();
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter((id) => id !== categoryId);
    updateFilter("categories", newCategories);
  };

  const handleBrandChange = (brand: Brand, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter((b) => b !== brand);
    updateFilter("brands", newBrands);
  };

  const handlePriceChange = (min?: number, max?: number) => {
    updateFilters({ minPrice: min, maxPrice: max });
  };

  const handleStockChange = (checked: boolean) => {
    updateFilter("inStock", checked);
  };

  const FilterContent = () => (
    <ProductFilters
      categories={categories}
      brands={brands}
      selectedCategories={filters.categories}
      selectedBrands={filters.brands}
      minPrice={filters.minPrice}
      maxPrice={filters.maxPrice}
      inStock={filters.inStock}
      onCategoryChange={handleCategoryChange}
      onBrandChange={handleBrandChange}
      onPriceChange={handlePriceChange}
      onStockChange={handleStockChange}
      onClearFilters={clearFilters}
      hasActiveFilters={hasActiveFilters}
    />
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container px-4 py-8 flex-1">
        <h1 className="text-4xl font-bold mb-8">Nossos Produtos</h1>

        <div className="flex gap-6">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Card className="p-6 sticky top-20">
              <FilterContent />
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <SearchBar 
                  initialValue={filters.search}
                  placeholder="Buscar produtos..."
                  onSearch={(query) => updateFilter("search", query)}
                />
              </div>

              <div className="flex gap-2">
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filtros
                      {hasActiveFilters && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                          {filters.categories.length + filters.brands.length}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filtros</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <ProductSort value={sortBy} onChange={handleSortChange} />
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <Card key={i} className="h-[400px] animate-pulse bg-muted" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground text-lg">
                  Nenhum produto encontrado com os filtros selecionados.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Products;
