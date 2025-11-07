import { Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, ShoppingBag } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { Price } from "@/modules/catalog/components/Price";

export default function Checkout() {
  const { items, totalPrice } = useCart();

  const formatWhatsAppMessage = () => {
    let message = "🛒 *Pedido - Powerhouse Shop*\n\n";
    
    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`;
      message += `   Marca: ${item.brand}\n`;
      message += `   Quantidade: ${item.quantity}\n`;
      message += `   Preço unitário: R$ ${item.price.toFixed(2)}\n`;
      message += `   Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    message += `💰 *Total: R$ ${totalPrice.toFixed(2)}*\n\n`;
    message += `Gostaria de finalizar este pedido.`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppCheckout = () => {
    // Get WhatsApp number from settings (hardcoded for MVP)
    const whatsappNumber = "5511999999999"; // TODO: Fetch from settings
    const message = formatWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    window.open(whatsappUrl, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container px-4 py-16 flex-1 flex items-center justify-center">
          <Card className="p-12 text-center max-w-md">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Carrinho Vazio</h2>
            <p className="text-muted-foreground mb-6">
              Adicione produtos ao carrinho para finalizar a compra.
            </p>
            <Link to="/produtos">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuar Comprando
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

      <div className="container px-4 py-8 flex-1">
        <Link to="/carrinho">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Carrinho
          </Button>
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-8">Finalizar Pedido</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.brand}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-muted-foreground">
                          Quantidade: {item.quantity}
                        </span>
                        <Price value={item.price * item.quantity} size="sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Como Funciona</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p>Revise os itens do seu pedido acima</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p>Clique no botão "Finalizar via WhatsApp"</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p>Complete seu pedido diretamente com nossa equipe pelo WhatsApp</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Total do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} itens)</span>
                    <Price value={totalPrice} size="sm" />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <Price value={totalPrice} size="lg" />
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full shadow-glow"
                  onClick={handleWhatsAppCheckout}
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Finalizar via WhatsApp
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Ao clicar, você será redirecionado para o WhatsApp para confirmar seu pedido com nossa equipe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
