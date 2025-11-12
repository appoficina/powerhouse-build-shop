import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { StockBadge } from "@/modules/catalog/components/StockBadge";
import { Price } from "@/modules/catalog/components/Price";
import { useProductMediaQuery } from "@/modules/catalog/hooks/useProductMediaQuery";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  stock: number;
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { data: media = [] } = useProductMediaQuery(product.id);
  
  // Get primary image or first image from media
  const primaryMedia = media.find(m => m.is_primary && m.kind === 'image') || 
                       media.find(m => m.kind === 'image') ||
                       null;
  const imageUrl = primaryMedia?.url || product.image_url || "/placeholder.svg";
  const imageAlt = primaryMedia?.alt || product.name;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Card className="h-full overflow-hidden group hover:shadow-hover transition-all duration-300">
      <Link to={`/produtos/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground backdrop-blur-sm shadow-lg">
            {product.brand}
          </Badge>
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
              <Badge variant="destructive" className="text-sm font-semibold">
                Sem Estoque
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between pt-2">
            <Price value={product.price} size="lg" className="font-bold" />
            {product.stock > 0 && product.stock <= 5 && (
              <StockBadge stock={product.stock} variant="compact" />
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          variant={product.stock === 0 ? "secondary" : "default"}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? "Sem Estoque" : "Adicionar"}
        </Button>
      </CardFooter>
    </Card>
  );
};
