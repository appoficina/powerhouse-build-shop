import { Link } from "react-router-dom";
import { ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url: string;
  stock: number;
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getBrandColor = (brand: string) => {
    switch (brand) {
      case "Tssaper":
        return "bg-blue-500";
      case "Buffalo":
        return "bg-red-500";
      case "Toyama":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Link to={`/produtos/${product.id}`}>
      <Card className="h-full shadow-card hover:shadow-hover transition-smooth overflow-hidden group">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            loading="lazy"
          />
          <Badge className={`absolute top-2 right-2 ${getBrandColor(product.brand)}`}>
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
          <h3 className="font-semibold text-base line-clamp-2 mb-2 min-h-[3rem]">
            {product.name}
          </h3>
          <p className="text-2xl font-bold text-primary">{formatPrice(product.price)}</p>
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
              <Package className="h-3 w-3" />
              Últimas {product.stock} unidades!
            </p>
          )}
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
