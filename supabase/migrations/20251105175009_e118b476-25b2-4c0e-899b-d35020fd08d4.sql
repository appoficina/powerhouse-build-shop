-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL CHECK (brand IN ('Tssaper', 'Buffalo', 'Toyama')),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  additional_images TEXT[] DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create settings table
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name TEXT NOT NULL DEFAULT 'Powerhouse Shop',
  whatsapp_number TEXT NOT NULL DEFAULT '5511999999999',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Categories are viewable by everyone"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Products are viewable by everyone"
ON public.products FOR SELECT
USING (true);

CREATE POLICY "Settings are viewable by everyone"
ON public.settings FOR SELECT
USING (true);

-- Admin write policies for categories
CREATE POLICY "Authenticated users can insert categories"
ON public.categories FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
ON public.categories FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete categories"
ON public.categories FOR DELETE
TO authenticated
USING (true);

-- Admin write policies for products
CREATE POLICY "Authenticated users can insert products"
ON public.products FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
ON public.products FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete products"
ON public.products FOR DELETE
TO authenticated
USING (true);

-- Admin write policies for settings
CREATE POLICY "Authenticated users can update settings"
ON public.settings FOR UPDATE
TO authenticated
USING (true);

-- Insert initial categories
INSERT INTO public.categories (name, icon) VALUES
  ('Ferramentas Elétricas', 'Zap'),
  ('Motores e Geradores', 'Cpu'),
  ('Equipamentos de Construção Civil', 'Hammer'),
  ('Máquinas Agrícolas', 'Tractor'),
  ('Limpeza e Jardinagem', 'Sparkles'),
  ('Motobombas', 'Droplet'),
  ('Acessórios', 'Package');

-- Insert initial settings
INSERT INTO public.settings (store_name, whatsapp_number) VALUES
  ('Powerhouse Shop', '5511999999999');

-- Insert sample products
INSERT INTO public.products (name, brand, category_id, price, description, image_url, stock, featured) VALUES
  -- Tssaper products
  (
    'Serra Tico-Tico 800W',
    'Tssaper',
    (SELECT id FROM public.categories WHERE name = 'Ferramentas Elétricas' LIMIT 1),
    289.90,
    'Serra tico-tico profissional com potência de 800W, ideal para cortes precisos em madeira, plástico e metal fino. Possui regulagem de velocidade e ação pendular para maior versatilidade.',
    'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800',
    15,
    true
  ),
  (
    'Esmerilhadeira Angular 7"',
    'Tssaper',
    (SELECT id FROM public.categories WHERE name = 'Ferramentas Elétricas' LIMIT 1),
    349.90,
    'Esmerilhadeira angular de 7 polegadas com alta potência para corte e desbaste de metais. Sistema de segurança com proteção contra reinício acidental.',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800',
    8,
    true
  ),
  (
    'Lavadora Alta Pressão 1800 PSI',
    'Tssaper',
    (SELECT id FROM public.categories WHERE name = 'Limpeza e Jardinagem' LIMIT 1),
    599.90,
    'Lavadora de alta pressão com 1800 PSI, perfeita para limpeza de calçadas, muros, veículos e áreas externas. Acompanha diversos bicos e mangueira de 5 metros.',
    'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800',
    5,
    false
  ),
  (
    'Furadeira de Impacto 850W',
    'Tssaper',
    (SELECT id FROM public.categories WHERE name = 'Ferramentas Elétricas' LIMIT 1),
    259.90,
    'Furadeira de impacto com 850W de potência, mandril de 13mm e velocidade variável. Ideal para perfurações em concreto, madeira e metal.',
    'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800',
    12,
    true
  ),
  -- Buffalo products
  (
    'Motor Gasolina 6.5HP',
    'Buffalo',
    (SELECT id FROM public.categories WHERE name = 'Motores e Geradores' LIMIT 1),
    1299.90,
    'Motor a gasolina de 6.5HP, 4 tempos, ideal para diversas aplicações industriais e agrícolas. Partida manual, tanque de 3.6L, baixo consumo e alta durabilidade.',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800',
    6,
    true
  ),
  (
    'Pulverizador Costal 20L',
    'Buffalo',
    (SELECT id FROM public.categories WHERE name = 'Máquinas Agrícolas' LIMIT 1),
    189.90,
    'Pulverizador costal de 20 litros com bomba de pressão manual. Alças acolchoadas para conforto, bico regulável e válvula de segurança.',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
    20,
    false
  ),
  (
    'Motobomba 2"',
    'Buffalo',
    (SELECT id FROM public.categories WHERE name = 'Motobombas' LIMIT 1),
    899.90,
    'Motobomba de 2 polegadas para água limpa, vazão de até 30.000 L/h. Motor a gasolina de 4 tempos, ideal para irrigação, drenagem e transferência de água.',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
    4,
    true
  ),
  (
    'Compactador de Solo',
    'Buffalo',
    (SELECT id FROM public.categories WHERE name = 'Equipamentos de Construção Civil' LIMIT 1),
    2499.90,
    'Compactador de solo vibratório com motor a gasolina, ideal para compactação de solos, asfalto e bases. Alta força de impacto e placa robusta.',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    3,
    false
  ),
  -- Toyama products
  (
    'Gerador 3000W',
    'Toyama',
    (SELECT id FROM public.categories WHERE name = 'Motores e Geradores' LIMIT 1),
    1899.90,
    'Gerador portátil de 3000W com motor a gasolina 4 tempos. Saída 110V/220V, indicador de nível de combustível, proteção contra sobrecarga e baixo nível de ruído.',
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
    7,
    true
  ),
  (
    'Motosserra 52CC',
    'Toyama',
    (SELECT id FROM public.categories WHERE name = 'Limpeza e Jardinagem' LIMIT 1),
    799.90,
    'Motosserra a gasolina de 52cc com barra de 20 polegadas. Sistema anti-vibração, freio de corrente automático e tanque de óleo automático.',
    'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=800',
    10,
    true
  ),
  (
    'Roçadeira 52CC',
    'Toyama',
    (SELECT id FROM public.categories WHERE name = 'Limpeza e Jardinagem' LIMIT 1),
    699.90,
    'Roçadeira lateral a gasolina de 52cc, bivolt com partida manual. Acompanha cabeçote de nylon e disco de corte, alça ergonômica e cinto de segurança.',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    15,
    false
  ),
  (
    'Cortadora de Piso 14"',
    'Toyama',
    (SELECT id FROM public.categories WHERE name = 'Equipamentos de Construção Civil' LIMIT 1),
    3299.90,
    'Cortadora de piso profissional com disco de 14 polegadas, motor a gasolina potente. Sistema de refrigeração por água, corte até 125mm de profundidade.',
    'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800',
    2,
    true
  );