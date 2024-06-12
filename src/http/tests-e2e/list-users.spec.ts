import type { Sql } from "postgres";
import postgres from "postgres";
import request from "supertest";
import { app } from "../app";
import { env } from "../../../env";
import { FakePostgresUserFactory } from "../../adapters/test-utils/fake-postgres-user-factory";

describe("GET /users - E2E", () => {
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

  it("Should be able to list users", async () => {
    await FakePostgresUserFactory.makeMany(dbConnection, 10);

    const response = await request(app).get("/users").send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.users).toHaveLength(10);
    expect(response.body.users[0]).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
      })
    );
  });

  it("Should be able to paginate the users list", async () => {
    await FakePostgresUserFactory.makeMany(dbConnection, 26);

    const response01 = await request(app).get("/users?page=1").send();
    const response02 = await request(app).get("/users?page=2").send();

    expect(response01.statusCode).toEqual(200);
    expect(response01.body.users).toHaveLength(20);

    expect(response02.statusCode).toEqual(200);
    expect(response02.body.users).toHaveLength(6);
  });
});
