#!/usr/bin/env node

import { serviceProduct } from "../utils/api-client.ts";

await serviceProduct.POST("/products", {
  body: {
    id: "a9068872-9017-47bf-a1d4-c8ba70d99bd5",
    name: "Bread",
  },
});
