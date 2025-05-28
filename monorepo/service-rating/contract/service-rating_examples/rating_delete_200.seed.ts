#!/usr/bin/env node

import { serviceRating } from "../utils/api-client.ts";

await serviceRating.POST("/ratings", {
  body: {
    productId: "79b03f92-f834-4c59-ac49-8da420ec9b2b",
    score: 4,
  },
});
