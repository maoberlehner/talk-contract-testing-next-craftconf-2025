#!/usr/bin/env node

import { faker } from "@faker-js/faker";
import { serviceShoppingList } from "../utils/api-client.ts";

await serviceShoppingList.POST("/shopping-list/items", {
  body: {
    productId: faker.string.uuid(),
    name: faker.food.ingredient(),
    completed: false,
  },
});
await serviceShoppingList.POST("/shopping-list/items", {
  body: {
    productId: faker.string.uuid(),
    name: faker.food.ingredient(),
    completed: false,
  },
});
await serviceShoppingList.POST("/shopping-list/items", {
  body: {
    productId: faker.string.uuid(),
    name: faker.food.ingredient(),
    completed: false,
  },
});
