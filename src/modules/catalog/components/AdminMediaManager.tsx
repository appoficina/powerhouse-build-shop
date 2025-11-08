import { useState } from "react";
import { Upload, Plus, Trash2, Star, GripVertical, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ProductMedia, MediaUploadInput } from "../types/media";
import { useProductMediaQuery } from "../hooks/useProductMediaQuery";
import { useProductMediaMutations } from "../hooks/useProductMediaMutations";

interface AdminMediaManagerProps {
  productId: string;
}

export function AdminMediaManager({ productId }: AdminMediaManagerProps) {
  const { data: media = [], isLoading } = useProductMediaQuery(productId);
  const { uploadMedia, deleteMedia, setPrimaryMedia, updateMedia } = useProductMediaMutations(productId);
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlKind, setUrlKind] = useState<"image" | "video">("image");
  const [editingAlt, setEditingAlt] = useState<{ id: string; value: string } | null>(null);

  const imageCount = media.filter(m => m.kind === 'image').length;
  const videoCount = media.filter(m => m.kind === 'video').length;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const newImageCount = fileArray.filter(f => f.type.startsWith('image/')).length;
    const newVideoCount = fileArray.filter(f => f.type.startsWith('video/')).length;

    // Validate limits
    if (imageCount + newImageCount > 8) {
      alert("Máximo de 8 imagens por produto");
      return;
    }
    if (videoCount + newVideoCount > 1) {
      alert("Máximo de 1 vídeo por produto");
      return;
    }

    const inputs: MediaUploadInput[] = fileArray.map((file, index) => ({
      file,
      kind: file.type.startsWith('video/') ? 'video' : 'image',
      sort: media.length + index,
      is_primary: media.length === 0 && index === 0,
    }));

    uploadMedia.mutate(inputs);
  };

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return;

    if (urlKind === 'image' && imageCount >= 8) {
      alert("Máximo de 8 imagens por produto");
      return;
    }
    if (urlKind === 'video' && videoCount >= 1) {
      alert("Máximo de 1 vídeo por produto");
      return;
    }

    const input: MediaUploadInput = {
      url: urlInput.trim(),
      kind: urlKind,
      sort: media.length,
      is_primary: media.length === 0,
    };

    uploadMedia.mutate([input], {
      onSuccess: () => {
        setUrlInput("");
        setShowUrlDialog(false);
      }
    });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newMedia = [...media];
    const draggedItem = newMedia[draggedIndex];
    newMedia.splice(draggedIndex, 1);
    newMedia.splice(index, 0, draggedItem);

    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex === null) return;
    
    const reorderedItems = media.map((item, index) => ({
      id: item.id,
      sort: index,
    }));

    // This would need the reorderMedia mutation to be called
    setDraggedIndex(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente remover esta mídia?")) {
      deleteMedia.mutate(id);
    }
  };

  const handleSetPrimary = (id: string) => {
    setPrimaryMedia.mutate(id);
  };

  const handleAltSave = () => {
    if (!editingAlt) return;
    
    updateMedia.mutate({
      id: editingAlt.id,
      alt: editingAlt.value,
    }, {
      onSuccess: () => setEditingAlt(null)
    });
  };

  if (isLoading) {
    return <div className="p-4 text-center">Carregando mídia...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Galeria de Mídia</Label>
        <div className="flex gap-2">
          <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar URL
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Mídia por URL</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Tipo</Label>
                  <Select value={urlKind} onValueChange={(v) => setUrlKind(v as "image" | "video")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Imagem</SelectItem>
                      <SelectItem value="video">Vídeo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>URL</Label>
                  <Input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <Button onClick={handleUrlAdd} className="w-full">
                  Adicionar
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload Arquivos
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {imageCount}/8 imagens • {videoCount}/1 vídeo
      </p>

      {media.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">Nenhuma mídia adicionada</p>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Fazer Upload
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {media.map((item, index) => (
            <Card
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                "relative group cursor-move transition-all",
                item.is_primary && "ring-2 ring-accent"
              )}
            >
              {/* Thumbnail */}
              <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                {item.kind === "video" ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.alt || `Mídia ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Controls */}
              <div className="p-2 space-y-2">
                <div className="flex items-center gap-1">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">#{item.sort}</span>
                </div>

                {editingAlt?.id === item.id ? (
                  <div className="flex gap-1">
                    <Input
                      value={editingAlt.value}
                      onChange={(e) => setEditingAlt({ ...editingAlt, value: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleAltSave()}
                      className="h-7 text-xs"
                      placeholder="Alt text"
                    />
                    <Button size="sm" variant="ghost" onClick={handleAltSave}>
                      ✓
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingAlt({ id: item.id, value: item.alt || "" })}
                    className="text-xs text-muted-foreground hover:text-foreground truncate block w-full text-left"
                  >
                    {item.alt || "Adicionar alt text..."}
                  </button>
                )}

                <div className="flex gap-1">
                  {!item.is_primary && item.kind === 'image' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSetPrimary(item.id)}
                      title="Definir como capa"
                    >
                      <Star className="h-3 w-3" />
                    </Button>
                  )}
                  {item.is_primary && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled
                      title="Imagem principal"
                    >
                      <Star className="h-3 w-3 fill-accent text-accent" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
