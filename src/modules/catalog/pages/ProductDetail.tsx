import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/CartContext";
import { useProductQuery } from "../hooks/useProductQuery";
import { useReviewsQuery } from "../hooks/useReviewsQuery";
import { ProductMediaGallery } from "../components/ProductMediaGallery";
import { useProductMediaQuery } from "../hooks/useProductMediaQuery";
import { StockBadge } from "../components/StockBadge";
import { Price } from "../components/Price";
import { Rating } from "../components/Rating";
import { ReviewsList } from "../components/ReviewsList";
import { ReviewForm } from "../components/ReviewForm";
import { ProductSpecs } from "../components/ProductSpecs";
import { RelatedProducts } from "../components/RelatedProducts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const { data: product, isLoading: productLoading } = useProductQuery(id);
  const { data: reviewsData } = useReviewsQuery(id);
  const { data: media = [] } = useProductMediaQuery(id);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = "/carrinho";
  };

  if (productLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container px-4 py-8 flex-1">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container px-4 py-6 flex-1">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Início</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/produtos">Produtos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Gallery */}
          <ProductMediaGallery media={media} productName={product.name} />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-3">{product.brand}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              {reviewsData && reviewsData.count > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <Rating rating={reviewsData.averageRating} size="md" showNumber />
                  <span className="text-sm text-muted-foreground">
                    ({reviewsData.count} {reviewsData.count === 1 ? "avaliação" : "avaliações"})
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-4 mb-4">
                <Price value={product.price} size="xl" />
              </div>
              <StockBadge stock={product.stock} />
            </div>

            <Separator />

            <Card className="p-6 bg-muted/40">
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </Card>

            {product.stock > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  {/* Quantity Selector */}
                  <div>
                    <Label className="mb-2 block font-semibold">Quantidade</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Adicionar ao Carrinho
                    </Button>
                    <Button
                      size="lg"
                      variant="secondary"
                      className="flex-1"
                      onClick={handleBuyNow}
                    >
                      Comprar Agora
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Specs */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div className="mb-16">
            <ProductSpecs specs={product.specs} />
          </div>
        )}

        {/* Reviews */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Avaliações de Clientes</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {reviewsData && (
                <ReviewsList
                  reviews={reviewsData.reviews}
                  averageRating={reviewsData.averageRating}
                  count={reviewsData.count}
                />
              )}
            </div>
            <div>
              <ReviewForm productId={product.id} />
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Produtos Relacionados</h2>
          <RelatedProducts
            currentProductId={product.id}
            categoryId={product.category_id}
            brand={product.brand}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
