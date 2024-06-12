import postgres from "postgres";
import { env } from "../env";
import { createUsersTable } from "./schemas/create-users-table";

async function makeMigrations() {
  const dbConnection = postgres(env.DB_CONNECTION_URL);
  await createUsersTable(dbConnection);
  await dbConnection.end();
}

makeMigrations();
