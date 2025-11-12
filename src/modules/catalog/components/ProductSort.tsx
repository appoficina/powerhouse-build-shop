import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from "../types";

interface ProductSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export const ProductSort = ({ value, onChange }: ProductSortProps) => {
  return (
    <Select value={value} onValueChange={(val) => onChange(val as SortOption)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Ordenar por" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="created_at-desc">Mais recentes</SelectItem>
        <SelectItem value="name-asc">Nome: A-Z</SelectItem>
        <SelectItem value="name-desc">Nome: Z-A</SelectItem>
        <SelectItem value="price-asc">Menor preço</SelectItem>
        <SelectItem value="price-desc">Maior preço</SelectItem>
      </SelectContent>
    </Select>
  );
};
