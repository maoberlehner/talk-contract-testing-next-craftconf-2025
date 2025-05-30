import { randomUUID } from "node:crypto";
import type { components } from "../service-shopping-list.d.ts";
import { serviceProduct } from "../utils/api-client.ts";
import z from "zod";

export const itemSchema: z.ZodType<
  components["schemas"]["ShoppingListItemResponse"]
> = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number(),
  name: z.string(),
  completed: z.boolean(),
});
export type Item = z.infer<typeof itemSchema>;

export const itemCreateSchema: z.ZodType<
  components["schemas"]["ShoppingListItemRequest"]
> = z.object({
  id: z.string().optional(),
  productId: z.string().optional(),
  quantity: z.number().optional(),
  name: z.string(),
  completed: z.boolean(),
});
export type ItemCreate = z.infer<typeof itemCreateSchema>;

let items: Item[] = [];

export const add = async (item: ItemCreate): Promise<Item> => {
  // TODO repository
  const { data: products } = await serviceProduct.GET("/products", {
    params: { query: { name: item.name } },
  });
  let product = products?.[0];
  if (!product) {
    const { data: productNew } = await serviceProduct.POST("/products", {
      body: {
        name: item.name,
      },
    });
    product = productNew;
    // TODO
    if (!product) throw new Error();
  }

  const itemNew = {
    id: randomUUID(),
    productId: product.id,
    quantity: 1,
    ...item,
  };
  items.push(itemNew);

  return itemNew;
};

export const list = async (): Promise<Item[]> => {
  return items;
};

export const update = async (
  id: Item["id"],
  itemPartial: Partial<ItemCreate>
): Promise<Item> => {
  const item = items.find((x) => x.id === id);
  if (!item) throw new Error(`Item with id ${id} does not exist!`);

  const itemUpdated = {
    ...item,
    ...itemPartial,
  };

  items = items.map((item) => {
    if (item.id !== id) return item;
    return itemUpdated;
  });

  return itemUpdated;
};

export const remove = async (id: Item["id"]): Promise<void> => {
  items = items.filter((item) => item.id !== id);
};
