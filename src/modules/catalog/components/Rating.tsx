import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  className?: string;
}

export function Rating({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  showNumber = false,
  className 
}: RatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            i < Math.floor(rating)
              ? "fill-accent text-accent"
              : i < rating
              ? "fill-accent/50 text-accent"
              : "fill-muted text-muted"
          )}
        />
      ))}
      {showNumber && (
        <span className="ml-1 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
