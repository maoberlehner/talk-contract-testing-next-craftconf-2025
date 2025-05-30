import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { createHonoOpenApiRouter } from "openapi-ts-router";
import { zValidator } from "validation-adapters/zod";
import z from "zod";

import {
  add,
  itemCreateSchema,
  list,
  remove,
  update,
} from "./repositories/item.ts";
import type { paths } from "./service-shopping-list.d.ts";

const app = new Hono();
app.use(logger());

const router = createHonoOpenApiRouter<paths>(app);

router.post("/shopping-list/items", {
  bodyValidator: zValidator(itemCreateSchema),
  handler: async (c) => {
    const item = c.req.valid("json");
    return c.json(await add(item), 201);
  },
});

router.get("/shopping-list/items", {
  handler: async (c) => {
    return c.json(await list());
  },
});

router.put("/shopping-list/items/:itemId", {
  bodyValidator: zValidator(itemCreateSchema),
  pathValidator: zValidator(
    z.object({
      itemId: z.string(),
    })
  ),
  handler: async (c) => {
    const item = c.req.valid("json");
    const { itemId } = c.req.valid("param");
    return c.json(await update(itemId, item));
  },
});

router.del("/shopping-list/items/:itemId", {
  pathValidator: zValidator(
    z.object({
      itemId: z.string(),
    })
  ),
  handler: async (c) => {
    const { itemId } = c.req.valid("param");
    await remove(itemId);
    return c.json({ deleted: true }, 200);
  },
});

app.get("/shopping-list/health", async (c) => {
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
