import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { StockBadge } from "@/modules/catalog/components/StockBadge";
import { Price } from "@/modules/catalog/components/Price";

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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/produtos/${product.id}`}>
      <Card className="h-full product-card-hover overflow-hidden group">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
            {product.brand}
          </Badge>
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">
                Sem Estoque
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-base line-clamp-2 mb-2 min-h-[3rem] group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <Price value={product.price} size="lg" />
            {product.stock > 0 && product.stock <= 5 && (
              <StockBadge stock={product.stock} variant="compact" />
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            variant={product.stock === 0 ? "secondary" : "default"}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock === 0 ? "Sem Estoque" : "Adicionar ao Carrinho"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
