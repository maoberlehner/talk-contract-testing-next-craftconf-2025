import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { createHonoOpenApiRouter } from "openapi-ts-router";
import { zValidator } from "validation-adapters/zod";
import z from "zod";

import {
  add,
  list,
  remove,
  update,
  getAverage,
  ratingCreateSchema,
} from "./repositories/rating.ts";
import type { paths } from "./service-rating.d.ts";

const app = new Hono();
app.use(logger());

const router = createHonoOpenApiRouter<paths>(app);

router.post("/ratings", {
  bodyValidator: zValidator(ratingCreateSchema),
  handler: async (c) => {
    const rating = await c.req.valid("json");
    return c.json(await add(rating), 201);
  },
});

router.get("/ratings", {
  queryValidator: zValidator(
    z.object({
      productId: z.string().optional(),
    })
  ),
  handler: async (c) => {
    const { productId } = c.req.valid("query");
    return c.json(
      await list(productId ? { filter: { productId } } : undefined)
    );
  },
});

router.put("/ratings/:ratingId", {
  bodyValidator: zValidator(ratingCreateSchema),
  pathValidator: zValidator(
    z.object({
      ratingId: z.string(),
    })
  ),
  handler: async (c) => {
    const rating = await c.req.valid("json");
    const { ratingId } = c.req.valid("param");
    return c.json(await update(ratingId, rating));
  },
});

router.del("/ratings/:ratingId", {
  pathValidator: zValidator(
    z.object({
      ratingId: z.string(),
    })
  ),
  handler: async (c) => {
    const { ratingId } = c.req.valid("param");
    await remove(ratingId);
    return c.json({ deleted: true }, 200);
  },
});

// @ts-expect-error query parameters not in the OpenAPI spec are expected here.
router.get("/ratings/average/:productId", {
  pathValidator: zValidator(
    z.object({
      productId: z.string(),
    })
  ),
  handler: async (c) => {
    const { productId } = c.req.valid("param");
    return c.json(await getAverage(productId));
  },
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
