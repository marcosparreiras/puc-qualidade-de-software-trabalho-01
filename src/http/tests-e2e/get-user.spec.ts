import { randomUUID } from "node:crypto";
import type { Sql } from "postgres";
import postgres from "postgres";
import request from "supertest";
import { app } from "../app";
import { env } from "../../../env";
import { FakePostgresUserFactory } from "../../adapters/test-utils/fake-postgres-user-factory";

describe("GET /users/:id - E2E", () => {
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

  it("Should be able to get a specific user", async () => {
    const user = await FakePostgresUserFactory.mankeOne(dbConnection);

    const response = await request(app).get(`/users/${user.id}`).send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        name: user.name,
        email: user.email,
        _id: user.id,
      })
    );
  });

  it("Should not be able to get an unexistent user", async () => {
    const response = await request(app).get(`/users/${randomUUID()}`).send();
    expect(response.statusCode).toEqual(404);
  });
});
