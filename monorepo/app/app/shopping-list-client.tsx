"use client";

import { Plus, Square, RotateCcw, Trash2, Star } from "lucide-react";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RatingModal } from "@/components/ui/rating-modal";
import { updateShoppingList } from "@/app/actions";
import type { ShoppingListItem } from "@/repositories/shopping-list";
import { StarRating } from "@/components/ui/star-rating";
import { cn } from "@/lib/utils";

export function ShoppingListClient({
  items: itemsInitial,
}: {
  items: ShoppingListItem[];
}) {
  const [items, updateShoppingListAction, isPending] = useActionState(
    updateShoppingList,
    itemsInitial
  );
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
  }>({
    isOpen: false,
    productId: "",
    productName: "",
  });
  const pendingItems = items.filter((item) => !item.completed);
  const completedItems = items.filter((item) => item.completed);

  const openRatingModal = (productId: string, productName: string) => {
    setRatingModal({
      isOpen: true,
      productId,
      productName,
    });
  };

  const closeRatingModal = () => {
    setRatingModal({
      isOpen: false,
      productId: "",
      productName: "",
    });
  };

  return (
    <div className="space-y-6">
      <form action={updateShoppingListAction} className="flex gap-2">
        <label htmlFor="name" className="sr-only">
          New item
        </label>
        <Input
          name="name"
          id="name"
          placeholder="Add new item..."
          className="flex-1"
          required
        />
        <input type="hidden" name="action" value="CREATE" />
        <Button disabled={isPending} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add item
        </Button>
      </form>

      <div className="space-y-2">
        {pendingItems.length > 0 && (
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Shopping List ({pendingItems.length})
          </div>
        )}
        {pendingItems.map((item) => {
          return (
            <form
              key={item.id}
              action={updateShoppingListAction}
              className="flex justify-between items-center gap-3 p-3 rounded-lg border bg-card"
            >
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="action" value="TOGGLE" />
              <button
                className={cn(
                  "flex items-center gap-3 py-1 px-2 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded text-card-foreground",
                  isPending && "opacity-70"
                )}
                disabled={isPending}
              >
                <Square className="h-4 w-4 flex-shrink-0" />
                {item.name}
              </button>
              <div className="flex items-center gap-2">
                <StarRating
                  rating={Math.round(item.rating?.average || 0)}
                  readonly
                  size="sm"
                />
                <button
                  type="button"
                  onClick={() => openRatingModal(item.productId, item.name)}
                  className="p-2 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded"
                >
                  <Star className="h-4 w-4" />
                  <span className="sr-only">Rate {item.name}</span>
                </button>
              </div>
            </form>
          );
        })}
      </div>

      {pendingItems.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          No items in your shopping list. Add some items above!
        </div>
      )}

      {completedItems.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Completed ({completedItems.length})
          </div>
          {completedItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center gap-3 p-3 rounded-lg border bg-muted/30"
            >
              <form action={updateShoppingListAction}>
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="action" value="TOGGLE" />
                <button
                  className="flex items-center gap-3 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded px-2 py-1 text-muted-foreground"
                  disabled={isPending}
                >
                  <RotateCcw className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="line-through">{item.name}</span>
                </button>
              </form>
              <form action={updateShoppingListAction} className="flex-shrink-0">
                <input type="hidden" name="id" value={item.id} />
                <input type="hidden" name="action" value="DELETE" />
                <button
                  className="p-2 hover:bg-red-50 hover:text-red-600 transition-colors rounded"
                  title="Remove item"
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete item {item.name}</span>
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={closeRatingModal}
        productId={ratingModal.productId}
        productName={ratingModal.productName}
        formAction={updateShoppingListAction}
      />
    </div>
  );
}
