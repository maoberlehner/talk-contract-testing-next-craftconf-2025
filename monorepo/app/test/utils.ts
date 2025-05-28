import {
  type BrowserContext,
  type Page,
  test as itPlaywright,
} from "@playwright/test";

export { expect } from "@playwright/test";

type AddCookies = (
  cookies: {
    name: string;
    value: string;
    path: string;
    domain: string;
  }[]
) => Promise<void>;

export interface MockEndpointExample {
  "http-request": {
    path: string;
    method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    headers?: Record<string, string>;
  };
  "http-response": {
    status: number;
    body?: unknown;
  };
}
export interface MockEndpointExamplePartial {
  partial: MockEndpointExample;
}

interface GoToOptions {
  searchParams?: Record<string, string>;
}

type GoTo = (path: string, options?: GoToOptions) => ReturnType<Page["goto"]>;

export type MockEndpoint = (
  example: MockEndpointExample | MockEndpointExamplePartial
) => Promise<void>;

export type Precondition = ({
  addCookies,
  localStorage,
  mockEndpoint,
}: {
  addCookies: AddCookies;
  localStorage: Storage;
  mockEndpoint: MockEndpoint;
}) => void;

type Prepare = (precondition: Precondition) => Promise<void>;

export interface Driver {
  addCookies: AddCookies;
  getByLabel: Page["getByLabel"];
  getByRole: Page["getByRole"];
  getByText: Page["getByText"];
  goTo: GoTo;
  mockEndpoint: MockEndpoint;
  prepare: Prepare;
}

type ItCallback = ({ driver }: { driver: Driver }) => void | Promise<void>;

const makeLocalStorageFake = () => ({
  clear() {
    this.data = {};
  },
  data: {} as Record<string, string>,
  getItem(key: string) {
    return this.data[key] || null;
  },
  key(index: number) {
    const keys = Object.keys(this.data);
    return keys[index] || null;
  },
  get length() {
    return Object.keys(this.data).length;
  },
  removeItem(key: string) {
    delete this.data[key];
  },
  setItem(key: string, value: string) {
    this.data[key] = value;
  },
});

const makeDriver = ({
  context,
  page,
}: {
  context: BrowserContext;
  page: Page;
}): Driver => {
  const localStorageFake = makeLocalStorageFake();
  return {
    async addCookies(cookies) {
      await context.addCookies(cookies);
    },
    async goTo(path, { searchParams } = {}) {
      await page.addInitScript((state) => {
        for (const [key, value] of Object.entries(state)) {
          window.localStorage.setItem(key, value as string);
        }
      }, localStorageFake.data);

      const url = [path, new URLSearchParams(searchParams).toString()]
        .filter(Boolean)
        .join("?");
      return page.goto(url);
    },
    getByLabel(text, options = { exact: true }) {
      return page.getByLabel(text, options);
    },
    getByRole(name, options) {
      return page.getByRole(name, options);
    },
    getByText(name, options) {
      return page.getByText(name, options);
    },
    async mockEndpoint(example) {
      await fetch("http://localhost:3010/_specmatic/expectations", {
        method: "POST",
        body: JSON.stringify(example),
      });
    },
    async prepare(precondition) {
      await precondition({
        addCookies: this.addCookies,
        localStorage: localStorageFake,
        mockEndpoint: this.mockEndpoint,
      });
    },
  };
};

function wrapItCallback(func: ItCallback) {
  return ({ context, page }: { context: BrowserContext; page: Page }) => {
    const driver = makeDriver({ context, page });
    return func({ driver });
  };
}

const it = (description: string, func: ItCallback) =>
  itPlaywright(description, wrapItCallback(func));
it.only = (description: string, func: ItCallback) =>
  itPlaywright.only(description, wrapItCallback(func));

export { it };
