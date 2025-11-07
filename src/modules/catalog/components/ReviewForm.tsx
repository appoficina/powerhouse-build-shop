import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const reviewSchema = z.object({
  author_name: z
    .string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  rating: z.number().min(1, "Selecione uma avaliação").max(5),
  comment: z
    .string()
    .trim()
    .min(10, "Comentário deve ter pelo menos 10 caracteres")
    .max(1000, "Comentário deve ter no máximo 1000 caracteres"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        author_name: data.author_name,
        rating: data.rating,
        comment: data.comment,
      });

      if (error) throw error;

      toast.success("Avaliação enviada com sucesso!");
      reset();
      setSelectedRating(0);
      
      // Invalidate reviews query to refetch
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    } catch (error) {
      toast.error("Erro ao enviar avaliação. Tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue("rating", rating, { shouldValidate: true });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deixe sua avaliação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <div>
            <Label htmlFor="author_name">Seu nome</Label>
            <Input
              id="author_name"
              {...register("author_name")}
              placeholder="Digite seu nome"
              disabled={isSubmitting}
            />
            {errors.author_name && (
              <p className="text-sm text-destructive mt-1">
                {errors.author_name.message}
              </p>
            )}
          </div>

          {/* Rating Selector */}
          <div>
            <Label>Sua avaliação</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRatingClick(rating)}
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={isSubmitting}
                  className="transition-transform hover:scale-110 focus-visible:scale-110 disabled:opacity-50"
                  aria-label={`${rating} estrelas`}
                >
                  <Star
                    className={cn(
                      "h-8 w-8",
                      rating <= (hoveredRating || selectedRating)
                        ? "fill-accent text-accent"
                        : "fill-muted text-muted"
                    )}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-sm text-destructive mt-1">
                {errors.rating.message}
              </p>
            )}
          </div>

          {/* Comment Textarea */}
          <div>
            <Label htmlFor="comment">Seu comentário</Label>
            <Textarea
              id="comment"
              {...register("comment")}
              placeholder="Conte sua experiência com o produto..."
              rows={4}
              disabled={isSubmitting}
            />
            {errors.comment && (
              <p className="text-sm text-destructive mt-1">
                {errors.comment.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
