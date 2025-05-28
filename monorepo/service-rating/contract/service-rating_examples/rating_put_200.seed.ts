#!/usr/bin/env node

import { serviceRating } from "../utils/api-client.ts";

await serviceRating.POST("/ratings", {
  body: {
    id: "866f1317-4b78-4c1a-b403-dccad2ef8d07",
    productId: "544e551e-d6aa-4298-be3d-01b67f3e9a64",
    score: 4,
  },
});
