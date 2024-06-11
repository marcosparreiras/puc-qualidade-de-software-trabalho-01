import { InvalidUserPasswordExecption } from "../exceptions/invalid-user-password-exception";
import { GlobalPasswordEncoder } from "../utils/global-password-encoder";
import { FakePasswordEncoder } from "../utils/test/fake-password-encoder";
import { UserEntity } from "./user-entity";

describe("UserEntity - Domain Entity", () => {
  let fakePasswordEncoder: FakePasswordEncoder;

  let name: string;
  let email: string;
  let palinTextPassowrd: string;
  let passwordHash: string;

  beforeAll(() => {
    fakePasswordEncoder = new FakePasswordEncoder();
    GlobalPasswordEncoder.getInstance().config(fakePasswordEncoder);

    name = "John Doe";
    email = "johndoe@example.com";
    palinTextPassowrd = "123456";
    passwordHash = fakePasswordEncoder.hash(palinTextPassowrd);
  });

  it("Should be able to create a new in-memory user-entity", () => {
    const user = UserEntity.create({
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
        password: palinTextPassowrd,
      },
      id
    );

    expect(user.name).toEqual("John Doe");
    expect(user.email).toEqual("johndoe@example.com");
    expect(user.passwordHash).toEqual(passwordHash);
    expect(user.id).toEqual("some-fake-id");
  });

  it("Should be able to authenticate a user by password", () => {
    const user = UserEntity.create({
      name,
      email,
      password: palinTextPassowrd,
    });

    expect(() => user.authenticate(palinTextPassowrd)).not.throws();
  });

  it("Should not be able to authenticate a user with incorrect password", () => {
    const user = UserEntity.create({
      name,
      email,
      password: palinTextPassowrd,
    });

    expect(() => user.authenticate("invalid-password")).toThrowError(
      InvalidUserPasswordExecption
    );
  });

  it("Should  be able to change a user password", () => {
    const user = UserEntity.create({
      name,
      email,
      password: palinTextPassowrd,
    });

    const newPlainTextPassword = "new-password";

    user.chagePassword(palinTextPassowrd, newPlainTextPassword);

    expect(
      fakePasswordEncoder.compare(newPlainTextPassword, user.passwordHash)
    ).toBe(true);

    expect(
      fakePasswordEncoder.compare(palinTextPassowrd, user.passwordHash)
    ).toBe(false);
  });

  it("Should not be able to change a user password with incorrect credentials", () => {
    const user = UserEntity.create({
      name,
      email,
      password: palinTextPassowrd,
    });

    expect(() =>
      user.chagePassword("incorrect-old-password", "new-password")
    ).toThrowError(InvalidUserPasswordExecption);
  });

  it("Should be able to set a user new name", () => {
    const newName = "Jeff Alfred";
    const user = UserEntity.create({
      name,
      email,
      password: palinTextPassowrd,
    });

    user.name = newName;

    expect(user.name).toEqual(newName);
    expect(user.name).not.toEqual(name);
  });

  it("Should be able to set a user new email", () => {
    const newEmail = "jeffalfred@example.com";
    const user = UserEntity.create({
      name,
      email,
      password: palinTextPassowrd,
    });

    user.email = newEmail;

    expect(user.email).toEqual(newEmail);
    expect(user.email).not.toEqual(email);
  });
});
