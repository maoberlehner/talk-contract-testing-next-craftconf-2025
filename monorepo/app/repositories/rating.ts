import createClient from "openapi-fetch";
import type { paths, components } from "./service-rating";

const client = createClient<paths>({
  baseUrl:
    process.env.SERVICE_GATEWAY_URL ||
    process.env.SERVICE_RATING_URL ||
    "http://localhost:3300",
});

export type Rating = components["schemas"]["RatingResponse"];
export type CreateRatingRequest = components["schemas"]["RatingRequest"];
export type AverageRating = components["schemas"]["AverageRatingResponse"];

export const createRating = async (
  rating: CreateRatingRequest
): Promise<Rating> => {
  const { data, error } = await client.POST("/ratings", {
    body: rating,
  });

  if (error)
    throw new Error(`Failed to create rating: ${JSON.stringify(error)}`);
  if (!data) throw new Error("No data returned from create rating");

  return data;
};

export const getAverageRating = async (
  productId: string
): Promise<AverageRating> => {
  const { data, error } = await client.GET("/ratings/average/{productId}", {
    params: {
      path: { productId },
    },
  });

  if (error)
    throw new Error(`Failed to fetch average rating: ${JSON.stringify(error)}`);
  if (!data) throw new Error("No data returned from average rating");

  return data;
};
