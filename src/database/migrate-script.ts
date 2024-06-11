import { sql } from "./connection";

async function migrate() {
  await import("./schemas/create-user.js");
  await sql.end();
}

migrate();
