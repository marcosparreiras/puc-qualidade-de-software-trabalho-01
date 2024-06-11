import type { PasswordEncoder } from "../bondaries/password-encoder";
import { GlobalPasswordEncoder } from "../utils/global-password-encoder";
import { FakePasswordEncoder } from "../utils/test/fake-password-encoder";
import { Password } from "./password";

describe("Password - Domain Value Object", () => {
  let fakePasswordEncoder: PasswordEncoder;
  let plainText: string;
  let hash: string;

  beforeAll(() => {
    fakePasswordEncoder = new FakePasswordEncoder();
    GlobalPasswordEncoder.getInstance().config(fakePasswordEncoder);

    plainText = "123456";
    hash = fakePasswordEncoder.hash(plainText);
  });

  it("Should be able to hash a plain text password", () => {
    const password = Password.create(plainText);
    expect(password.hash).not.toEqual(plainText);
    expect(password.hash).toEqual(hash);
  });

  it("Should be able to load a hashed password", () => {
    const password = Password.laod(hash);
    expect(password.hash).not.toEqual(plainText);
    expect(password.hash).toEqual(hash);
  });

  it("Should be able validate a correct password", () => {
    const password = Password.laod(hash);
    const isValid = password.compare(plainText);
    expect(isValid).toBe(true);
  });

  it("Should be able detect an invalid password", () => {
    const invalidPlainText = plainText + "invalid";
    const password = Password.laod(hash);
    const isValid = password.compare(invalidPlainText);
    expect(isValid).toBe(false);
  });
});