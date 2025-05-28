#!/usr/bin/env node

import { serviceShoppingList } from "../utils/api-client.ts";

await serviceShoppingList.POST("/shopping-list/items", {
  body: {
    id: "682e1b81-39a3-4e7c-a003-65d4073875e5",
    productId: "4065662f-a4a5-468a-86e9-1ea852458abc",
    name: "Bread",
    quantity: 1,
    completed: false,
  },
});
