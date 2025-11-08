-- 1. Create product_media table
CREATE TABLE IF NOT EXISTS public.product_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('image', 'video')),
  url text NOT NULL,
  alt text,
  sort integer NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_product_media_product_sort 
  ON public.product_media(product_id, sort);

-- 3. Enable RLS
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for product_media
CREATE POLICY "Media is viewable by everyone"
  ON public.product_media
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert media"
  ON public.product_media
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update media"
  ON public.product_media
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete media"
  ON public.product_media
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Migrate existing product images to product_media
DO $$
DECLARE
  product_record RECORD;
  img_url text;
  img_index integer;
BEGIN
  FOR product_record IN 
    SELECT id, image_url, additional_images 
    FROM public.products 
    WHERE image_url IS NOT NULL
  LOOP
    -- Insert main image as primary
    INSERT INTO public.product_media (
      product_id, kind, url, alt, sort, is_primary
    ) VALUES (
      product_record.id,
      'image',
      product_record.image_url,
      'Imagem principal',
      0,
      true
    );

    -- Insert additional images if they exist
    IF product_record.additional_images IS NOT NULL THEN
      img_index := 1;
      FOREACH img_url IN ARRAY product_record.additional_images
      LOOP
        INSERT INTO public.product_media (
          product_id, kind, url, alt, sort, is_primary
        ) VALUES (
          product_record.id,
          'image',
          img_url,
          'Imagem adicional',
          img_index,
          false
        );
        img_index := img_index + 1;
      END LOOP;
    END IF;
  END LOOP;
END $$;

-- 6. Update storage bucket to accept video files
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'video/mp4', 'video/webm']
WHERE id = 'product-images';