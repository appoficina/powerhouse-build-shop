import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Brand } from "../types";

interface ProductFiltersProps {
  categories: Array<{ id: string; name: string }>;
  brands: Brand[];
  selectedCategories: string[];
  selectedBrands: Brand[];
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
  onCategoryChange: (categoryId: string, checked: boolean) => void;
  onBrandChange: (brand: Brand, checked: boolean) => void;
  onPriceChange: (min?: number, max?: number) => void;
  onStockChange: (checked: boolean) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const ProductFilters = ({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  minPrice,
  maxPrice,
  inStock,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onStockChange,
  onClearFilters,
  hasActiveFilters,
}: ProductFiltersProps) => {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categorias</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) =>
                  onCategoryChange(category.id, checked as boolean)
                }
              />
              <Label htmlFor={`cat-${category.id}`} className="cursor-pointer text-sm">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-3">Marcas</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) =>
                  onBrandChange(brand, checked as boolean)
                }
              />
              <Label htmlFor={`brand-${brand}`} className="cursor-pointer text-sm">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Faixa de Preço</h3>
        <div className="space-y-2">
          <div>
            <Label htmlFor="min-price" className="text-xs text-muted-foreground">
              Preço Mínimo
            </Label>
            <Input
              id="min-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="R$ 0,00"
              value={minPrice || ""}
              onChange={(e) => {
                const value = e.target.value ? parseFloat(e.target.value) : undefined;
                onPriceChange(value, maxPrice);
              }}
            />
          </div>
          <div>
            <Label htmlFor="max-price" className="text-xs text-muted-foreground">
              Preço Máximo
            </Label>
            <Input
              id="max-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="R$ 9999,00"
              value={maxPrice || ""}
              onChange={(e) => {
                const value = e.target.value ? parseFloat(e.target.value) : undefined;
                onPriceChange(minPrice, value);
              }}
            />
          </div>
        </div>
      </div>

      {/* Stock Filter */}
      <div>
        <h3 className="font-semibold mb-3">Disponibilidade</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={inStock}
            onCheckedChange={(checked) => onStockChange(checked as boolean)}
          />
          <Label htmlFor="in-stock" className="cursor-pointer text-sm">
            Apenas em estoque
          </Label>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={onClearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Limpar Filtros
        </Button>
      )}
    </div>
  );
};
