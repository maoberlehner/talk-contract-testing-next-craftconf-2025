import { randomUUID } from "node:crypto";
import z from "zod";

import type { components } from "../service-product.d.ts";

export const productSchema: z.ZodType<
  components["schemas"]["ProductResponse"]
> = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string().optional(),
});
export type Product = z.infer<typeof productSchema>;

export const productCreateSchema: z.ZodType<
  components["schemas"]["ProductRequest"]
> = z.object({
  name: z.string(),
  brand: z.string().optional(),
});
export type ProductCreate = z.infer<typeof productCreateSchema>;

let products: Product[] = [];

export const add = async (product: ProductCreate): Promise<Product> => {
  const productNew = {
    id: randomUUID(),
    ...product,
  };
  products.push(productNew);

  return productNew;
};

export const list = async ({
  filter,
}: { filter?: { name: Product["name"] } } = {}): Promise<Product[]> => {
  return products.filter((p) => p.name === filter?.name || p.name);
};

export const update = async (
  id: Product["id"],
  productPartial: Partial<ProductCreate>
): Promise<Product> => {
  const product = products.find((x) => x.id === id);
  if (!product) throw new Error(`Product with id ${id} does not exist!`);

  const productUpdated = {
    ...product,
    ...productPartial,
  };

  products = products.map((p) => {
    if (p.id !== id) return p;
    return productUpdated;
  });

  return productUpdated;
};

export const remove = async (id: Product["id"]): Promise<void> => {
  products = products.filter((p) => p.id !== id);
};
