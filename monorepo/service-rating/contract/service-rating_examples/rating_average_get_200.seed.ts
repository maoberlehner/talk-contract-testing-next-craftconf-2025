#!/usr/bin/env node

import { serviceRating } from "../utils/api-client.ts";

await serviceRating.POST("/ratings", {
  body: {
    productId: "b5f8eaf6-4a0a-4147-b7ff-496b61a8afa7",
    score: 4,
  },
});
await serviceRating.POST("/ratings", {
  body: {
    productId: "b5f8eaf6-4a0a-4147-b7ff-496b61a8afa7",
    score: 2,
  },
});
await serviceRating.POST("/ratings", {
  body: {
    productId: "c948e4bc-10a4-4d9e-98e2-31ac823ab61d",
    score: 5,
  },
});
