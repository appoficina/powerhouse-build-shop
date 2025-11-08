export type MediaKind = 'image' | 'video';

export interface ProductMedia {
  id: string;
  product_id: string;
  kind: MediaKind;
  url: string;
  alt: string | null;
  sort: number;
  is_primary: boolean;
  meta: {
    width?: number;
    height?: number;
    duration?: number;
    provider?: 'youtube' | 'vimeo' | 'upload';
    poster?: string;
  };
  created_at: string;
}

export interface MediaUploadInput {
  file?: File;
  url?: string;
  kind: MediaKind;
  alt?: string;
  sort: number;
  is_primary: boolean;
  meta?: ProductMedia['meta'];
}
