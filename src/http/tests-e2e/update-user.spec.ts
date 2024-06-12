import { randomUUID } from "node:crypto";
import type { Sql } from "postgres";
import postgres from "postgres";
import request from "supertest";
import { app } from "../app";
import { env } from "../../../env";
import { FakePostgresUserFactory } from "../../adapters/test-utils/fake-postgres-user-factory";
import { PasswordEncoderRegistry } from "../../domain/registry/password-encoder-registry";

describe("PUT /users/:id - E2E", () => {
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

  it("Should be able to update a user data", async () => {
    const oldPassword = "123456";
    const user = await FakePostgresUserFactory.mankeOne(dbConnection, {
      password: oldPassword,
    });

    const newName = "John Doe";
    const newEmail = "johndoe@example.com";

    const response = await request(app).put(`/users/${user.id}`).send({
      name: newName,
      email: newEmail,
      oldPassword: oldPassword,
      newPassword: oldPassword,
    });

    expect(response.statusCode).toEqual(200);

    const resourceUrl = new URL(response.headers["location"]);
    expect(resourceUrl).toBeTruthy();

    const checkIfUserWasUpdatedResponse = await request(app)
      .get(resourceUrl.pathname)
      .send();

    expect(checkIfUserWasUpdatedResponse.body.user).toEqual(
      expect.objectContaining({
        name: newName,
        email: newEmail,
      })
    );
  });

  it("Should be able to update a user data password", async () => {
    const oldPassword = "123456";
    const newPassword = "654321";

    const user = await FakePostgresUserFactory.mankeOne(dbConnection, {
      password: oldPassword,
    });

    const response = await request(app).put(`/users/${user.id}`).send({
      name: user.name,
      email: user.email,
      oldPassword: oldPassword,
      newPassword: newPassword,
    });

    expect(response.statusCode).toEqual(200);

    const passwordHashOnDatabase =
      await dbConnection`SELECT password FROM users WHERE _id = ${user.id}`;
    const isPasswordUpdated = await PasswordEncoderRegistry.get().compare(
      newPassword,
      passwordHashOnDatabase[0].password
    );
    expect(isPasswordUpdated).toBe(true);
  });

  it("Should not be able to update a user email for an already registered email of another user", async () => {
    const oldPassword = "123456";

    const [user, otherUser] = await Promise.all([
      FakePostgresUserFactory.mankeOne(dbConnection, {
        password: oldPassword,
      }),
      FakePostgresUserFactory.mankeOne(dbConnection),
    ]);

    const response = await request(app).put(`/users/${user.id}`).send({
      name: user.name,
      email: otherUser.email,
      oldPassword: oldPassword,
      newPassword: oldPassword,
    });

    expect(response.statusCode).toEqual(400);

    const userEmailOnDatabase =
      await dbConnection`SELECT email FROM users WHERE _id = ${user.id}`;
    expect(userEmailOnDatabase[0].email).toEqual(user.email);
  });

  it("Should not be able to update a user data with incorrect password", async () => {
    const user = await FakePostgresUserFactory.mankeOne(dbConnection);

    const response = await request(app).put(`/users/${user.id}`).send({
      name: user.name,
      email: user.email,
      oldPassword: "123456",
      newPassword: "654321",
    });

    expect(response.statusCode).toEqual(401);
  });

  it("Should not be able to update an unexistent user data", async () => {
    const response = await request(app).put(`/users/${randomUUID()}`).send({
      name: "John Doe",
      email: "johndoe@example.com",
      oldPassword: "123456",
      newPassword: "123456",
    });

    expect(response.statusCode).toEqual(404);
  });
});
