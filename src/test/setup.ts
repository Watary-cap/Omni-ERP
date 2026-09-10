import "@testing-library/jest-dom/vitest";

import { afterAll, afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";

import { installLocalStorage } from "./localStorage";
import { server } from "./msw/server";

installLocalStorage();

// Les appels réseau sont interceptés par MSW : aucun test ne sort du process.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  window.localStorage.clear();
});

afterAll(() => server.close());
