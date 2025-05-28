import createClient from "openapi-fetch";

import type { paths as serviceRatingPaths } from "../../src/service-rating.d.ts";

export const serviceRating = createClient<serviceRatingPaths>({
  baseUrl: "http://localhost:3300",
});
