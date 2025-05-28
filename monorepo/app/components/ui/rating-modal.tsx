"use client";

import { useState } from "react";
import { Button } from "./button";
import { StarRating } from "./star-rating";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  formAction: (formData: FormData) => void;
}

export function RatingModal({
  isOpen,
  onClose,
  productId,
  productName,
  formAction,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate Product</DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">
            How would you rate <strong>{productName}</strong>?
          </p>
          <div className="flex justify-center">
            <StarRating rating={rating} onRatingChange={setRating} size="lg" />
          </div>
        </div>

        <form action={formAction} onSubmit={onClose}>
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="score" value={rating} />
          <input type="hidden" name="action" value="RATE" />
          <DialogFooter>
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button>Submit Rating</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
