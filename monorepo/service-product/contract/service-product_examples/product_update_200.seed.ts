#!/usr/bin/env node

import { serviceProduct } from "../utils/api-client.ts";

await serviceProduct.POST("/products", {
  body: {
    id: "21de4698-6f2f-40a6-847b-72125a376a1a",
    name: "Bread",
  },
});
