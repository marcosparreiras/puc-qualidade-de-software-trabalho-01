import postgres from "postgres";
import type { Sql } from "postgres";
import { PostgresUserRepository } from "./postgres-user-repository";
import { env } from "../../env";
import { FakeUserFactory } from "../domain/utils/test/fake-user-factory";
import { FakePasswordEncoder } from "../domain/utils/test/fake-password-encoder";
import { GlobalPasswordEncoder } from "../domain/utils/global-password-encoder";

describe("BcryptPasswordEncoder - Adapter", () => {
  let fakePasswordEncoder: FakePasswordEncoder;
  let dbConnection: Sql;
  let sut: PostgresUserRepository;

  beforeAll(() => {
    fakePasswordEncoder = new FakePasswordEncoder();
    GlobalPasswordEncoder.getInstance().config(fakePasswordEncoder);

    dbConnection = postgres(env.DB_CONNECTION_URL);
    sut = new PostgresUserRepository(dbConnection);
  });

  beforeEach(async () => {
    await dbConnection`DELETE FROM users`;
  });

  afterAll(async () => {
    await dbConnection`DELETE FROM users`;
    await dbConnection.end();
  });

  it("Should be able to create a user", async () => {
    const inMemoryUser = await FakeUserFactory.makeOne();

    await sut.create(inMemoryUser);

    const usersOnDatabase = await dbConnection`SELECT * FROM users`;
    expect(usersOnDatabase).toHaveLength(1);
    expect(usersOnDatabase[0]._id).toEqual(inMemoryUser.id);
    expect(usersOnDatabase[0].name).toEqual(inMemoryUser.name);
    expect(usersOnDatabase[0].email).toEqual(inMemoryUser.email);
    expect(usersOnDatabase[0].password).toEqual(inMemoryUser.passwordHash);
  });

  it("Should be able to check if an email is registered", async () => {
    const inMemoryUser = await FakeUserFactory.makeOne();
    await dbConnection`INSERT INTO users(_id, name, email, password)
          VALUES(${inMemoryUser.id}, ${inMemoryUser.name},
          ${inMemoryUser.email}, ${inMemoryUser.passwordHash})`;

    const response01 = await sut.existsByEmail(inMemoryUser.email);
    const response02 = await sut.existsByEmail("unregisterd-email");

    expect(response01).toBe(true);
    expect(response02).toBe(false);
  });

  it("Should be able to update a user", async () => {
    const inMemoryUser = await FakeUserFactory.makeOne();
    await dbConnection`INSERT INTO users(_id, name, email, password)
          VALUES(${inMemoryUser.id}, ${inMemoryUser.name},
          ${inMemoryUser.email}, ${inMemoryUser.passwordHash})`;

    inMemoryUser.name = "John doe";
    await sut.save(inMemoryUser);

    const usersOnDatabase =
      await dbConnection`SELECT * FROM users WHERE _id = ${inMemoryUser.id}`;

    expect(usersOnDatabase).toHaveLength(1);
    expect(usersOnDatabase[0]._id).toEqual(inMemoryUser.id);
    expect(usersOnDatabase[0].name).toEqual(inMemoryUser.name);
    expect(usersOnDatabase[0].email).toEqual(inMemoryUser.email);
    expect(usersOnDatabase[0].password).toEqual(inMemoryUser.passwordHash);
  });

  it("Should be able to find a user by id", async () => {
    const inMemoryUser = await FakeUserFactory.makeOne();
    await dbConnection`INSERT INTO users(_id, name, email, password)
          VALUES(${inMemoryUser.id}, ${inMemoryUser.name},
          ${inMemoryUser.email}, ${inMemoryUser.passwordHash})`;

    const result01 = await sut.findById(inMemoryUser.id);
    const result02 = await sut.findById("some-fake-id");

    expect(result01).toBeTruthy();
    expect(result01?.compare(inMemoryUser)).toBe(true);
    expect(result02).toBe(null);
  });

  it("Should be able to find many users by page", async () => {
    for (let i = 0; i < 22; i++) {
      const inMemoryUser = await FakeUserFactory.makeOne();
      await dbConnection`INSERT INTO users(_id, name, email, password)
          VALUES(${inMemoryUser.id}, ${inMemoryUser.name},
          ${inMemoryUser.email}, ${inMemoryUser.passwordHash})`;
    }

    const resultP01 = await sut.findMany(1);
    const resultP02 = await sut.findMany(2);

    expect(resultP01).toHaveLength(20);
    expect(resultP02).toHaveLength(2);
  });

  it("Should be able to delete a user", async () => {
    const inMemoryUser = await FakeUserFactory.makeOne();
    await dbConnection`INSERT INTO users(_id, name, email, password)
        VALUES(${inMemoryUser.id}, ${inMemoryUser.name},
        ${inMemoryUser.email}, ${inMemoryUser.passwordHash})`;

    await sut.delete(inMemoryUser);

    const usersOnDatabase =
      await dbConnection`SELECT * FROM users WHERE _id = ${inMemoryUser.id}`;

    expect(usersOnDatabase).toHaveLength(0);
  });
});
