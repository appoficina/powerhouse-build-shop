import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ProductMedia, MediaUploadInput } from "../types/media";

export function useProductMediaMutations(productId: string) {
  const queryClient = useQueryClient();

  const uploadMedia = useMutation({
    mutationFn: async (inputs: MediaUploadInput[]) => {
      const results: ProductMedia[] = [];

      for (const input of inputs) {
        let mediaUrl = input.url;

        // Upload file to storage if provided
        if (input.file) {
          const fileExt = input.file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `products/${productId}/${input.sort.toString().padStart(2, '0')}-${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, input.file, { upsert: true });

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          mediaUrl = urlData.publicUrl;
        }

        if (!mediaUrl) throw new Error("No URL provided for media");

        // Insert into product_media table
        const { data, error } = await supabase
          .from("product_media")
          .insert({
            product_id: productId,
            kind: input.kind,
            url: mediaUrl,
            alt: input.alt || null,
            sort: input.sort,
            is_primary: input.is_primary,
            meta: input.meta || {},
          })
          .select()
          .single();

        if (error) throw error;
        results.push(data as ProductMedia);
      }

      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-media", productId] });
      toast({ title: "Mídia adicionada com sucesso" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao adicionar mídia", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateMedia = useMutation({
    mutationFn: async (media: Partial<ProductMedia> & { id: string }) => {
      const { data, error } = await supabase
        .from("product_media")
        .update({
          alt: media.alt,
          sort: media.sort,
          is_primary: media.is_primary,
          meta: media.meta,
        })
        .eq("id", media.id)
        .select()
        .single();

      if (error) throw error;
      return data as ProductMedia;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-media", productId] });
      toast({ title: "Mídia atualizada com sucesso" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao atualizar mídia", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const deleteMedia = useMutation({
    mutationFn: async (mediaId: string) => {
      const { error } = await supabase
        .from("product_media")
        .delete()
        .eq("id", mediaId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-media", productId] });
      toast({ title: "Mídia removida com sucesso" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao remover mídia", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const setPrimaryMedia = useMutation({
    mutationFn: async (mediaId: string) => {
      // First, unset all primary flags for this product
      await supabase
        .from("product_media")
        .update({ is_primary: false })
        .eq("product_id", productId);

      // Then set the new primary
      const { error } = await supabase
        .from("product_media")
        .update({ is_primary: true })
        .eq("id", mediaId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-media", productId] });
      toast({ title: "Imagem principal definida" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao definir imagem principal", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const reorderMedia = useMutation({
    mutationFn: async (mediaItems: { id: string; sort: number }[]) => {
      const updates = mediaItems.map(item =>
        supabase
          .from("product_media")
          .update({ sort: item.sort })
          .eq("id", item.id)
      );

      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-media", productId] });
      toast({ title: "Ordem atualizada com sucesso" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Erro ao reordenar mídia", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  return {
    uploadMedia,
    updateMedia,
    deleteMedia,
    setPrimaryMedia,
    reorderMedia,
  };
}
