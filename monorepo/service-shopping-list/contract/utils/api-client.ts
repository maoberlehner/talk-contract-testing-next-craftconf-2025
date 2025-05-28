import createClient from "openapi-fetch";

import type { paths as serviceShoppingListPaths } from "../../src/service-shopping-list.d.ts";

export const serviceShoppingList = createClient<serviceShoppingListPaths>({
  baseUrl: "http://localhost:3100",
});
