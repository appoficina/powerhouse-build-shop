import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Package, Minus, Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Produto não encontrado");
      return;
    }

    setProduct(data);
    setLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/checkout";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container px-4 py-8 flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 w-64 bg-muted rounded mb-4 mx-auto" />
            <div className="h-4 w-48 bg-muted rounded mx-auto" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container px-4 py-8 flex-1 flex items-center justify-center">
          <Card className="p-12 text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
            <Link to="/produtos">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para produtos
              </Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const stockStatus = () => {
    if (product.stock === 0) {
      return <Badge variant="destructive">Sem Estoque</Badge>;
    } else if (product.stock <= 5) {
      return <Badge className="bg-amber-500">Últimas {product.stock} unidades!</Badge>;
    } else {
      return <Badge className="bg-green-500">{product.stock} unidades disponíveis</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container px-4 py-8 flex-1">
        <Link to="/produtos">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para produtos
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{product.brand}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
              </div>
              {stockStatus()}
            </div>

            <Card className="p-6 bg-muted/40">
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </Card>

            {product.stock > 0 && (
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div>
                  <Label className="mb-2 block font-semibold">Quantidade</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={handleBuyNow}
                  >
                    Comprar Agora
                  </Button>
                </div>
              </div>
            )}

            {product.stock === 0 && (
              <div className="p-4 border rounded-lg bg-muted/40 text-center">
                <Package className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Este produto está temporariamente sem estoque.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const Label = ({ children, className }: any) => (
  <label className={className}>{children}</label>
);

export default ProductDetail;
