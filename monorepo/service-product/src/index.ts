import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { createHonoOpenApiRouter } from "openapi-ts-router";
import { zValidator } from "validation-adapters/zod";
import z from "zod";

import {
  add,
  list,
  productCreateSchema,
  remove,
  update,
} from "./repositories/product.ts";
import type { paths } from "./service-product.d.ts";

const app = new Hono();
app.use(logger());

const router = createHonoOpenApiRouter<paths>(app);

router.post("/products", {
  bodyValidator: zValidator(productCreateSchema),
  handler: async (c) => {
    const item = await c.req.valid("json");
    return c.json(await add(item), 201);
  },
});

router.get("/products", {
  queryValidator: zValidator(
    z.object({
      name: z.string().optional(),
    })
  ),
  handler: async (c) => {
    const { name } = c.req.valid("query");
    return c.json(await list(name ? { filter: { name } } : undefined));
  },
});

router.put("/products/:productId", {
  bodyValidator: zValidator(productCreateSchema),
  pathValidator: zValidator(
    z.object({
      productId: z.string(),
    })
  ),
  handler: async (c) => {
    const item = await c.req.valid("json");
    const { productId } = c.req.valid("param");
    return c.json(await update(productId, item));
  },
});

router.del("/products/:productId", {
  pathValidator: zValidator(
    z.object({
      productId: z.string(),
    })
  ),
  handler: async (c) => {
    const { productId } = c.req.valid("param");
    await remove(productId);
    return c.json({ deleted: true }, 200);
  },
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
