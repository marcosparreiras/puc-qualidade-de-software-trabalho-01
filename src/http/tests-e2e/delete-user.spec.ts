import { randomUUID } from "node:crypto";
import type { Sql } from "postgres";
import postgres from "postgres";
import request from "supertest";
import { app } from "../app";
import { env } from "../../../env";
import { FakePostgresUserFactory } from "../../adapters/test-utils/fake-postgres-user-factory";

describe("DELETE /users/:id - E2E", () => {
  let dbConnection: Sql;

  beforeAll(() => {
    dbConnection = postgres(env.DB_CONNECTION_URL);
  });

  beforeEach(async () => {
    await dbConnection`DELETE FROM users`;
  });

  afterAll(async () => {
    await dbConnection.end();
  });

  it("Should be able to delete a user", async () => {
    const user = await FakePostgresUserFactory.mankeOne(dbConnection);

    const response = await request(app).delete(`/users/${user.id}`).send();

    expect(response.statusCode).toEqual(204);

    const usersOnDatabase = await dbConnection`SELECT _id FROM users`;

    expect(usersOnDatabase).toHaveLength(0);
  });

  it("Should not be able to delete an unexistent user", async () => {
    const response = await request(app).delete(`/users/${randomUUID()}`).send();
    expect(response.statusCode).toEqual(404);
  });
});
