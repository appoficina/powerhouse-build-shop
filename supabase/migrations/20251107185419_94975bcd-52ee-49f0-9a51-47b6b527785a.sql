-- Add specs column to products table
ALTER TABLE public.products 
ADD COLUMN specs jsonb DEFAULT '{}'::jsonb;

-- Create reviews table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create index for faster product reviews queries
CREATE INDEX reviews_product_id_idx ON public.reviews(product_id);
CREATE INDEX reviews_created_at_idx ON public.reviews(created_at DESC);

-- Enable RLS (but no policies as requested)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Reviews are viewable by everyone"
ON public.reviews FOR SELECT
USING (true);

-- Anyone can insert reviews (no auth required for MVP)
CREATE POLICY "Anyone can insert reviews"
ON public.reviews FOR INSERT
WITH CHECK (true);

COMMENT ON TABLE public.reviews IS 'Product reviews - public read/write for MVP';
COMMENT ON COLUMN public.products.specs IS 'Product specifications in JSON format';
