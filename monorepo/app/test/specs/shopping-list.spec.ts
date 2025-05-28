import { canRateYogurt, hasRatingsYogurt } from "@/test/preconditions/ratings";
import {
  canAddItem,
  canDeleteItem,
  canToggleItemCompleted,
  hasItems,
} from "@/test/preconditions/shopping-list-items";
import { expect, it } from "@/test/utils";

it("should be possible to add items to the list", async ({ driver }) => {
  await canAddItem({ driver });

  await driver.goTo("/");
  await driver.getByLabel("New item").fill("Butter");
  await driver.getByRole("button", { name: "Add item" }).click();

  await expect(driver.getByText("Butter", { exact: true })).toBeVisible();
});

it("should be possible to complete items", async ({ driver }) => {
  await hasItems({ driver });
  await canToggleItemCompleted({ driver });

  await driver.goTo("/");
  await driver.getByRole("button", { name: "Milk", exact: true }).click();

  await expect(
    driver.getByRole("button", { name: "Delete item Milk", exact: true })
  ).toBeVisible();
});

it("should be possible delete a completed item", async ({ driver }) => {
  await hasItems({ driver });
  await canDeleteItem({ driver });

  await driver.goTo("/");
  await driver
    .getByRole("button", { name: "Delete item Bread", exact: true })
    .click();

  await expect(
    driver.getByRole("button", { name: "Delete item Bread", exact: true })
  ).not.toBeVisible();
});

it("it should be possible to rate items", async ({ driver }) => {
  await hasItems({ driver });
  await hasRatingsYogurt({ driver });
  await canRateYogurt({ driver });

  await driver.goTo("/");

  await driver
    .getByRole("button", { name: "Rate Yogurt", exact: true })
    .click();
  await driver
    .getByRole("button", { name: "Rate 5 stars", exact: true })
    .click();
  await driver
    .getByRole("button", { name: "Submit Rating", exact: true })
    .click();

  await expect(
    driver.getByText("Average rating: 3", { exact: true })
  ).toBeVisible();
});
