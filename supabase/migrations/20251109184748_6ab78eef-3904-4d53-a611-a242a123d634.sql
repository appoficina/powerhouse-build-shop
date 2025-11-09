-- Create storage bucket for site images (categories and hero)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp']
);

-- Storage policies for site-images bucket
CREATE POLICY "Site images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'site-images');

CREATE POLICY "Admins can upload site images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'site-images' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update site images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'site-images' 
  AND has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete site images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'site-images' 
  AND has_role(auth.uid(), 'admin')
);

-- Add image_url to categories (nullable - if null, use icon)
ALTER TABLE public.categories
ADD COLUMN image_url text;

-- Add hero_image_url to settings
ALTER TABLE public.settings
ADD COLUMN hero_image_url text;

-- Add hero_title and hero_subtitle to settings for customization
ALTER TABLE public.settings
ADD COLUMN hero_title text DEFAULT 'Ferramentas e Equipamentos Profissionais',
ADD COLUMN hero_subtitle text DEFAULT 'As melhores marcas para seu trabalho: Tssaper, Buffalo e Toyama';