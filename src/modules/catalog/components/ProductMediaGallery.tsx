import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { ProductMedia } from "../types/media";

interface ProductMediaGalleryProps {
  media: ProductMedia[];
  productName: string;
}

export function ProductMediaGallery({ media, productName }: ProductMediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    // Reset to first item when media changes
    setSelectedIndex(0);
  }, [media]);

  if (!media || media.length === 0) {
    return (
      <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Nenhuma imagem disponível</p>
      </div>
    );
  }

  const selectedMedia = media[selectedIndex];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
  };

  const renderMainMedia = () => {
    if (selectedMedia.kind === "video") {
      const isYouTube = selectedMedia.url.includes("youtube.com") || selectedMedia.url.includes("youtu.be");
      const isVimeo = selectedMedia.url.includes("vimeo.com");

      if (isYouTube || isVimeo) {
        // Extract video ID and build embed URL
        let embedUrl = selectedMedia.url;
        if (isYouTube) {
          const videoId = selectedMedia.url.split("v=")[1]?.split("&")[0] || 
                         selectedMedia.url.split("youtu.be/")[1]?.split("?")[0];
          embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
        } else if (isVimeo) {
          const videoId = selectedMedia.url.split("vimeo.com/")[1]?.split("?")[0];
          embedUrl = `https://player.vimeo.com/video/${videoId}`;
        }

        return (
          <div className="aspect-square bg-black rounded-lg overflow-hidden">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={selectedMedia.alt || `Vídeo ${productName}`}
            />
          </div>
        );
      }

      // Native video player for uploaded videos
      return (
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          <video
            src={selectedMedia.url}
            poster={selectedMedia.meta?.poster}
            controls
            playsInline
            className="w-full h-full object-cover"
            aria-label={selectedMedia.alt || `Vídeo ${productName}`}
          >
            Seu navegador não suporta reprodução de vídeo.
          </video>
        </div>
      );
    }

    // Image with zoom
    return (
      <Zoom>
        <div className="aspect-square bg-muted rounded-lg overflow-hidden cursor-zoom-in">
          <img
            src={selectedMedia.url}
            alt={selectedMedia.alt || `${productName} - imagem ${selectedIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading={selectedIndex === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        </div>
      </Zoom>
    );
  };

  return (
    <div 
      className="space-y-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Galeria de imagens do produto"
    >
      {/* Main Media Display */}
      <div className="relative group">
        {renderMainMedia()}

        {/* Navigation Arrows */}
        {media.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handlePrevious}
              aria-label="Mídia anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleNext}
              aria-label="Próxima mídia"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Media Counter */}
        {media.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {media.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {media.length > 1 && (
        <div 
          className="grid grid-cols-4 md:grid-cols-6 gap-2"
          role="tablist"
          aria-label="Miniaturas da galeria"
        >
          {media.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setSelectedIndex(index)}
              role="tab"
              aria-selected={selectedIndex === index}
              aria-label={`Ver ${item.kind === 'video' ? 'vídeo' : 'imagem'} ${index + 1}`}
              className={cn(
                "aspect-square rounded-md overflow-hidden border-2 transition-all relative",
                selectedIndex === index
                  ? "border-accent scale-105 shadow-glow"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
            >
              {item.kind === "video" ? (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Play className="h-6 w-6 text-muted-foreground" />
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.alt || `Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
