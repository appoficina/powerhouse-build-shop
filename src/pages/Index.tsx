import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package, Zap, Cpu, Hammer, Tractor, Sparkles, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  { name: "Ferramentas Elétricas", icon: Zap, color: "bg-blue-500" },
  { name: "Motores e Geradores", icon: Cpu, color: "bg-purple-500" },
  { name: "Equipamentos de Construção Civil", icon: Hammer, color: "bg-orange-500" },
  { name: "Máquinas Agrícolas", icon: Tractor, color: "bg-green-500" },
  { name: "Limpeza e Jardinagem", icon: Sparkles, color: "bg-teal-500" },
  { name: "Motobombas", icon: Droplet, color: "bg-cyan-500" },
];

const brands = [
  { name: "Tssaper", description: "Qualidade e durabilidade em ferramentas elétricas" },
  { name: "Buffalo", description: "Motores e equipamentos agrícolas de alta performance" },
  { name: "Toyama", description: "Tecnologia japonesa em geradores e máquinas" },
];

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [productsRes, settingsRes] = await Promise.all([
        supabase.from("products").select("*").eq("featured", true).limit(8),
        supabase.from("settings").select("*").limit(1).single(),
      ]);

      if (productsRes.data) {
        setFeaturedProducts(productsRes.data);
      }
      if (settingsRes.data) {
        setSettings(settingsRes.data);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section 
        className="relative text-white py-20 md:py-32 bg-gradient-to-r from-primary to-primary/80"
        style={settings?.hero_image_url ? {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${settings.hero_image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {settings?.hero_title || "Ferramentas e Equipamentos Profissionais"}
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              {settings?.hero_subtitle || "As melhores marcas para seu trabalho: Tssaper, Buffalo e Toyama"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/produtos">
                <Button size="lg" variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Ver Produtos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Produtos em Destaque</h2>
          <p className="text-muted-foreground text-lg">
            Confira os produtos mais procurados pelos nossos clientes
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="h-[400px] animate-pulse bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/produtos">
            <Button variant="outline" size="lg">
              Ver Todos os Produtos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-muted/40 py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Categorias</h2>
            <p className="text-muted-foreground text-lg">
              Encontre o equipamento ideal para o seu projeto
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.name} to="/produtos">
                  <Card className="shadow-card hover:shadow-hover transition-smooth cursor-pointer h-full">
                    <CardContent className="p-6 flex items-center gap-4">
                      <div className={`${category.color} p-3 rounded-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="container px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossas Marcas</h2>
          <p className="text-muted-foreground text-lg">
            Trabalhamos com as melhores marcas do mercado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Link key={brand.name} to={`/produtos?brand=${brand.name}`}>
              <Card className="shadow-card hover:shadow-hover transition-smooth cursor-pointer h-full">
                <CardContent className="p-8 text-center space-y-3">
                  <div className="flex justify-center">
                    <Package className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">{brand.name}</h3>
                  <p className="text-muted-foreground">{brand.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
