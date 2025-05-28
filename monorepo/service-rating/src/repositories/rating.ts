import { randomUUID } from "node:crypto";
import type { components } from "../service-rating.d.ts";

export type Rating = components["schemas"]["RatingResponse"];
export type RatingCreate = components["schemas"]["RatingRequest"];
export type AverageRating = components["schemas"]["AverageRatingResponse"];

let ratings: Rating[] = [];

export const add = async (rating: RatingCreate): Promise<Rating> => {
  const ratingNew: Rating = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...rating,
  };
  ratings.push(ratingNew);
  return ratingNew;
};

export const list = async (options?: {
  filter?: { productId?: string };
}): Promise<Rating[]> => {
  if (options?.filter?.productId) {
    return ratings.filter((r) => r.productId === options.filter!.productId);
  }
  return ratings;
};

export const update = async (
  id: Rating["id"],
  ratingPartial: Partial<RatingCreate>
): Promise<Rating> => {
  const rating = ratings.find((x) => x.id === id);
  if (!rating) throw new Error(`Rating with id ${id} does not exist!`);

  const ratingUpdated: Rating = {
    ...rating,
    ...ratingPartial,
  };

  ratings = ratings.map((r) => {
    if (r.id !== id) return r;
    return ratingUpdated;
  });

  return ratingUpdated;
};

export const remove = async (id: Rating["id"]): Promise<void> => {
  ratings = ratings.filter((r) => r.id !== id);
};

export const getAverageRating = async (
  productId: string
): Promise<AverageRating> => {
  const productRatings = ratings.filter((r) => r.productId === productId);

  if (productRatings.length === 0) {
    return {
      productId,
      averageScore: 0,
      totalRatings: 0,
    };
  }

  const totalScore = productRatings.reduce((sum, r) => sum + r.score, 0);
  const averageScore = totalScore / productRatings.length;

  return {
    productId,
    averageScore: Math.round(averageScore * 10) / 10,
    totalRatings: productRatings.length,
  };
};
