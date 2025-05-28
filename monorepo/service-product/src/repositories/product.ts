import { randomUUID } from "node:crypto";
import type { components } from "../service-product.d.ts";

export type Product = components["schemas"]["ProductResponse"];

export type ProductCreate = components["schemas"]["ProductRequest"];

let products: Product[] = [];

export const add = async (product: ProductCreate) => {
  const productNew = {
    id: randomUUID(),
    ...product,
  };
  products.push(productNew);

  return productNew;
};

export const list = async ({
  filter,
}: { filter?: { name: Product["name"] } } = {}) => {
  return products.filter((p) => p.name === filter?.name || p.name);
};

export const update = async (
  id: Product["id"],
  productPartial: Partial<ProductCreate>
) => {
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

export const remove = async (id: Product["id"]) => {
  products = products.filter((p) => p.id !== id);
};
