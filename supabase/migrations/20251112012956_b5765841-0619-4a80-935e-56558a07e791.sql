-- ============================================
-- FASE 1: FUNDAÇÃO DE DADOS
-- ============================================

-- 1. ADICIONAR CAMPOS FALTANTES EM TABELAS EXISTENTES

-- Categories: adicionar slug e icon_type
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS icon_type text DEFAULT 'icone' CHECK (icon_type IN ('icone', 'imagem'));

-- Criar índice único para slug em categories
CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_key ON public.categories(slug);

-- Products: adicionar slug, sku, short_description, long_description e renomear specs para attributes
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS sku text,
ADD COLUMN IF NOT EXISTS short_description text,
ADD COLUMN IF NOT EXISTS long_description text;

-- Renomear specs para attributes (se specs existir)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'specs'
  ) THEN
    ALTER TABLE public.products RENAME COLUMN specs TO attributes;
  END IF;
END $$;

-- Criar índices únicos para slug e sku em products
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_key ON public.products(slug);
CREATE UNIQUE INDEX IF NOT EXISTS products_sku_key ON public.products(sku);

-- ============================================
-- 2. CRIAR NOVAS TABELAS
-- ============================================

-- Tabela: downloads_produto
CREATE TABLE IF NOT EXISTS public.downloads_produto (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('manual', 'catalogo', 'ficha_pdf')),
  title text,
  file_url text NOT NULL,
  sort integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS downloads_produto_product_id_idx ON public.downloads_produto(product_id);
CREATE INDEX IF NOT EXISTS downloads_produto_kind_idx ON public.downloads_produto(kind);

-- Tabela: orders
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_city_uf text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric NOT NULL,
  status text NOT NULL DEFAULT 'aguardando_contato' CHECK (status IN ('aguardando_contato', 'em_atendimento', 'faturado', 'entregue')),
  source text DEFAULT 'whatsapp',
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at DESC);

-- Tabela: wishlist
CREATE TABLE IF NOT EXISTS public.wishlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS wishlist_user_id_idx ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS wishlist_product_id_idx ON public.wishlist(product_id);

-- Tabela: newsletter_inscritos
CREATE TABLE IF NOT EXISTS public.newsletter_inscritos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS newsletter_email_idx ON public.newsletter_inscritos(email);

-- Tabela: coupons
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  percent_off numeric CHECK (percent_off >= 0 AND percent_off <= 100),
  amount_off numeric CHECK (amount_off >= 0),
  applies_to jsonb DEFAULT '{}'::jsonb,
  valid_from timestamp with time zone,
  valid_to timestamp with time zone,
  enabled boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CHECK (
    (percent_off IS NOT NULL AND amount_off IS NULL) OR
    (percent_off IS NULL AND amount_off IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS coupons_code_idx ON public.coupons(code);
CREATE INDEX IF NOT EXISTS coupons_enabled_idx ON public.coupons(enabled);

-- ============================================
-- 3. HABILITAR RLS EM TODAS AS NOVAS TABELAS
-- ============================================

ALTER TABLE public.downloads_produto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_inscritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. POLÍTICAS RLS - downloads_produto
-- ============================================

CREATE POLICY "Downloads são visíveis por todos"
ON public.downloads_produto
FOR SELECT
USING (true);

CREATE POLICY "Apenas admins podem inserir downloads"
ON public.downloads_produto
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Apenas admins podem atualizar downloads"
ON public.downloads_produto
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Apenas admins podem deletar downloads"
ON public.downloads_produto
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 5. POLÍTICAS RLS - orders
-- ============================================

CREATE POLICY "Usuários podem ver seus próprios pedidos"
ON public.orders
FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Qualquer um pode criar pedidos"
ON public.orders
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Apenas admins podem atualizar pedidos"
ON public.orders
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Apenas admins podem deletar pedidos"
ON public.orders
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 6. POLÍTICAS RLS - wishlist
-- ============================================

CREATE POLICY "Usuários podem ver seus próprios favoritos"
ON public.wishlist
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem adicionar aos favoritos"
ON public.wishlist
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem remover dos favoritos"
ON public.wishlist
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 7. POLÍTICAS RLS - newsletter_inscritos
-- ============================================

CREATE POLICY "Newsletter são visíveis apenas para admins"
ON public.newsletter_inscritos
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Qualquer um pode se inscrever na newsletter"
ON public.newsletter_inscritos
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Apenas admins podem deletar inscritos"
ON public.newsletter_inscritos
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 8. POLÍTICAS RLS - coupons
-- ============================================

CREATE POLICY "Cupons são visíveis por todos"
ON public.coupons
FOR SELECT
USING (true);

CREATE POLICY "Apenas admins podem criar cupons"
ON public.coupons
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Apenas admins podem atualizar cupons"
ON public.coupons
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Apenas admins podem deletar cupons"
ON public.coupons
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- 9. FUNÇÕES AUXILIARES PARA SLUGS
-- ============================================

-- Função para gerar slug a partir de texto
CREATE OR REPLACE FUNCTION public.slugify(text_input text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        unaccent(trim(text_input)),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
END;
$$;

-- Trigger para gerar slug automaticamente em categories
CREATE OR REPLACE FUNCTION public.generate_category_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.slugify(NEW.name);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER category_slug_trigger
BEFORE INSERT OR UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.generate_category_slug();

-- Trigger para gerar slug automaticamente em products
CREATE OR REPLACE FUNCTION public.generate_product_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.slugify(NEW.name);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER product_slug_trigger
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.generate_product_slug();