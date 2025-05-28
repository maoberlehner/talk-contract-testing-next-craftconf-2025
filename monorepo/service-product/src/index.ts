import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";

import {
  add,
  list,
  remove,
  update,
  type ProductCreate,
} from "./repositories/product.ts";

const app = new Hono();
app.use(logger());

app.post("/products", async (c) => {
  const item = await c.req.json<ProductCreate>();
  return c.json(await add(item), 201);
});

app.get("/products", async (c) => {
  const name = c.req.param("name");
  return c.json(await list(name ? { filter: { name } } : undefined));
});

app.put("/products/:id", async (c) => {
  const item = await c.req.json<ProductCreate>();
  const id = c.req.param("id");
  return c.json(await update(id, item));
});

app.delete("/products/:id", async (c) => {
  const id = c.req.param("id");
  await remove(id);
  return c.json({ deleted: true }, 200);
});

app.get("/products/health", async (c) => {
  return c.json({ healthy: true });
});

serve(
  {
    fetch: app.fetch,
    port: process.env.PORT ? Number(process.env.PORT) : 8080,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
