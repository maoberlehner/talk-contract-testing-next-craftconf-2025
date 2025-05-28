import createClient from "openapi-fetch";

import type { paths as serviceProductPaths } from "../service-product.d.ts";

export const serviceProduct = createClient<serviceProductPaths>({
  baseUrl:
    process.env.SERVICE_GATEWAY_URL || process.env.SERVICE_SHOPPING_PRODUCT_URL,
});
