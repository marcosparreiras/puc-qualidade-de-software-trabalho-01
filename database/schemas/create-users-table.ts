import type postgres from "postgres";

export async function createUsersTable(dbConnection: postgres.Sql) {
  await dbConnection`
  CREATE TABLE IF NOT EXISTS users (
    _id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
  );`;

  console.log("users table ✅");
}
