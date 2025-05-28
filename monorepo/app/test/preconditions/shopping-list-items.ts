import canAddItemExample from "@/contract/dependencies/service-shopping-list_examples/can-add-item.json" assert { type: "json" };
import hasItemsExample from "@/contract/dependencies/service-shopping-list_examples/has-items.json" assert { type: "json" };
import canDeleteItemExample from "@/contract/dependencies/service-shopping-list_examples/can-delete-item.json" assert { type: "json" };
import canToggleItemCompletedExample from "@/contract/dependencies/service-shopping-list_examples/can-toggle-item-completed.json" assert { type: "json" };
import type { Driver, MockEndpointExamplePartial } from "@/test/utils";

export const canAddItem = ({ driver }: { driver: Driver }) =>
  driver.mockEndpoint(canAddItemExample as MockEndpointExamplePartial);

export const canToggleItemCompleted = ({ driver }: { driver: Driver }) =>
  driver.mockEndpoint(
    canToggleItemCompletedExample as MockEndpointExamplePartial
  );

export const canDeleteItem = ({ driver }: { driver: Driver }) =>
  driver.mockEndpoint(canDeleteItemExample as MockEndpointExamplePartial);

export const hasItems = ({ driver }: { driver: Driver }) =>
  driver.mockEndpoint(hasItemsExample as MockEndpointExamplePartial);
