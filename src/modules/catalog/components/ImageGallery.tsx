import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  };

  const scrollNext = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  };

  const scrollTo = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
      setSelectedIndex(index);
    }
  };

  // If only one image, show it without carousel controls
  if (images.length === 1) {
    return (
      <div className="space-y-4">
        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
          <img
            src={images[0]}
            alt={alt}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
            loading="eager"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image with Carousel */}
      <div className="relative group">
        <div className="overflow-hidden rounded-lg" ref={emblaRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div key={index} className="relative flex-[0_0_100%]">
                <div className="aspect-square bg-muted">
                  <img
                    src={image}
                    alt={`${alt} - imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={scrollPrev}
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={scrollNext}
              aria-label="Próxima imagem"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "aspect-square rounded-md overflow-hidden border-2 transition-all",
                selectedIndex === index
                  ? "border-accent scale-105 shadow-glow"
                  : "border-transparent hover:border-muted-foreground/30"
              )}
              aria-label={`Ver imagem ${index + 1}`}
            >
              <img
                src={image}
                alt={`${alt} - miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
