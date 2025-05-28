#!/usr/bin/env node

import { faker } from "@faker-js/faker";

import { serviceRating } from "../utils/api-client.ts";

await serviceRating.POST("/ratings", {
  body: {
    productId: faker.string.uuid(),
    score: faker.number.int({ min: 1, max: 5 }),
  },
});
await serviceRating.POST("/ratings", {
  body: {
    productId: faker.string.uuid(),
    score: faker.number.int({ min: 1, max: 5 }),
  },
});
await serviceRating.POST("/ratings", {
  body: {
    productId: faker.string.uuid(),
    score: faker.number.int({ min: 1, max: 5 }),
  },
});
