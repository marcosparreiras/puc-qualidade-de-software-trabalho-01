import type { Sql } from "postgres";
import postgres from "postgres";
import request from "supertest";
import { app } from "../app";
import { env } from "../../../env";
import { FakePostgresUserFactory } from "../../adapters/test-utils/fake-postgres-user-factory";

describe("POST /users - E2E", () => {
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

  it("Should be able to create a user", async () => {
    const response = await request(app).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(201);

    const resourceUrl = new URL(response.headers["location"]);
    expect(resourceUrl).toBeTruthy();

    const checkIfUserWasCreatedResponse = await request(app)
      .get(resourceUrl.pathname)
      .send();

    expect(checkIfUserWasCreatedResponse.body.user).toEqual(
      expect.objectContaining({
        name: "John Doe",
      })
    );
  });

  it("Should not be able to create a user with duplicate e-mail", async () => {
    const user = await FakePostgresUserFactory.mankeOne(dbConnection);

    const response = await request(app).post("/users").send({
      name: "John Doe",
      email: user.email,
      password: "123456",
    });

    expect(response.statusCode).toEqual(400);
  });

  it("Should not be able to create a user with insufficient data", async () => {
    const email = "johndoe@example.com";
    const password = "123456";

    const response = await request(app).post("/users").send({
      email,
      password,
    });

    expect(response.statusCode).toEqual(400);
  });
});
