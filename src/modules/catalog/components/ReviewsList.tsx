import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Rating } from "./Rating";
import { Review } from "../types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquare } from "lucide-react";

interface ReviewsListProps {
  reviews: Review[];
  averageRating: number;
  count: number;
}

export function ReviewsList({ reviews, averageRating, count }: ReviewsListProps) {
  if (count === 0) {
    return (
      <Card className="p-8 text-center">
        <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
        <h3 className="font-semibold text-lg mb-2">Ainda não há avaliações</h3>
        <p className="text-muted-foreground">
          Seja o primeiro a avaliar este produto!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-1">
                {averageRating.toFixed(1)}
              </div>
              <Rating rating={averageRating} size="lg" />
              <p className="text-sm text-muted-foreground mt-2">
                {count} {count === 1 ? "avaliação" : "avaliações"}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold">{review.author_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(review.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
                <Rating rating={review.rating} size="sm" />
              </div>
              <p className="text-foreground leading-relaxed">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
