import { InvalidUserPasswordExecption } from "../exceptions/invalid-user-password-exception";
import { GlobalPasswordEncoder } from "../proxies/global-password-encoder";
import { FakePasswordEncoder } from "../test-utils/fake-password-encoder";
import { UserEntity } from "./user-entity";

describe("UserEntity - Domain Entity", () => {
  let fakePasswordEncoder: FakePasswordEncoder;

  let name: string;
  let email: string;
  let palinTextPassowrd: string;
  let passwordHash: string;

  beforeAll(async () => {
    fakePasswordEncoder = new FakePasswordEncoder();
    GlobalPasswordEncoder.getInstance().config(fakePasswordEncoder);

    name = "John Doe";
    email = "johndoe@example.com";
    palinTextPassowrd = "123456";
    passwordHash = await fakePasswordEncoder.hash(palinTextPassowrd);
  });

  it("Should be able to create a new in-memory user-entity", async () => {
    const user = await UserEntity.create({
      name,
      email,
      password: palinTextPassowrd,
    });

    expect(user.name).toEqual("John Doe");
    expect(user.email).toEqual("johndoe@example.com");
    expect(user.passwordHash).toEqual(passwordHash);
    expect(user.id).not.toBeFalsy();
  });

  it("Should be able to load an in-memory user-entity", () => {
    const id = "some-fake-id";
    const user = UserEntity.load(
      {
        name,
        email,
        password: passwordHash,
      },
      id
    );

    expect(user.name).toEqual("John Doe");
    expect(user.email).toEqual("johndoe@example.com");
    expect(user.passwordHash).toEqual(passwordHash);
    expect(user.id).toEqual("some-fake-id");
  });

  it("Should be able to authenticate a user by password", async () => {
    const user = await UserEntity.create({
      name,
      email,
      password: palinTextPassowrd,
    });

    await expect(user.authenticate(palinTextPassowrd)).resolves.toBeUndefined();
  });

  it("Should not be able to authenticate a user with incorrect password", async () => {
    const user = await UserEntity.create({
      name,
      email,
      password: palinTextPassowrd,
    });

    await expect(() =>
      user.authenticate("invalid-password")
    ).rejects.toBeInstanceOf(InvalidUserPasswordExecption);
  });

  it("Should  be able to change a user password", async () => {
    const user = await UserEntity.create({
      name,
      email,
      password: palinTextPassowrd,
    });

    const newPlainTextPassword = "new-password";

    await user.chagePassword(palinTextPassowrd, newPlainTextPassword);

    expect(
      await fakePasswordEncoder.compare(newPlainTextPassword, user.passwordHash)
    ).toBe(true);

    expect(
      await fakePasswordEncoder.compare(palinTextPassowrd, user.passwordHash)
    ).toBe(false);
  });

  it("Should not be able to change a user password with incorrect credentials", async () => {
    const user = await UserEntity.create({
      name,
      email,
      password: palinTextPassowrd,
    });

    await expect(() =>
      user.chagePassword("incorrect-old-password", "new-password")
    ).rejects.toBeInstanceOf(InvalidUserPasswordExecption);
  });

  it("Should be able to set a user new name", async () => {
    const newName = "Jeff Alfred";
    const user = await UserEntity.create({
      name,
      email,
      password: palinTextPassowrd,
    });

    user.name = newName;

    expect(user.name).toEqual(newName);
    expect(user.name).not.toEqual(name);
  });

  it("Should be able to set a user new email", async () => {
    const newEmail = "jeffalfred@example.com";
    const user = await UserEntity.create({
      name,
      email,
      password: palinTextPassowrd,
    });

    user.email = newEmail;

    expect(user.email).toEqual(newEmail);
    expect(user.email).not.toEqual(email);
  });
});
