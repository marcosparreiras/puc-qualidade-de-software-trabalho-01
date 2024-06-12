import type { PasswordEncoder } from "../bondaries/password-encoder";
import { PasswordEncoderRegistry } from "../registry/password-encoder-registry";
import { FakePasswordEncoder } from "../test-utils/fake-password-encoder";
import { Password } from "./password";

describe("Password - Domain Value Object", () => {
  let fakePasswordEncoder: PasswordEncoder;
  let plainText: string;
  let hash: string;

  beforeAll(async () => {
    fakePasswordEncoder = new FakePasswordEncoder();
    PasswordEncoderRegistry.set(fakePasswordEncoder);

    plainText = "123456";
    hash = await fakePasswordEncoder.hash(plainText);
  });

  it("Should be able to hash a plain text password", async () => {
    const password = await Password.create(plainText);
    expect(password.hash).not.toEqual(plainText);
    expect(password.hash).toEqual(hash);
  });

  it("Should be able to load a hashed password", () => {
    const password = Password.laod(hash);
    expect(password.hash).not.toEqual(plainText);
    expect(password.hash).toEqual(hash);
  });

  it("Should be able validate a correct password", async () => {
    const password = Password.laod(hash);
    const isValid = await password.compare(plainText);
    expect(isValid).toBe(true);
  });

  it("Should be able detect an invalid password", async () => {
    const invalidPlainText = plainText + "invalid";
    const password = Password.laod(hash);
    const isValid = await password.compare(invalidPlainText);
    expect(isValid).toBe(false);
  });
});
