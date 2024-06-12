import postgres from "postgres";
import type { Sql } from "postgres";
import { PostgresUserRepository } from "./postgres-user-repository";
import { FakeUserFactory } from "../domain/test-utils/fake-user-factory";
import { FakePasswordEncoder } from "../domain/test-utils/fake-password-encoder";
import { FakePostgresUserFactory } from "./test-utils/fake-postgres-user-factory";
import { PasswordEncoderRegistry } from "../domain/registry/password-encoder-registry";

describe("BcryptPasswordEncoder - Adapter", () => {
  let fakePasswordEncoder: FakePasswordEncoder;
  let dbConnection: Sql;
  let sut: PostgresUserRepository;

  beforeAll(() => {
    fakePasswordEncoder = new FakePasswordEncoder();
    PasswordEncoderRegistry.set(fakePasswordEncoder);

    dbConnection = postgres(process.env.DB_CONNECTION_URL as string);
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
    expect(usersOnDatabase[0]).toEqual(
      expect.objectContaining({
        _id: inMemoryUser.id,
        name: inMemoryUser.name,
        email: inMemoryUser.email,
        password: inMemoryUser.passwordHash,
      })
    );
  });

  it("Should be able to check if an email is registered", async () => {
    const inMemoryUser = await FakePostgresUserFactory.mankeOne(dbConnection);

    const response01 = await sut.existsByEmail(inMemoryUser.email);
    const response02 = await sut.existsByEmail("unregisterd-email");

    expect(response01).toBe(true);
    expect(response02).toBe(false);
  });

  it("Should be able to update a user", async () => {
    const inMemoryUser = await FakePostgresUserFactory.mankeOne(dbConnection);

    inMemoryUser.name = "John doe";
    await sut.save(inMemoryUser);

    const usersOnDatabase =
      await dbConnection`SELECT * FROM users WHERE _id = ${inMemoryUser.id}`;

    expect(usersOnDatabase).toHaveLength(1);
    expect(usersOnDatabase[0]).toEqual(
      expect.objectContaining({
        _id: inMemoryUser.id,
        name: inMemoryUser.name,
        email: inMemoryUser.email,
        password: inMemoryUser.passwordHash,
      })
    );
  });

  it("Should be able to find a user by id", async () => {
    const inMemoryUser = await FakePostgresUserFactory.mankeOne(dbConnection);

    const result01 = await sut.findById(inMemoryUser.id);
    const result02 = await sut.findById("some-fake-id");

    expect(result01).toBeTruthy();
    expect(result01?.compare(inMemoryUser)).toBe(true);
    expect(result02).toBe(null);
  });

  it("Should be able to find many users by page", async () => {
    await FakePostgresUserFactory.mankeMany(dbConnection, 22);

    const resultP01 = await sut.findMany(1);
    const resultP02 = await sut.findMany(2);

    expect(resultP01).toHaveLength(20);
    expect(resultP02).toHaveLength(2);
  });

  it("Should be able to delete a user", async () => {
    const inMemoryUser = await FakePostgresUserFactory.mankeOne(dbConnection);

    await sut.delete(inMemoryUser);

    const usersOnDatabase =
      await dbConnection`SELECT * FROM users WHERE _id = ${inMemoryUser.id}`;

    expect(usersOnDatabase).toHaveLength(0);
  });
});
