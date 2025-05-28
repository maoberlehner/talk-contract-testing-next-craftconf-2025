import createClient from "openapi-fetch";

import type { paths as serviceRatingPaths } from "../../src/service-product.d.ts";

export const serviceProduct = createClient<serviceRatingPaths>({
  baseUrl: "http://localhost:3200",
});
