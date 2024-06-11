import { InvalidUserPassword } from "../exceptions/invalid-user-password-exception";
import { FakePasswordEncoder } from "../utils/test/fake-password-encoder";
import { Password } from "../value-objects/password";
import { UserEntity } from "./user-entity";

describe("UserEntity - Domain Entity", () => {
  let name: string;
  let email: string;
  let palinTextPassowrd: string;
  let fakePasswordEncoder: FakePasswordEncoder;
  let passwordHash: string;

  beforeAll(() => {
    name = "John Doe";
    email = "johndoe@example.com";
    palinTextPassowrd = "123456";
    fakePasswordEncoder = new FakePasswordEncoder();
    passwordHash = fakePasswordEncoder.hash(palinTextPassowrd);
  });

  it("Should be able to create a new in-memory user-entity", () => {
    const user = UserEntity.create({
      name,
      email,
      password: Password.create(palinTextPassowrd, new FakePasswordEncoder()),
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
        password: Password.create(palinTextPassowrd, new FakePasswordEncoder()),
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
      password: Password.create(palinTextPassowrd, new FakePasswordEncoder()),
    });

    expect(() => user.authenticate(palinTextPassowrd)).not.throws();
  });

  it("Should not be able to authenticate a user with incorrect password", () => {
    const user = UserEntity.create({
      name,
      email,
      password: Password.create(palinTextPassowrd, new FakePasswordEncoder()),
    });

    expect(() => user.authenticate("invalid-password")).toThrowError(
      InvalidUserPassword
    );
  });

  it("Should  be able to change a user password", () => {
    const user = UserEntity.create({
      name,
      email,
      password: Password.create(palinTextPassowrd, new FakePasswordEncoder()),
    });

    const newPlainTextPassword = "new-password";
    const newPassword = Password.create(
      newPlainTextPassword,
      fakePasswordEncoder
    );

    user.chagePasword(palinTextPassowrd, newPassword);

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
      password: Password.create(palinTextPassowrd, new FakePasswordEncoder()),
    });

    const newPassword = Password.create("new-password", fakePasswordEncoder);

    expect(() =>
      user.chagePasword("incorrect-old-password", newPassword)
    ).toThrowError(InvalidUserPassword);
  });
});
