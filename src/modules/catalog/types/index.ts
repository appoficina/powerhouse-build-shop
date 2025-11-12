export interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  long_description?: string;
  price: number;
  stock: number;
  brand: string;
  category_id: string | null;
  image_url: string;
  additional_images: string[];
  attributes: Record<string, any>;
  featured: boolean;
  sku?: string;
  slug?: string;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  created_at: string;
}

export type Brand = "Tssaper" | "Buffalo" | "Toyama";

export interface ProductFilters {
  search?: string;
  brands?: Brand[];
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export type SortOption = 
  | "name-asc" 
  | "name-desc" 
  | "price-asc" 
  | "price-desc" 
  | "created_at-desc";
