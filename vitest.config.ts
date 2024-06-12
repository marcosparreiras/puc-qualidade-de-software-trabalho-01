import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    env: {
      DB_CONNECTION_URL: "postgres://admin:admin@127.0.0.1:5432/my_db",
    },
  },
});
