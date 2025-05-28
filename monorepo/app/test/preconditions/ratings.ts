import canRateYogurtExample from "@/contract/dependencies/service-rating_examples/can-rate-yogurt.json" assert { type: "json" };
import hasRatingsYogurtExample from "@/contract/dependencies/service-rating_examples/has-ratings-yogurt.json" assert { type: "json" };
import type { Driver, MockEndpointExamplePartial } from "@/test/utils";

export const canRateYogurt = ({ driver }: { driver: Driver }) =>
  driver.mockEndpoint(canRateYogurtExample as MockEndpointExamplePartial);

export const hasRatingsYogurt = ({ driver }: { driver: Driver }) =>
  driver.mockEndpoint(hasRatingsYogurtExample as MockEndpointExamplePartial);
