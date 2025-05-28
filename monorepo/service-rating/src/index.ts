import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import {
  add,
  list,
  remove,
  update,
  getAverageRating,
  type RatingCreate,
} from "./repositories/rating.ts";

const app = new Hono();
app.use(logger());

app.post("/ratings", async (c) => {
  const rating = await c.req.json<RatingCreate>();
  return c.json(await add(rating), 201);
});

app.get("/ratings", async (c) => {
  const productId = c.req.query("productId");
  return c.json(await list(productId ? { filter: { productId } } : undefined));
});

app.put("/ratings/:id", async (c) => {
  const rating = await c.req.json<RatingCreate>();
  const id = c.req.param("id");
  return c.json(await update(id, rating));
});

app.delete("/ratings/:id", async (c) => {
  const id = c.req.param("id");
  await remove(id);
  return c.json({ deleted: true }, 200);
});

app.get("/ratings/average/:productId", async (c) => {
  const productId = c.req.param("productId");
  return c.json(await getAverageRating(productId));
});

app.get("/ratings/health", async (c) => {
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
