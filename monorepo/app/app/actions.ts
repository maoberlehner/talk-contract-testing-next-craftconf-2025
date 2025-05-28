"use server";

import { revalidatePath } from "next/cache";
import {
  createItem,
  deleteItem,
  toggleItemCompleted,
  type ShoppingListItem,
} from "@/repositories/shopping-list";
import { createRating } from "@/repositories/rating";

type Action = "CREATE" | "TOGGLE" | "DELETE" | "RATE";

export const updateShoppingList = async (
  previousItems: ShoppingListItem[],
  formData: FormData
): Promise<ShoppingListItem[]> => {
  const action = formData.get("action") as Action;

  switch (action) {
    case "CREATE": {
      const name = formData.get("name") as string;
      if (!name?.trim()) {
        throw new Error("Item name is required");
      }
      const itemNew = await createItem({
        name: name.trim(),
        completed: false,
      });
      revalidatePath("/");
      return [...previousItems, itemNew];
    }
    case "TOGGLE": {
      const id = formData.get("id") as string;
      await toggleItemCompleted(id);
      revalidatePath("/");
      return previousItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
    }
    case "DELETE": {
      const id = formData.get("id") as string;
      await deleteItem(id);
      revalidatePath("/");
      return previousItems.filter((item) => item.id !== id);
    }
    case "RATE": {
      const id = formData.get("id") as string;
      const productId = formData.get("productId") as string;
      const score = parseInt(formData.get("score")?.toString() || "0", 10);
      await createRating({
        productId,
        score,
      });
      revalidatePath("/");
      return previousItems.map((item) =>
        item.id === id
          ? {
              ...item,
              rating: {
                average: ((item.rating?.average || 0) + score) / 2,
              },
            }
          : item
      );
    }
  }
};
